// ponytail: presigned URL живут 7 дней, кешируем на час (продлено с 1ч до 6ч)
const presignCache = new Map<string, { urls: Record<string, string>; expiry: number }>();

async function fetchPresign(keys: string[], attempt = 1): Promise<Record<string, string> | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('/api/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) return null;
    const { urls } = await response.json();
    return urls;
  } catch {
    if (attempt < 2) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchPresign(keys, attempt + 1);
    }
    return null;
  }
}

export async function presignUrls(keys: string[]): Promise<Record<string, string>> {
  if (keys.length === 0) return {};

  const cacheKey = [...keys].sort().join('\x00');
  const cached = presignCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.urls;

  const urls = await fetchPresign(keys);
  if (!urls) {
    console.error('Failed to presign URLs');
    return {};
  }

  presignCache.set(cacheKey, { urls, expiry: Date.now() + 21_600_000 }); // 6ч кеша
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
