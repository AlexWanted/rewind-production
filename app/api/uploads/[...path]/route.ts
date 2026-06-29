import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { getPresignedDownloadUrl } from '@/lib/s3';

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

    // Try presigned redirect first — server не проксирует файлы, клиент идёт напрямую в S3
    const presignResult = await Promise.race([
      getPresignedDownloadUrl(relativePath, 3600).then(url => ({ url, error: null })),
      new Promise<{ url: null, error: string }>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), 5000)
      ),
    ]).catch((err: any) => ({ url: null, error: err.message }));

    if (presignResult.url) {
      const ext = pathSegments[pathSegments.length - 1]?.split('.').pop();
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: presignResult.url,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': getContentType(ext),
        },
      });
    }

    // Fallback to local filesystem
    const localBuffer = await tryLocalFallback(pathSegments);
    if (!localBuffer) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = pathSegments[pathSegments.length - 1]?.split('.').pop();
    return new NextResponse(new Uint8Array(localBuffer), {
      headers: {
        'Content-Type': getContentType(ext),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}