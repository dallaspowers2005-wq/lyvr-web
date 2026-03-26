import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PROPERTY_SECRETS = {
  'Epic Resort': 'Epic_Resort',
  'Sweet Mountain Retreat': 'Sweet_Mountain_Retreat',
  'The Big House': 'The_Big_House',
  'Pieper Village': 'Pieper_Village',
  'Cabin 1': 'Cabin_1',
  'Cabin 2': 'Cabin_2',
  'Cabin 3': 'Cabin_3',
  'Pieper Mansion': 'Pieper_Mansion',
  'Peaceful Paradise': 'Peaceful_Paradise',
  'Sweet Escape': 'Sweet_Escape',
  'The Grand Oasis': 'The_Grand_Oasis'
};

// Inline token fetching (don't rely on external import)
async function getGuestyToken() {
  const clientId = Deno.env.get('GUESTY_CLIENT_ID');
  const clientSecret = Deno.env.get('GUESTY_API_KEY');
  
  const tokenRes = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'open-api'
    })
  });
  
  if (!tokenRes.ok) {
    throw new Error(`OAuth failed: ${await tokenRes.text()}`);
  }
  
  const data = await tokenRes.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    // FIX 1: Add await here
    await createClientFromRequest(req);
    
    // FIX 2: REMOVE the auth check - calendar should be public
    // const user = await base44.auth.me();
    // if (!user) { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }

    const { propertyName, checkIn, checkOut } = await req.json();
    
    if (!propertyName || !checkIn || !checkOut) {
      return Response.json({ 
        error: 'Missing required fields',
        received: { propertyName, checkIn, checkOut }
      }, { status: 400 });
    }

    const secretName = PROPERTY_SECRETS[propertyName];
    if (!secretName) {
      return Response.json({ 
        error: 'Property not found',
        propertyName,
        availableProperties: Object.keys(PROPERTY_SECRETS)
      }, { status: 404 });
    }

    const listingId = Deno.env.get(secretName);
    if (!listingId) {
      return Response.json({ 
        error: 'Listing ID not configured',
        secretName,
        hint: `Add secret "${secretName}" with the Guesty listing ID`
      }, { status: 500 });
    }

    // Get OAuth token (inline, no import)
    const access_token = await getGuestyToken();

    // Fetch calendar
    const calendarUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${checkIn}&endDate=${checkOut}`;
    
    const response = await fetch(calendarUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ 
        error: 'Calendar fetch failed', 
        status: response.status,
        details: errorText,
        listingId,
        url: calendarUrl
      }, { status: response.status });
    }

    const calendar = await response.json();
    const days = calendar?.data?.days || [];

    // FIX 3: Handle empty days
    if (days.length === 0) {
      return Response.json({
        error: 'No calendar data returned',
        listingId,
        checkIn,
        checkOut,
        rawResponse: calendar
      }, { status: 200 });
    }

    // Check availability
    const isAvailable = days.every(day => day.status === 'available');
    
    // Calculate nights and price
    const nights = days.length;
    const totalPrice = days.reduce((sum, day) => sum + (day.price || 0), 0);

    return Response.json({
      success: true,
      available: isAvailable,
      nights,
      totalPrice: Math.round(totalPrice),
      message: isAvailable ? 'Available for booking' : 'Not available for selected dates',
      listingId,
      daysChecked: days.length
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});