import ftp from 'ftp';
import { Readable } from 'stream';

const FTP_HOST = process.env.FTP_HOST!;
const FTP_USER = process.env.FTP_USER!;
const FTP_PASSWORD = process.env.FTP_PASSWORD!;
const FTP_BASE_PATH = process.env.FTP_BASE_PATH!;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_BASE_PATH) {
  throw new Error('Missing required FTP environment variables');
}

function validateRelativePath(relativePath: string): void {
  if (relativePath.includes('..') || relativePath.startsWith('/') || relativePath.includes('\0')) {
    throw new Error('Invalid path: path traversal attempt detected');
  }
}

function createFTPClient(): ftp {
  const client = new ftp();
  return client;
}

function connectFTP(client: ftp): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.end();
      reject(new Error('FTP connection timeout (10s)'));
    }, 10000);

    client.on('ready', () => {
      clearTimeout(timeout);
      resolve();
    });

    client.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    client.connect({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false,
    });
  });
}

export async function getFTPClient(): Promise<ftp> {
  const client = createFTPClient();
  await connectFTP(client);
  return client;
}

export async function getFileFromFTP(relativePath: string): Promise<Buffer> {
  validateRelativePath(relativePath);

  const client = createFTPClient();
  const remotePath = `${FTP_BASE_PATH}${relativePath}`;

  try {
    await connectFTP(client);

    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const opTimeout = setTimeout(() => {
        client.end();
        reject(new Error('FTP operation timeout (30s)'));
      }, 30000);

      client.get(remotePath, (err, stream) => {
        if (err) {
          clearTimeout(opTimeout);
          client.end();
          const ftpErr = err as any;
          if (ftpErr.code === 550 || ftpErr.code === 'ENOENT' || err.message.includes('No such file')) {
            reject(new Error('FILE_NOT_FOUND'));
          } else {
            reject(err);
          }
          return;
        }

        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
          clearTimeout(opTimeout);
          client.end();
          resolve(Buffer.concat(chunks));
        });
        stream.on('error', (err) => {
          clearTimeout(opTimeout);
          client.end();
          reject(err);
        });
      });
    });

    if (fileBuffer.length > 100 * 1024 * 1024) {
      throw new Error('File too large (>100MB)');
    }

    return fileBuffer;
  } catch (error) {
    client.end();
    throw error;
  }
}

export async function listFilesFromFTP(relativePath: string = ''): Promise<Array<{name: string, path: string, size: number, createdAt: Date}>> {
  validateRelativePath(relativePath);

  const client = createFTPClient();
  const baseRemotePath = FTP_BASE_PATH + (relativePath ? `${relativePath}/` : '');

  try {
    await connectFTP(client);

    const results: Array<{name: string, path: string, size: number, createdAt: Date}> = [];

    const listRecursive = (currentPath: string, currentRelativePath: string): Promise<void> => {
      return new Promise((resolveDir, rejectDir) => {
        client.list(currentPath, (err, list) => {
          if (err) {
            rejectDir(err);
            return;
          }

          const entries = list || [];
          let completed = 0;

          if (entries.length === 0) {
            resolveDir();
            return;
          }

          const processNext = (index: number) => {
            if (index >= entries.length) {
              resolveDir();
              return;
            }

            const entry = entries[index];
            const entryRelativePath = currentRelativePath ? `${currentRelativePath}/${entry.name}` : entry.name;
            const entryPath = `/uploads/${entryRelativePath}`;

            if (entry.type === 'd') {
              results.push({
                name: entry.name,
                path: entryPath,
                size: 0,
                createdAt: entry.date || new Date(),
              });
              listRecursive(`${currentPath}/${entry.name}`, entryRelativePath)
                .then(() => processNext(index + 1))
                .catch(rejectDir);
            } else {
              results.push({
                name: entry.name,
                path: entryPath,
                size: entry.size || 0,
                createdAt: entry.date || new Date(),
              });
              processNext(index + 1);
            }
          };

          processNext(0);
        });
      });
    };

    await listRecursive(baseRemotePath, relativePath);
    client.end();
    return results;
  } catch (error) {
    client.end();
    throw error;
  }
}