import { NextRequest, NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    const { keys } = await request.json();

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: 'keys must be a non-empty array' }, { status: 400 });
    }

    if (keys.length > 50) {
      return NextResponse.json({ error: 'Too many keys (max 50)' }, { status: 400 });
    }

    const urls: Record<string, string> = {};

    await Promise.all(
      keys.map(async (key: string) => {
        try {
          const url = await getPresignedDownloadUrl(key, 604800);
          urls[key] = url;
        } catch (error) {
          console.error(`Failed to generate presigned URL for ${key}:`, error);
        }
      })
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Presign error:', error);
    return NextResponse.json({ error: 'Failed to generate presigned URLs' }, { status: 500 });
  }
}
