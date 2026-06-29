import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { getFileFromFTP } from '@/lib/ftp';

export const dynamic = 'force-dynamic';

function getContentType(ext: string | undefined): string {
  if (!ext) return 'application/octet-stream';
  switch (ext.toLowerCase()) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

async function tryLocalFallback(pathSegments: string[]): Promise<Buffer | null> {
  const filePath = join(process.cwd(), 'public', 'uploads', ...pathSegments);
  if (!existsSync(filePath)) return null;
  return readFile(filePath);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const relativePath = pathSegments.join('/');

    // Try FTP first
    try {
      const fileBuffer = await getFileFromFTP(relativePath);
      
      const ext = pathSegments[pathSegments.length - 1]?.split('.').pop();
      const contentType = getContentType(ext);

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (ftpError: any) {
      const isNotFound = ftpError.message === 'FILE_NOT_FOUND';
      const isConnectionError = 
        ftpError.code === 'ECONNREFUSED' || 
        ftpError.code === 'ETIMEDOUT' ||
        ftpError.message.includes('timeout') ||
        ftpError.message.includes('connection');

      if (!isNotFound && !isConnectionError) {
        console.error('FTP error serving file:', ftpError);
      }

      // Fallback to local
      const localBuffer = await tryLocalFallback(pathSegments);
      if (!localBuffer) {
        return new NextResponse('File not found', { status: 404 });
      }

      const ext = pathSegments[pathSegments.length - 1]?.split('.').pop();
      const contentType = getContentType(ext);

      return new NextResponse(new Uint8Array(localBuffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}