export async function presignUrls(keys: string[]): Promise<Record<string, string>> {
  if (keys.length === 0) return {};

  const response = await fetch('/api/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keys }),
  });

  if (!response.ok) {
    console.error('Failed to presign URLs');
    return {};
  }

  const { urls } = await response.json();
  return urls;
}

export function extractKeyFromUrl(url: string): string | null {
  if (!url) return null;
  
  const s3PublicUrl = 'https://s3.cloud.ru/bucket-8c74b8';
  
  if (url.startsWith(s3PublicUrl)) {
    return url.replace(`${s3PublicUrl}/`, '');
  }
  
  if (url.includes('X-Amz-Algorithm')) {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/[^/]+\//, '');
  }
  
  return url.replace(/^\/+/, '');
}
