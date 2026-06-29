import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';

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
    
    // Construct S3 key
    const key = `${folder}/${filename}`;
    console.log(`Uploading to S3: ${key}`);

    const url = await uploadToS3(key, buffer, fileObj.type);

    console.log('File uploaded successfully to S3!');
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('--- UPLOAD ERROR ---');
    console.error(error.message || error);
    console.error(error.stack);
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}