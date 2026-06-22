// ================================================================
// Admin Analytics API — Proxies Netlify Analytics data
// Endpoint: /api/admin-analytics
// Env vars needed: NETLIFY_AUTH_TOKEN
// ================================================================

const SITE_ID = '1a01da7a-5a68-4c07-a786-1d5ef31d34f6';

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const authToken = process.env.NETLIFY_AUTH_TOKEN;

  if (!authToken) {
    return new Response(JSON.stringify({
      error: 'NETLIFY_AUTH_TOKEN not configured',
      note: 'Add your Netlify personal access token to env vars'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Get site info (includes bandwidth)
    const siteRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}`,
      { headers }
    );
    const site = await siteRes.json();

    // 2. Get bandwidth usage
    const bandwidthRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/bandwidth`,
      { headers }
    );
    const bandwidth = await bandwidthRes.json();

    // 3. Get Netlify Analytics — pageviews & visitors (last 30 days)
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    let pageviewsData = null;
    let visitorsData = null;
    let pagesData = null;
    let sourcesData = null;

    // Try Netlify Analytics endpoints
    try {
      const pvRes = await fetch(
        `https://analytics.services.netlify.com/v2/${SITE_ID}/pageviews?from=${thirtyDaysAgo}&to=${now}&timezone=America/New_York&resolution=day`,
        { headers }
      );
      if (pvRes.ok) pageviewsData = await pvRes.json();
    } catch (e) { /* Analytics API may not be available */ }

    try {
      const uvRes = await fetch(
        `https://analytics.services.netlify.com/v2/${SITE_ID}/visitors?from=${thirtyDaysAgo}&to=${now}&timezone=America/New_York&resolution=day`,
        { headers }
      );
      if (uvRes.ok) visitorsData = await uvRes.json();
    } catch (e) {}

    try {
      const pgRes = await fetch(
        `https://analytics.services.netlify.com/v2/${SITE_ID}/ranking/pages?from=${thirtyDaysAgo}&to=${now}&timezone=America/New_York&limit=10`,
        { headers }
      );
      if (pgRes.ok) pagesData = await pgRes.json();
    } catch (e) {}

    try {
      const srcRes = await fetch(
        `https://analytics.services.netlify.com/v2/${SITE_ID}/ranking/sources?from=${thirtyDaysAgo}&to=${now}&timezone=America/New_York&limit=10`,
        { headers }
      );
      if (srcRes.ok) sourcesData = await srcRes.json();
    } catch (e) {}

    // 4. Recent deploys
    const deploysRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys?per_page=5`,
      { headers }
    );
    const deploys = await deploysRes.json();

    // 5. Forms submissions
    let formsData = {};
    try {
      const formsRes = await fetch(
        `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`,
        { headers }
      );
      const forms = await formsRes.json();
      for (const form of forms) {
        const subsRes = await fetch(
          `https://api.netlify.com/api/v1/forms/${form.id}/submissions?per_page=50`,
          { headers }
        );
        const submissions = await subsRes.json();
        formsData[form.name] = {
          id: form.id,
          count: form.submission_count,
          submissions: submissions.map(s => ({
            id: s.id,
            created_at: s.created_at,
            data: s.data
          }))
        };
      }
    } catch (e) {}

    return new Response(JSON.stringify({
      site: {
        name: site.name,
        url: site.ssl_url || site.url,
        custom_domain: site.custom_domain,
        published_deploy: site.published_deploy ? {
          id: site.published_deploy.id,
          created_at: site.published_deploy.created_at,
          title: site.published_deploy.title
        } : null
      },
      bandwidth: {
        used: bandwidth.used,
        included: bandwidth.included,
        period_start: bandwidth.period_start_date,
        period_end: bandwidth.period_end_date
      },
      analytics: {
        pageviews: pageviewsData,
        visitors: visitorsData,
        topPages: pagesData,
        topSources: sourcesData
      },
      deploys: (deploys || []).slice(0, 5).map(d => ({
        id: d.id,
        created_at: d.created_at,
        state: d.state,
        title: d.title,
        deploy_time: d.deploy_time,
        branch: d.branch
      })),
      forms: formsData,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  path: '/api/admin-analytics'
};
