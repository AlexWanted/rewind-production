import { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NodeHttpHandler } from '@smithy/node-http-handler';

let cachedClient: S3Client | null = null;
let cachedConfig: { bucket: string; region: string; endpoint: string; publicUrl: string } | null = null;

function getS3Config() {
  if (cachedConfig) return cachedConfig;
  
  const endpoint = process.env.S3_ENDPOINT!;
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION || 'ru-1';
  const publicUrl = process.env.S3_PUBLIC_URL!;
  const tenantId = process.env.S3_TENANT_ID!;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!;

  if (!endpoint || !bucket || !tenantId || !accessKeyId || !secretAccessKey || !publicUrl) {
    throw new Error('Missing required S3 environment variables');
  }

  cachedConfig = { endpoint, bucket, region, publicUrl };
  return cachedConfig;
}

function getClient(): S3Client {
  if (cachedClient) return cachedClient;
  
  const config = getS3Config();
  const tenantId = process.env.S3_TENANT_ID!;
  const keyId = process.env.S3_ACCESS_KEY_ID!;
  
  cachedClient = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: `${tenantId}:${keyId}`,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: 5000,
      requestTimeout: 30000,
    }),
    maxAttempts: 2,
  });

  cachedClient.middlewareStack.remove('getChecksumPlugin');
  
  return cachedClient;
}

function validateKey(key: string): string {
  const cleaned = key.replace(/^\/+/, '');
  if (cleaned.includes('..') || cleaned.includes('\0')) {
    throw new Error('Invalid key: path traversal attempt detected');
  }
  return cleaned;
}

export async function getFileFromS3(key: string): Promise<Buffer> {
  const cleanKey = validateKey(key);

  const config = getS3Config();
  const client = getClient();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
  });

  try {
    const response = await client.send(command);
    if (!response.Body) {
      throw new Error('FILE_NOT_FOUND');
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length > 100 * 1024 * 1024) {
      throw new Error('File too large (>100MB)');
    }

    return buffer;
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      throw new Error('FILE_NOT_FOUND');
    }
    throw error;
  }
}

export async function listFilesFromS3(prefix: string = ''): Promise<Array<{name: string, path: string, size: number, createdAt: Date}>> {
  const cleanPrefix = validateKey(prefix);

  const config = getS3Config();
  const client = getClient();

  const command = new ListObjectsV2Command({
    Bucket: config.bucket,
    Prefix: cleanPrefix ? `${cleanPrefix}/` : '',
  });

  const response = await client.send(command);
  
  if (!response.Contents) {
    return [];
  }

  return response.Contents
    .filter(obj => obj.Key && !obj.Key.endsWith('/'))
    .map(obj => ({
      name: obj.Key!.split('/').pop()!,
      path: `/uploads/${obj.Key!}`,
      size: obj.Size || 0,
      createdAt: obj.LastModified || new Date(),
    }));
}

export async function uploadToS3(key: string, body: Buffer, contentType: string): Promise<string> {
  const cleanKey = validateKey(key);

  const config = getS3Config();
  const client = getClient();

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
    Body: body,
    ContentType: contentType,
  });

  await client.send(command);
  return `${config.publicUrl}/${cleanKey}`;
}

export async function deleteFromS3(key: string): Promise<void> {
  const cleanKey = validateKey(key);

  const config = getS3Config();
  const client = getClient();

  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
  });

  await client.send(command);
}

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
  const cleanKey = validateKey(key);

  const config = getS3Config();
  const client = getClient();

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function getPresignedDownloadUrl(
  key: string, 
  expiresIn: number = 604800,
  options: { responseContentDisposition?: string; responseContentType?: string } = {}
): Promise<string> {
  const cleanKey = validateKey(key);

  const config = getS3Config();
  const client = getClient();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
    ResponseContentDisposition: options.responseContentDisposition,
    ResponseContentType: options.responseContentType,
  });

  return getSignedUrl(client, command, { expiresIn });
}