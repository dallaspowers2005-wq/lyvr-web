const PROPERTY_LISTING_IDS = {
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
  'Sweet Mountain Retreat': '672ba0ec7ca5e70034411a46'
};

let cachedToken = null;
let tokenExpiry = 0;

async function getGuestyToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.GUESTY_CLIENT_ID,
      client_secret: process.env.GUESTY_API_KEY,
      scope: 'open-api'
    })
  });

  if (!res.ok) {
    throw new Error(`Guesty auth failed: ${await res.text()}`);
  }

  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiry = Date.now() + (json.expires_in - 300) * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { propertyName, startDate, endDate } = req.body;

    const listingId = PROPERTY_LISTING_IDS[propertyName];
    if (!listingId) {
      return res.status(404).json({ success: false, error: 'Property not found', calendar: {} });
    }

    if (!process.env.GUESTY_CLIENT_ID || !process.env.GUESTY_API_KEY) {
      return res.status(500).json({ success: false, error: 'Missing Guesty credentials', calendar: {} });
    }

    const token = await getGuestyToken();

    const calRes = await fetch(
      `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );

    if (!calRes.ok) {
      const errText = await calRes.text();
      return res.status(500).json({ success: false, error: `Calendar fetch failed: ${errText}`, calendar: {} });
    }

    const data = await calRes.json();
    const days = data?.data?.days || [];

    const calendar = {};
    days.forEach((day) => {
      calendar[day.date] = {
        available: day.status === 'available',
        price: day.price ? Math.round(day.price * 0.87) : 0,
        minNights: day.minNights || 1,
        status: day.status
      };
    });

    return res.status(200).json({ success: true, calendar, totalDays: Object.keys(calendar).length });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, calendar: {} });
  }
}
