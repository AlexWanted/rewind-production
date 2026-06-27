import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

// Move file reading to module scope to avoid reading on every request
const readDirRecursive = async (dir: string, currentPath: string): Promise<any[]> => {
  const entries = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      const relativePath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        return readDirRecursive(fullPath, relativePath);
      } else {
        const fileStat = await stat(fullPath);
        return {
          name: entry.name,
          path: `/uploads/${relativePath.replace(/\\/g, '/')}`,
          size: fileStat.size,
          createdAt: fileStat.birthtime,
        };
      }
    })
  );

  return files.flat();
};

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readDirRecursive(uploadsDir, '');
    
    return NextResponse.json({ files });
  } catch (error: any) {
    console.error('Error reading files:', error);
    return NextResponse.json({ error: 'Failed to read files' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath || !filePath.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const absolutePath = join(process.cwd(), 'public', filePath);

    if (existsSync(absolutePath)) {
      await unlink(absolutePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
