// ================================================================
// Admin Orders API — Proxies Printify store data for the admin dashboard
// Endpoint: /api/admin-orders
// Env vars needed: PRINTIFY_API_TOKEN
// ================================================================

const WTH_PRODUCTS = [
  { id: 1, name: '"Breathe" Signature T-Shirt', thumbnail: null, price: '$34.99', synced: true },
  { id: 2, name: '"Am I The Reason?" Ceramic Mug', thumbnail: null, price: '$18.99', synced: true },
  { id: 3, name: '"Can I Escape?" Art Print', thumbnail: null, price: '$29.99', synced: true },
  { id: 4, name: 'Nubian Dragon Queen Print', thumbnail: null, price: '$34.99', synced: true },
  { id: 5, name: 'Poetry Book — Words That Heal', thumbnail: null, price: '$24.99', synced: true }
];

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiToken = process.env.PRINTIFY_API_TOKEN;

  if (!apiToken) {
    // Return fallback product catalog with no orders
    return new Response(JSON.stringify({
      store: null,
      storeName: 'Words That Heal',
      orders: [],
      products: WTH_PRODUCTS,
      summary: {
        total_orders: 0,
        status_counts: {},
        total_revenue: '0.00'
      },
      note: 'PRINTIFY_API_TOKEN not configured. Showing fallback product catalog.',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Get shops
    const shopsRes = await fetch('https://api.printify.com/v1/shops.json', { headers });
    const shops = await shopsRes.json();
    const shopId = shops[0]?.id;

    if (!shopId) {
      return new Response(JSON.stringify({
        error: 'No Printify shop found',
        products: WTH_PRODUCTS,
        orders: [],
        summary: { total_orders: 0 }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Get orders
    const ordersRes = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, { headers });
    const ordersData = await ordersRes.json();
    const orders = ordersData.data || [];

    // 3. Get products
    let products = WTH_PRODUCTS;
    try {
      const productsRes = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, { headers });
      const productsData = await productsRes.json();
      const apiProducts = productsData.data || [];
      if (apiProducts.length > 0) {
        products = apiProducts.map(p => ({
          id: p.id,
          name: p.title,
          thumbnail: p.images?.[0]?.src || null,
          variants: p.variants?.length || 0,
          synced: true
        }));
      }
    } catch (e) {
      console.log('Products API unavailable, using local catalog');
    }

    // Summary
    let totalRevenue = 0;
    const statusCounts = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      totalRevenue += parseFloat(order.total_price || 0) / 100;
    });

    return new Response(JSON.stringify({
      store: shops[0],
      storeName: 'Words That Heal',
      orders: orders.slice(0, 50).map(o => ({
        id: o.id,
        status: o.status,
        created_at: o.created_at,
        line_items: (o.line_items || []).map(item => ({
          title: item.metadata?.title || 'Product',
          quantity: item.quantity,
          price: item.metadata?.price || 0
        })),
        address_to: o.address_to ? {
          name: `${o.address_to.first_name} ${o.address_to.last_name}`,
          city: o.address_to.city,
          state: o.address_to.region
        } : null,
        total_price: o.total_price,
        total_shipping: o.total_shipping
      })),
      products: products,
      summary: {
        total_orders: orders.length,
        status_counts: statusCounts,
        total_revenue: totalRevenue.toFixed(2)
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  path: '/api/admin-orders'
};
