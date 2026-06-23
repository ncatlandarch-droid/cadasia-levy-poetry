// ================================================================
// Gumroad API Proxy — Digital Products & Sales
// Endpoint: /api/gumroad-products
// Env vars needed: GUMROAD_ACCESS_TOKEN
// ================================================================

const GUMROAD_API = 'https://api.gumroad.com/v2';

export default async function handler(req) {
  const token = process.env.GUMROAD_ACCESS_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({
      error: 'GUMROAD_ACCESS_TOKEN not configured',
      note: 'Add your Gumroad access token to Netlify env vars'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const url = new URL(req.url, 'https://localhost');
  const action = url.searchParams.get('action') || 'list';

  try {
    // LIST products
    if (req.method === 'GET' && action === 'list') {
      const res = await fetch(`${GUMROAD_API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return json(data);
    }

    // LIST sales
    if (req.method === 'GET' && action === 'sales') {
      const page = url.searchParams.get('page') || '1';
      const res = await fetch(`${GUMROAD_API}/sales?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return json(data);
    }

    // GET single product
    if (req.method === 'GET' && action === 'get') {
      const productId = url.searchParams.get('id');
      if (!productId) return json({ error: 'Missing product id' }, 400);
      const res = await fetch(`${GUMROAD_API}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return json(data);
    }

    // CREATE product
    if (req.method === 'POST' && action === 'create') {
      const body = await req.json();
      const form = new URLSearchParams();
      form.append('access_token', token);
      if (body.name) form.append('name', body.name);
      if (body.price) form.append('price', String(body.price * 100)); // cents
      if (body.description) form.append('description', body.description);
      if (body.preview_url) form.append('preview_url', body.preview_url);
      if (body.url) form.append('url', body.url);

      const res = await fetch(`${GUMROAD_API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString()
      });
      const data = await res.json();
      return json(data);
    }

    // UPDATE product
    if (req.method === 'PUT') {
      const body = await req.json();
      const productId = url.searchParams.get('id') || body.id;
      if (!productId) return json({ error: 'Missing product id' }, 400);

      const form = new URLSearchParams();
      form.append('access_token', token);
      if (body.name) form.append('name', body.name);
      if (body.price !== undefined) form.append('price', String(body.price * 100));
      if (body.description) form.append('description', body.description);
      if (body.published !== undefined) form.append('published', String(body.published));

      const res = await fetch(`${GUMROAD_API}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString()
      });
      const data = await res.json();
      return json(data);
    }

    // DELETE product
    if (req.method === 'DELETE') {
      const productId = url.searchParams.get('id');
      if (!productId) return json({ error: 'Missing product id' }, 400);

      const form = new URLSearchParams();
      form.append('access_token', token);

      const res = await fetch(`${GUMROAD_API}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString()
      });
      const data = await res.json();
      return json(data);
    }

    return json({ error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
  });
}

export const config = {
  path: '/api/gumroad-products'
};
