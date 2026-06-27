import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import ftp from 'ftp';

export const dynamic = 'force-dynamic';

// FTP Configuration from environment variables ONLY - no hardcoded defaults
const FTP_HOST = process.env.FTP_HOST!;
const FTP_USER = process.env.FTP_USER!;
const FTP_PASSWORD = process.env.FTP_PASSWORD!;
const FTP_BASE_PATH = process.env.FTP_BASE_PATH!;
const FTP_PUBLIC_URL = process.env.FTP_PUBLIC_URL!;

// Validate required environment variables
if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_BASE_PATH || !FTP_PUBLIC_URL) {
  throw new Error('Missing required FTP environment variables. Check .env.local');
}

function uploadToFTP(buffer: Buffer, remotePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = new ftp();
    
    client.on('ready', () => {
      // Create directory structure if needed
      const dirs = remotePath.split('/').filter(Boolean);
      let currentPath = '/';
      
      const createNextDir = () => {
        if (dirs.length === 0) {
          // All directories created, now upload file
          const readStream = Readable.from(buffer);
          client.put(readStream, remotePath, (err) => {
            client.end();
            if (err) reject(err);
            else resolve();
          });
          return;
        }
        
        const dir = dirs.shift()!;
        currentPath += dir + '/';
        
        client.mkdir(currentPath, true, (err) => {
          if (err && (err as any).code !== 'EEXIST') {
            client.end();
            reject(err);
          } else {
            createNextDir();
          }
        });
      };
      
      createNextDir();
    });
    
    client.on('error', (err) => {
      reject(err);
    });
    
    client.connect({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false, // Set to true if using FTPS
    });
  });
}

export async function POST(request: NextRequest) {
  console.log('--- UPLOAD REQUEST RECEIVED ---');
  try {
    console.log('Parsing form data...');
    const data = await request.formData();
    
    const file = data.get('file');
    const folder = data.get('folder') as string || 'misc';

    console.log(`Folder target: ${folder}`);
    console.log(`File received:`, file ? 'Yes' : 'No');

    if (!file || typeof file === 'string') {
      console.error('Error: No valid file found in request');
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    const fileObj = file as File;
    console.log(`File name: ${fileObj.name}, Size: ${fileObj.size} bytes, Type: ${fileObj.type}`);

    console.log('Converting file to buffer...');
    const bytes = await fileObj.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${fileObj.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Construct remote path on FTP server
    const remotePath = `${FTP_BASE_PATH}${folder}/${filename}`;
    console.log(`Uploading to FTP: ${remotePath}`);

    await uploadToFTP(buffer, remotePath);

    console.log('File uploaded successfully to FTP!');
    const url = `${FTP_PUBLIC_URL}${folder}/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('--- UPLOAD ERROR ---');
    console.error(error.message || error);
    console.error(error.stack);
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}