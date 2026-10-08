// Vercel Function: shared GLOBAL GOOD BOY POINTS counter.
//
// Works with any Upstash Redis database (free tier is fine). Add one in Vercel:
//   Project → Storage → Upstash (Redis) → connect to this project.
// That sets KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN) automatically.
// Until those env vars exist, this returns 503 and the site shows "NOT CONNECTED YET" — no fake numbers.
//
// GET  /api/global              -> { total }
// POST /api/global {pets: n}    -> { total }   (n is capped per request to keep it honest-ish)

const KEY = 'goodboy:global:gbp';
const MAX_PER_REQUEST = 200; // the client flushes every 4s; 200 = 50 pets/sec

function redis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return async (cmd: (string | number)[]) => {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(cmd),
    });
    if (!r.ok) throw new Error(`redis ${r.status}`);
    return (await r.json()).result;
  };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function GET() {
  const r = redis();
  if (!r) return json({ error: 'not configured' }, 503);
  try {
    return json({ total: Number((await r(['GET', KEY])) ?? 0) });
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
}

export async function POST(request: Request) {
  const r = redis();
  if (!r) return json({ error: 'not configured' }, 503);
  let pets = 0;
  try {
    const body = await request.json();
    pets = Math.floor(Number(body?.pets));
  } catch {
    return json({ error: 'bad body' }, 400);
  }
  if (!Number.isFinite(pets) || pets <= 0) return json({ error: 'bad pets' }, 400);
  pets = Math.min(pets, MAX_PER_REQUEST);
  try {
    return json({ total: Number(await r(['INCRBY', KEY, pets])) });
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
}
