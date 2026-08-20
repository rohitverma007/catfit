// Vercel Serverless Function — Update an existing Strava activity
// PUT /api/strava/update?id=123
//
// Strava's UpdatableActivity model covers name, description, sport_type,
// trainer, commute, hide_from_home and gear_id. It does NOT document a sets
// field, so `sets` is forwarded only as a probe: the Swagger reference also
// omitted data_type=json, which turned out to be real, so the model being
// silent about sets is not proof that the endpoint ignores them.

const UPDATABLE_STRINGS = ['name', 'description', 'sport_type', 'gear_id'];
const UPDATABLE_BOOLEANS = ['trainer', 'commute', 'hide_from_home'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const { id } = req.query;
  if (!id || !/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: 'Missing or invalid activity id' });
  }

  const body = {};
  for (const key of UPDATABLE_STRINGS) {
    const value = req.body?.[key];
    if (typeof value === 'string') {
      body[key] = key === 'description' ? value.slice(0, 2000) : value.slice(0, 200);
    }
  }
  for (const key of UPDATABLE_BOOLEANS) {
    if (typeof req.body?.[key] === 'boolean') body[key] = req.body[key];
  }
  // Undocumented — see note above
  if (Array.isArray(req.body?.sets) && req.body.sets.length > 0) {
    body.sets = req.body.sets;
  }

  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'No updatable fields provided' });
  }

  try {
    const response = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Failed to update activity',
        errors: data.errors || null,
      });
    }

    return res.status(200).json({
      id: String(data.id),
      name: data.name,
      sport_type: data.sport_type,
      // Echoed back so a probe can see whether Strava retained anything
      sets: data.sets ?? null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update activity on Strava' });
  }
}
