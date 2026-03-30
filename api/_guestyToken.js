// Shared Guesty OAuth token manager with persistent Supabase caching
// CRITICAL: Only 5 token requests per day allowed!

// In-memory cache (survives warm invocations)
let memToken = null;
let memExpiry = 0;

async function getFromSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/guesty_token_cache?select=access_token,expires_at&order=id.desc&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (rows.length > 0 && rows[0].access_token && rows[0].expires_at > Date.now()) {
      return rows[0].access_token;
    }
  } catch {
    // Table might not exist yet, that's fine
  }
  return null;
}

async function saveToSupabase(access_token, expires_at) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return;

  try {
    // Try upsert — delete old rows first, insert new
    await fetch(`${url}/rest/v1/guesty_token_cache`, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=minimal' },
    });
    await fetch(`${url}/rest/v1/guesty_token_cache`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ access_token, expires_at })
    });
  } catch {
    // Non-critical — in-memory cache still works
  }
}

export async function getGuestyToken() {
  // 1. Check in-memory cache first (fastest, no API call)
  if (memToken && Date.now() < memExpiry) {
    return memToken;
  }

  // 2. Check Supabase persistent cache (survives cold starts)
  const supaToken = await getFromSupabase();
  if (supaToken) {
    memToken = supaToken;
    memExpiry = Date.now() + 30 * 60 * 1000; // trust it for 30 min
    return supaToken;
  }

  // 3. Fetch new token from Guesty (EXPENSIVE — only 5/day!)
  const clientId = process.env.GUESTY_CLIENT_ID;
  const clientSecret = process.env.GUESTY_API_KEY;

  if (!clientId || !clientSecret) {
    throw new Error('Missing GUESTY_CLIENT_ID or GUESTY_API_KEY');
  }

  const res = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'open-api'
    })
  });

  if (!res.ok) {
    throw new Error(`Guesty auth failed: ${await res.text()}`);
  }

  const json = await res.json();
  const access_token = json.access_token;
  // Expire 10 minutes early to be safe
  const expires_at = Date.now() + (json.expires_in - 600) * 1000;

  // Cache everywhere
  memToken = access_token;
  memExpiry = expires_at;
  await saveToSupabase(access_token, expires_at);

  return access_token;
}
