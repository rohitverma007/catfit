// Vercel Serverless Function — Strava activities proxy
// Proxies requests to Strava API to avoid CORS issues
// The client sends its access token; this function forwards it to Strava

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  // Forward query params (after, before, page, per_page)
  const { after, before, page = '1', per_page = '30' } = req.query;
  const params = new URLSearchParams();
  if (after) params.set('after', after);
  if (before) params.set('before', before);
  params.set('page', String(Math.max(1, Math.min(parseInt(page) || 1, 100))));
  params.set('per_page', String(Math.max(1, Math.min(parseInt(per_page) || 30, 200))));

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
      {
        headers: { Authorization: authHeader },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Strava API error' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
}
