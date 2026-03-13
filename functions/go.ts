import { buildClickKey, todayUtc } from '../src/lib/analytics';

interface Env {
  CLICK_KV: KVNamespace;
  PRODUCTS_JSON: string; // env var with products JSON
}

interface ClickRequest {
  product: string;
  channel?: string;
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Allowed URL pattern – only allow URLs that start with known prefixes from products.yaml
// The actual URL is fetched from the in-memory product list to prevent open redirects.
function getDestinationUrl(
  products: Array<{ slug: string; channels: Record<string, string> }>,
  req: ClickRequest
): { url: string; channel: string } | null {
  const product = products.find(p => p.slug === req.product);
  if (!product) return null;

  const active: Record<string, string> = {};
  for (const [key, val] of Object.entries(product.channels)) {
    if (val && val.length > 0) {
      active[key.replace('_url', '')] = val;
    }
  }

  if (req.channel && active[req.channel]) {
    return { url: active[req.channel] ?? '', channel: req.channel };
  }

  // fallback priority
  for (const ch of ['booth', 'note', 'base', 'gumroad', 'stripe']) {
    if (active[ch]) return { url: active[ch] ?? '', channel: ch };
  }
  return null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const product = url.searchParams.get('product') ?? '';
  const channel = url.searchParams.get('channel') ?? undefined;
  const ref = url.searchParams.get('ref') ?? 'direct';

  if (!product) {
    return new Response(
      JSON.stringify({ error: 'product parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Load products from KV or env
  let products: Array<{ slug: string; channels: Record<string, string> }> = [];
  try {
    const raw = context.env.PRODUCTS_JSON;
    const parsed = JSON.parse(raw) as { products: typeof products };
    products = parsed.products;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const destination = getDestinationUrl(products, { product, channel, ref });
  if (!destination) {
    return new Response(
      JSON.stringify({ error: `Product '${product}' not found or no URL configured for channel '${channel ?? 'any'}'` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Record click in KV (fire and forget, don't block redirect)
  const date = todayUtc();
  const key = buildClickKey(product, destination.channel, ref, date);
  const kv = context.env.CLICK_KV;
  if (kv) {
    try {
      const current = await kv.get(key);
      const count = parseInt(current ?? '0', 10) + 1;
      await kv.put(key, count.toString(), { expirationTtl: 60 * 60 * 24 * 365 });
    } catch {
      // KV failure should not block redirect
      console.error(`KV write failed for key: ${key}`);
    }
  }

  return Response.redirect(destination.url, 302);
};
