// Vercel Serverless Function — Create a Strava activity
// Proxies POST requests to Strava's create-activity endpoint

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const { name, sport_type, start_date_local, elapsed_time, description, distance } = req.body;

  // Validate required fields
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Missing activity name' });
  }
  if (!sport_type || typeof sport_type !== 'string') {
    return res.status(400).json({ error: 'Missing sport type' });
  }
  if (!start_date_local || typeof start_date_local !== 'string') {
    return res.status(400).json({ error: 'Missing start date' });
  }
  if (!elapsed_time || typeof elapsed_time !== 'number' || elapsed_time <= 0) {
    return res.status(400).json({ error: 'Missing or invalid elapsed time' });
  }

  const body = {
    name: name.slice(0, 200),
    sport_type,
    start_date_local,
    elapsed_time: Math.round(elapsed_time),
  };

  if (description && typeof description === 'string') {
    body.description = description.slice(0, 2000);
  }
  if (typeof distance === 'number' && distance > 0) {
    body.distance = distance;
  }

  try {
    const response = await fetch('https://www.strava.com/api/v3/activities', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to create activity' });
    }

    return res.status(201).json({ id: data.id, name: data.name });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create activity on Strava' });
  }
}
