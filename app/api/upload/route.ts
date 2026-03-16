import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

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
    
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    console.log(`Target directory: ${uploadDir}`);

    if (!existsSync(uploadDir)) {
      console.log('Directory does not exist, creating it...');
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    console.log(`Writing file to: ${filepath}`);
    await writeFile(filepath, buffer);

    console.log('File written successfully!');
    const url = `/uploads/${folder}/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('--- UPLOAD ERROR ---');
    console.error(error.message || error);
    console.error(error.stack);
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
