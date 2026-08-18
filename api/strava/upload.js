// Vercel Serverless Function — Upload a structured strength activity to Strava
// POST  /api/strava/upload        -> enqueues a data_type=json upload, returns the upload id
// GET   /api/strava/upload?id=123 -> polls upload status until activity_id is set
//
// Strava only accepts the JSON upload format for WeightTraining,
// HighIntensityIntervalTraining, Workout and Crossfit activities. Everything
// else still goes through /api/strava/create as a manual activity.

const JSON_SPORT_TYPES = [
  'WeightTraining',
  'HighIntensityIntervalTraining',
  'Workout',
  'Crossfit',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  if (req.method === 'GET') {
    return pollUpload(req, res, authHeader);
  }
  if (req.method === 'POST') {
    return createUpload(req, res, authHeader);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function createUpload(req, res, authHeader) {
  const { name, description, sport_type, external_id, payload } = req.body || {};

  if (!sport_type || !JSON_SPORT_TYPES.includes(sport_type)) {
    return res.status(400).json({
      error: `sport_type must be one of: ${JSON_SPORT_TYPES.join(', ')}`,
    });
  }
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Missing upload payload' });
  }
  if (payload.version !== '1.0') {
    return res.status(400).json({ error: 'payload.version must be "1.0"' });
  }
  if (!payload.start_time || typeof payload.start_time !== 'string') {
    return res.status(400).json({ error: 'Missing payload.start_time' });
  }
  // Strava requires a UTC offset or Z suffix on start_time
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/.test(payload.start_time)) {
    return res.status(400).json({ error: 'payload.start_time needs a Z suffix or UTC offset' });
  }
  if (typeof payload.utc_offset !== 'number') {
    return res.status(400).json({ error: 'Missing payload.utc_offset' });
  }
  if (typeof payload.elapsed_time !== 'number' || payload.elapsed_time <= 0) {
    return res.status(400).json({ error: 'Missing or invalid payload.elapsed_time' });
  }
  if (!Array.isArray(payload.sets) || payload.sets.length === 0) {
    return res.status(400).json({ error: 'payload.sets must contain at least one set' });
  }
  if (payload.sets.some(s => !s || typeof s.exercise_type !== 'string' || !s.exercise_type)) {
    return res.status(400).json({ error: 'Every set needs an exercise_type' });
  }

  const form = new FormData();
  form.append('data_type', 'json');
  form.append('sport_type', sport_type);
  form.append(
    'file',
    new Blob([JSON.stringify(payload)], { type: 'application/json' }),
    'workout.json'
  );
  if (name && typeof name === 'string') {
    form.append('name', name.slice(0, 200));
  }
  if (description && typeof description === 'string') {
    form.append('description', description.slice(0, 2000));
  }
  if (external_id && typeof external_id === 'string') {
    form.append('external_id', external_id.slice(0, 200));
  }

  try {
    const response = await fetch('https://www.strava.com/api/v3/uploads', {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      // Strava returns human-readable English here, sometimes with escaped HTML
      return res.status(response.status).json({
        error: data.error || data.message || 'Failed to enqueue upload',
      });
    }

    // Upload ids may exceed Number.MAX_SAFE_INTEGER — always prefer id_str
    return res.status(201).json({
      id: data.id_str || String(data.id),
      status: data.status,
      error: data.error || null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to upload activity to Strava' });
  }
}

async function pollUpload(req, res, authHeader) {
  const { id } = req.query;
  if (!id || !/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: 'Missing or invalid upload id' });
  }

  try {
    const response = await fetch(`https://www.strava.com/api/v3/uploads/${id}`, {
      headers: { Authorization: authHeader },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || data.message || 'Failed to check upload status',
      });
    }

    return res.status(200).json({
      id: data.id_str || String(data.id),
      status: data.status,
      error: data.error || null,
      activity_id: data.activity_id ? String(data.activity_id) : null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to check upload status' });
  }
}
