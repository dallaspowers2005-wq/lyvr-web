// Shared Guesty OAuth token caching
let cachedToken = null;
let tokenExpiry = null;

export async function getGuestyToken() {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Request new token
  const clientId = Deno.env.get('GUESTY_CLIENT_ID');
  const clientSecret = Deno.env.get('GUESTY_API_KEY');

  if (!clientId || !clientSecret) {
    throw new Error('Missing Guesty credentials');
  }

  const tokenRes = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'open-api'
    })
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`OAuth failed: ${errorText}`);
  }

  const { access_token, expires_in } = await tokenRes.json();
  
  // Cache token (expires_in is in seconds, subtract 5 minutes for safety)
  cachedToken = access_token;
  tokenExpiry = Date.now() + ((expires_in - 300) * 1000);

  return access_token;
}