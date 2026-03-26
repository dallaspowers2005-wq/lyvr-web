import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

async function getGuestyToken(base44, clientId, clientSecret) {
  // Try to read cached token from DB
  const existing = await base44.asServiceRole.entities.GuestyToken.list();
  if (existing.length > 0) {
    const cached = existing[0];
    if (cached.access_token && cached.expires_at > Date.now()) {
      return cached.access_token;
    }
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
    const errText = await tokenRes.text();
    throw new Error(`Auth failed: ${errText}`);
  }

  const json = await tokenRes.json();
  const access_token = json.access_token;
  const expires_at = Date.now() + (json.expires_in - 300) * 1000; // expire 5 min early

  // Save to DB
  if (existing.length > 0) {
    await base44.asServiceRole.entities.GuestyToken.update(existing[0].id, { access_token, expires_at });
  } else {
    await base44.asServiceRole.entities.GuestyToken.create({ access_token, expires_at });
  }

  return access_token;
}

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyName, checkIn, checkOut } = await req.json();

    const listingId = PROPERTY_LISTING_IDS[propertyName];
    if (!listingId) {
      return Response.json({ available: false, error: `Unknown property: "${propertyName}"`, canBook: false }, { status: 400, headers: corsHeaders });
    }

    const checkInDate = new Date(checkIn + 'T00:00:00');
    const checkOutDate = new Date(checkOut + 'T00:00:00');
    const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // endDate must be day after checkout to include all nights
    const endDateObj = new Date(checkOutDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDate = endDateObj.toISOString().split('T')[0];

    const clientId = Deno.env.get('GUESTY_CLIENT_ID');
    const clientSecret = Deno.env.get('GUESTY_API_KEY');

    const base44 = createClientFromRequest(req);
    const access_token = await getGuestyToken(base44, clientId, clientSecret);

    const calRes = await fetch(
      `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${checkIn}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
    );

    if (!calRes.ok) {
      const errText = await calRes.text();
      return Response.json({ available: false, error: `Calendar fetch failed: ${errText}`, canBook: false }, { status: 500, headers: corsHeaders });
    }

    const data = await calRes.json();
    const days = data?.data?.days || [];

    let totalPrice = 0;
    let isAvailable = true;

    for (let i = 0; i < nights; i++) {
      const d = new Date(checkInDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const day = days.find(x => x.date === dateStr);

      if (!day || day.status !== 'available') {
        isAvailable = false;
        break;
      }
      totalPrice += day.price || 0;
    }

    if (!isAvailable) {
      return Response.json({ available: false, message: 'Selected dates are not available', canBook: false }, { headers: corsHeaders });
    }

    // Apply 13% discount
    totalPrice = Math.round(totalPrice * 0.87);

    return Response.json({ available: true, canBook: true, nights, totalPrice, message: `Available for ${nights} nights` }, { headers: corsHeaders });

  } catch (error) {
    return Response.json({ available: false, error: error.message, canBook: false }, { status: 500, headers: corsHeaders });
  }
});