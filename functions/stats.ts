interface Env {
  CLICK_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

interface ClickEntry {
  product: string;
  channel: string;
  ref: string;
  date: string;
  count: number;
}

function parseDateRange(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Token protection
  const authHeader = context.request.headers.get('Authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!context.env.ADMIN_TOKEN || token !== context.env.ADMIN_TOKEN) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Bearer realm="stats"' },
    });
  }

  const url = new URL(context.request.url);
  const days = Math.min(parseInt(url.searchParams.get('days') ?? '14', 10), 90);

  const dates = parseDateRange(days);
  const entries: ClickEntry[] = [];

  const kv = context.env.CLICK_KV;
  if (kv) {
    // List keys with prefix "clicks:" for each date
    for (const date of dates) {
      const prefix = `clicks:`;
      try {
        const list = await kv.list({ prefix, limit: 1000 });
        for (const key of list.keys) {
          if (!key.name.endsWith(`:${date}`)) continue;
          const parts = key.name.split(':');
          if (parts.length < 5) continue;
          const [, product, channel, ref] = parts;
          if (!product || !channel || !ref) continue;
          const val = await kv.get(key.name);
          entries.push({
            product,
            channel,
            ref,
            date,
            count: parseInt(val ?? '0', 10),
          });
        }
      } catch (err) {
        console.error('KV list error:', err);
      }
    }
  }

  // Build HTML table
  const totalClicks = entries.reduce((s, e) => s + e.count, 0);
  const byProduct: Record<string, number> = {};
  const byChannel: Record<string, number> = {};

  for (const e of entries) {
    byProduct[e.product] = (byProduct[e.product] ?? 0) + e.count;
    byChannel[e.channel] = (byChannel[e.channel] ?? 0) + e.count;
  }

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stats — Digital Sales Starter Kit</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; color: #111; }
  h1 { font-size: 1.5rem; }
  .summary { display: flex; gap: 1.5rem; margin: 1.5rem 0; flex-wrap: wrap; }
  .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem 1.5rem; min-width: 140px; }
  .stat-card .label { font-size: 0.8rem; color: #6b7280; }
  .stat-card .value { font-size: 1.75rem; font-weight: 700; color: #2563eb; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
  th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  tr:hover td { background: #f9fafb; }
  .note { font-size: 0.8rem; color: #9ca3af; margin-top: 2rem; }
</style>
</head>
<body>
<h1>Click Stats (直近${days}日)</h1>
<div class="summary">
  <div class="stat-card">
    <div class="label">総クリック</div>
    <div class="value">${totalClicks.toLocaleString()}</div>
  </div>
  <div class="stat-card">
    <div class="label">商品数</div>
    <div class="value">${Object.keys(byProduct).length}</div>
  </div>
  <div class="stat-card">
    <div class="label">チャネル数</div>
    <div class="value">${Object.keys(byChannel).length}</div>
  </div>
</div>

<h2>商品別</h2>
<table>
<thead><tr><th>商品</th><th>クリック数</th></tr></thead>
<tbody>
${Object.entries(byProduct).sort((a,b)=>b[1]-a[1]).map(([p,c])=>`<tr><td>${p}</td><td>${c}</td></tr>`).join('')}
</tbody>
</table>

<h2>チャネル別</h2>
<table>
<thead><tr><th>チャネル</th><th>クリック数</th></tr></thead>
<tbody>
${Object.entries(byChannel).sort((a,b)=>b[1]-a[1]).map(([ch,c])=>`<tr><td>${ch}</td><td>${c}</td></tr>`).join('')}
</tbody>
</table>

<h2>詳細（直近${days}日・降順）</h2>
<table>
<thead><tr><th>日付</th><th>商品</th><th>チャネル</th><th>ref</th><th>クリック</th></tr></thead>
<tbody>
${entries.sort((a,b)=>b.date.localeCompare(a.date)||(b.count-a.count)).slice(0, 500).map(e=>`<tr><td>${e.date}</td><td>${e.product}</td><td>${e.channel}</td><td>${e.ref}</td><td>${e.count}</td></tr>`).join('')}
</tbody>
</table>

<p class="note">
  ※ データはCloudflare Workers KVから取得しています。<br>
  ※ IPアドレス・個人情報は保存していません。<br>
  ※ ?days=N で集計期間を変更できます（最大90日）。
</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
