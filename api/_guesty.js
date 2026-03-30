// Shared Guesty auth helper for all API routes
// IMPORTANT: Guesty only allows 5 OAuth token requests per DAY per client.
// We have TWO sets of credentials (primary + fallback) = 10 tokens/day.
// Tokens last 24h. We cache aggressively to minimize token requests.
let cachedToken = null;
let tokenExpiry = 0;
let primaryFailedAt = 0;
let fallbackFailedAt = 0;

async function tryOAuth(clientId, clientSecret) {
  const res = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'open-api',
    }),
  });

  if (res.ok) {
    const { access_token, expires_in } = await res.json();
    return { token: access_token, expiresIn: expires_in };
  }

  return { error: res.status, retryAfter: res.headers.get('retry-after') };
}

export async function getGuestyToken() {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  // Check if we have a valid fallback token in env
  if (process.env.GUESTY_FALLBACK_TOKEN) {
    try {
      const payload = JSON.parse(Buffer.from(process.env.GUESTY_FALLBACK_TOKEN.split('.')[1], 'base64url').toString());
      if (payload.exp && Date.now() < (payload.exp * 1000 - 600000)) {
        cachedToken = process.env.GUESTY_FALLBACK_TOKEN;
        tokenExpiry = payload.exp * 1000 - 600000;
        return cachedToken;
      }
    } catch { /* decode failed, continue */ }
  }

  const cooldown = 2 * 60 * 60 * 1000; // 2 hour cooldown per credential set

  // Try primary credentials
  if (!primaryFailedAt || Date.now() - primaryFailedAt > cooldown) {
    const result = await tryOAuth(process.env.GUESTY_CLIENT_ID, process.env.GUESTY_API_KEY);
    if (result.token) {
      cachedToken = result.token;
      tokenExpiry = Date.now() + (result.expiresIn - 600) * 1000;
      primaryFailedAt = 0;
      return cachedToken;
    }
    primaryFailedAt = Date.now();
  }

  // Try fallback credentials
  if (process.env.GUESTY_FALLBACK_CLIENT_ID && process.env.GUESTY_FALLBACK_SECRET) {
    if (!fallbackFailedAt || Date.now() - fallbackFailedAt > cooldown) {
      const result = await tryOAuth(process.env.GUESTY_FALLBACK_CLIENT_ID, process.env.GUESTY_FALLBACK_SECRET);
      if (result.token) {
        cachedToken = result.token;
        tokenExpiry = Date.now() + (result.expiresIn - 600) * 1000;
        fallbackFailedAt = 0;
        return cachedToken;
      }
      fallbackFailedAt = Date.now();
    }
  }

  // If we still have any cached token (even potentially expired), try it anyway
  if (cachedToken) return cachedToken;

  throw new Error('Guesty API temporarily unavailable. Please try again later.');
}

