// ================================================================
// Printify API Proxy — Merch Products & Orders
// Endpoint: /api/admin-orders
// Env vars needed: PRINTIFY_API_TOKEN
// ================================================================

const PRINTIFY_API = 'https://api.printify.com/v1';

export default async function handler(req) {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    return json({
      error: 'PRINTIFY_API_TOKEN not configured',
      note: 'Add your Printify API token to Netlify env vars'
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const url = new URL(req.url, 'https://localhost');
  const action = url.searchParams.get('action') || 'all';

  try {
    // Step 1: Get shop ID
    const shopsRes = await fetch(`${PRINTIFY_API}/shops.json`, { headers });
    const shops = await shopsRes.json();

    if (!shops || shops.length === 0) {
      return json({ error: 'No Printify shops found', shops: [] });
    }

    const shopId = shops[0].id;
    const shopTitle = shops[0].title;

    // GET PRODUCTS
    if (action === 'products' || action === 'all') {
      const productsRes = await fetch(
        `${PRINTIFY_API}/shops/${shopId}/products.json?limit=50`,
        { headers }
      );
      const productsData = await productsRes.json();
      const products = productsData.data || productsData || [];

      if (action === 'products') {
        return json({ success: true, shop: shopTitle, shopId, products });
      }

      // GET ORDERS
      const ordersRes = await fetch(
        `${PRINTIFY_API}/shops/${shopId}/orders.json?limit=50`,
        { headers }
      );
      const ordersData = await ordersRes.json();
      const orders = ordersData.data || ordersData || [];

      // Calculate KPIs
      let totalOrders = orders.length;
      let totalRevenue = 0;
      let pendingOrders = 0;
      let fulfilledOrders = 0;

      orders.forEach(order => {
        const cost = order.total_price || 0;
        totalRevenue += cost / 100; // cents to dollars

        const status = (order.status || '').toLowerCase();
        if (status === 'fulfilled' || status === 'delivered' || status === 'shipped') {
          fulfilledOrders++;
        } else {
          pendingOrders++;
        }
      });

      return json({
        success: true,
        shop: {
          id: shopId,
          title: shopTitle
        },
        products: products.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags || [],
          images: (p.images || []).map(img => img.src || img),
          variants: (p.variants || []).map(v => ({
            id: v.id,
            title: v.title,
            price: v.price,
            is_enabled: v.is_enabled
          })),
          visible: p.visible,
          is_locked: p.is_locked,
          created_at: p.created_at,
          sales_channel_properties: p.sales_channel_properties
        })),
        orders: orders.map(o => ({
          id: o.id,
          status: o.status,
          total_price: o.total_price,
          total_shipping: o.total_shipping,
          created_at: o.created_at,
          line_items: (o.line_items || []).map(li => ({
            product_id: li.product_id,
            title: li.metadata?.title || 'Product',
            variant_label: li.metadata?.variant_label || '',
            quantity: li.quantity,
            price: li.metadata?.price || 0
          })),
          address_to: o.address_to ? {
            first_name: o.address_to.first_name,
            last_name: o.address_to.last_name,
            city: o.address_to.city,
            region: o.address_to.region,
            country: o.address_to.country
          } : null
        })),
        kpis: {
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          pendingOrders,
          fulfilledOrders,
          productCount: products.length,
          avgOrder: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'
        },
        timestamp: new Date().toISOString()
      });
    }

    return json({ error: 'Unknown action' }, 400);

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
  path: '/api/admin-orders'
};
