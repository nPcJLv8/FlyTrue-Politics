// Cloudflare Pages Function.
// Placed at functions/api/sync.js, this automatically becomes the endpoint
// /api/sync on your deployed site — no extra routing config needed.
//
// GET  -> returns your saved progress + notes.
// POST -> saves new progress + notes, only if the password matches.
//
// The password lives in the SYNC_SECRET environment variable, set in the
// Cloudflare dashboard (Settings > Environment variables, marked "Encrypt").
// It is never written into any file that gets deployed, so it's never
// visible to anyone viewing the site's source or network requests except
// as the header value your own browser sends.

export async function onRequestGet(context) {
  const { env, request } = context;
  const secret = request.headers.get('X-Sync-Secret') || '';

  if (!env.SYNC_SECRET || secret !== env.SYNC_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const value = await env.FLYTRUE_KV.get('progress');
  return new Response(JSON.stringify({ value }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const secret = request.headers.get('X-Sync-Secret') || '';

  if (!env.SYNC_SECRET || secret !== env.SYNC_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.text();

  // Don't store anything that isn't even valid JSON.
  try {
    JSON.parse(body);
  } catch (e) {
    return new Response('Bad request: not valid JSON', { status: 400 });
  }

  await env.FLYTRUE_KV.put('progress', body);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
