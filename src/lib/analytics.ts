export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export function appendUtm(url: string, params: UtmParams): string {
  const u = new URL(url);
  if (params.source) u.searchParams.set('utm_source', params.source);
  if (params.medium) u.searchParams.set('utm_medium', params.medium);
  if (params.campaign) u.searchParams.set('utm_campaign', params.campaign);
  if (params.content) u.searchParams.set('utm_content', params.content);
  if (params.term) u.searchParams.set('utm_term', params.term);
  return u.toString();
}

export function buildClickKey(
  product: string,
  channel: string,
  ref: string,
  date: string
): string {
  // format: clicks:{product}:{channel}:{ref}:{YYYY-MM-DD}
  const safeRef = ref.replace(/[^a-zA-Z0-9_-]/g, '') || 'direct';
  return `clicks:${product}:${channel}:${safeRef}:${date}`;
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}