export function corsHeaders(req) {
  const allowedOrigins = [
    'https://loveyourvacationrental.com',
    'https://www.loveyourvacationrental.com',
    'https://lyvr-site.vercel.app',
    'https://lyvr-dashboard.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  const origin = req?.headers?.origin || '';
  const allowed = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// Calendar listing IDs (for /v1/listings/{id}/calendar)
export const CALENDAR_LISTING_IDS = {
  'The Big House': '64822be657f2e2004c4a77f1',
  'The Grand Oasis': '64822bd85744c8004ac1331c',
  'Grand Oasis': '64822bd85744c8004ac1331c',
  'Peaceful Paradise': '64822be4fa66ea0038366435',
  'Sweet Escape': '64873043acdd56006a51963b',
  'Pieper Mansion': '658e2daeb89509003b398b86',
  'Pieper Village': '65b6d13987c0b5008bf4e28f',
  'The Max Resort': '665b836d7acf570012d9ce49',
  'Epic Resort': '665b836d7acf570012d9ce49',
  'Sweet Mountain Retreat': '6848b97f1a744d0016efe679',
  'Cabin 1': '65255e489a1292003a926445',
  'Cabin Aspen (Cabin 1)': '65255e489a1292003a926445',
  'Cabin Aspen': '65255e489a1292003a926445',
  'Cabin 2': '652568f555dc110035d204e6',
  'Cabin Birchwood (Cabin 2)': '652568f555dc110035d204e6',
  'Cabin Birchwood': '652568f555dc110035d204e6',
  'Cabin 3': '65256c44ac11ca003e24a305',
  'Cabin Cedar (Cabin 3)': '65256c44ac11ca003e24a305',
  'Cabin Cedar': '65256c44ac11ca003e24a305',
};

// Availability-pricing listing IDs (for /v1/availability-pricing/api/calendar/listings/{id})
export const AVAILABILITY_LISTING_IDS = {
  'The Big House': '672b6f92affe7d0034b8cc28',
  'Pieper Village': '65b6d13987c0b5008bf4e28f',
  'Cabin 1': '65255e489a1292003a926445',
  'Cabin Aspen (Cabin 1)': '65255e489a1292003a926445',
  'Cabin 2': '652568f555dc110035d204e6',
  'Cabin Birchwood (Cabin 2)': '652568f555dc110035d204e6',
  'Cabin 3': '65256c44ac11ca003e24a305',
  'Cabin Cedar (Cabin 3)': '65256c44ac11ca003e24a305',
  'Pieper Mansion': '658e2daeb89509003b398b86',
  'Peaceful Paradise': '64822be4fa66ea0038366435',
  'Sweet Escape': '64822be4fa66ea0038366435',
  'The Grand Oasis': '64822bd85744c8004ac1331c',
  'Grand Oasis': '64822bd85744c8004ac1331c',
  'The Max Resort': '6585f441ba1fb10012193e3d',
  'Epic Resort': '6585f441ba1fb10012193e3d',
  'Sweet Mountain Retreat': '672ba0ec7ca5e70034411a46',
};

// Checkout listing IDs (for reservations)
export const CHECKOUT_LISTING_IDS = {
  'The Big House': '64822be657f2e2004c4a77f1',
  'Pieper Village': '65b6d13987c0b5008bf4e28f',
  'Cabin 1': '65255e489a1292003a926445',
  'Cabin Aspen (Cabin 1)': '65255e489a1292003a926445',
  'Cabin Aspen': '65255e489a1292003a926445',
  'Cabin 2': '652568f555dc110035d204e6',
  'Cabin Birchwood (Cabin 2)': '652568f555dc110035d204e6',
  'Cabin Birchwood': '652568f555dc110035d204e6',
  'Cabin 3': '65256c44ac11ca003e24a305',
  'Cabin Cedar (Cabin 3)': '65256c44ac11ca003e24a305',
  'Cabin Cedar': '65256c44ac11ca003e24a305',
  'Pieper Mansion': '658e2daeb89509003b398b86',
  'Peaceful Paradise': '64822be4fa66ea0038366435',
  'Sweet Escape': '64873043acdd56006a51963b',
  'Grand Oasis': '64822bd85744c8004ac1331c',
  'The Grand Oasis': '64822bd85744c8004ac1331c',
  'The Max Resort': '665b836d7acf570012d9ce49',
  'Epic Resort': '6585f441ba1fb10012193e3d',
  'Sweet Mountain Retreat': '6848b97f1a744d0016efe679',
};

// Payment provider IDs
export const PAYMENT_PROVIDERS = {
  'The Big House': '6500fc66c419ec005789dd92',
  'Peaceful Paradise': '6500fc66c419ec005789dd92',
  'Sweet Escape': '6500fc66c419ec005789dd92',
  'Grand Oasis': '6500fc66c419ec005789dd92',
  'The Grand Oasis': '6500fc66c419ec005789dd92',
  'Sweet Mountain Retreat': '6500fc66c419ec005789dd92',
  'Pieper Village': '6595bd78e24be1000f5fa803',
  'Cabin 1': '6595bd78e24be1000f5fa803',
  'Cabin Aspen (Cabin 1)': '6595bd78e24be1000f5fa803',
  'Cabin Aspen': '6595bd78e24be1000f5fa803',
  'Cabin 2': '6595bd78e24be1000f5fa803',
  'Cabin Birchwood (Cabin 2)': '6595bd78e24be1000f5fa803',
  'Cabin Birchwood': '6595bd78e24be1000f5fa803',
  'Cabin 3': '6595bd78e24be1000f5fa803',
  'Cabin Cedar (Cabin 3)': '6595bd78e24be1000f5fa803',
  'Cabin Cedar': '6595bd78e24be1000f5fa803',
  'Pieper Mansion': '6595bd78e24be1000f5fa803',
  'The Max Resort': '659c8d563e47ad000e834c57',
  'Epic Resort': '659c8d563e47ad000e834c57',
};

// Primary property list (no aliases) for multi-property fetches
export const PRIMARY_PROPERTIES = {
  'The Big House': '64822be657f2e2004c4a77f1',
  'The Grand Oasis': '64822bd85744c8004ac1331c',
  'Peaceful Paradise': '64822be4fa66ea0038366435',
  'Sweet Escape': '64873043acdd56006a51963b',
  'Pieper Mansion': '658e2daeb89509003b398b86',
  'Pieper Village': '65b6d13987c0b5008bf4e28f',
  'The Max Resort': '665b836d7acf570012d9ce49',
  'Sweet Mountain Retreat': '6848b97f1a744d0016efe679',
  'Cabin 1': '65255e489a1292003a926445',
  'Cabin 2': '652568f555dc110035d204e6',
  'Cabin 3': '65256c44ac11ca003e24a305',
};

export function formatCalendarDays(days) {
  const calendar = {};
  for (const day of days) {
    if (!day.date) continue;
    let isAvailable = true;
    let status = 'available';
    if (['blocked', 'booked', 'unavailable'].includes(day.status)) {
      isAvailable = false;
      status = day.status;
    }
    if (day.blockRefs?.length > 0) { isAvailable = false; status = 'blocked'; }
    if (day.reservationId) { isAvailable = false; status = 'booked'; }

    const rawPrice = day.price || 0;
    const discountedPrice = Math.round(rawPrice * 0.87); // 13% discount

    calendar[day.date] = {
      available: isAvailable,
      price: discountedPrice,
      status,
      minNights: day.minNights || 1,
    };
  }
  return calendar;
}
