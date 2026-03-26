import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PROPERTY_LISTING_IDS = {
  'epicResort': '6585f441ba1fb10012193e3d',
  'sweetMountainRetreat': '672ba0ec7ca5e70034411a46',
  'theBigHouse': '672b6f92affe7d0034b8cc28',
  'pieperVillage': '65b6d13987c0b5008bf4e28f',
  'cabin1': '65255e489a1292003a926445',
  'cabin2': '652568f555dc110035d204e6',
  'cabin3': '65256c44ac11ca003e24a305',
  'pieperMansion': '658e2daeb89509003b398b86',
  'peacefulParadise': '64822be4fa66ea0038366435',
  'sweetEscape': '64822be4fa66ea0038366435',
  'theGrandOasis': '64822bd85744c8004ac1331c'
};

Deno.serve(async (req) => {
  try {
    await createClientFromRequest(req);

    const { propertyName, startDate, endDate } = await req.json();

    if (!propertyName || !startDate || !endDate) {
      return Response.json(
        { error: 'propertyName, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const listingId = PROPERTY_LISTING_IDS[propertyName];
    if (!listingId) {
      return Response.json(
        { error: `Property "${propertyName}" not found` },
        { status: 404 }
      );
    }

    const clientId = Deno.env.get('GUESTY_CLIENT_ID');
    const clientSecret = Deno.env.get('GUESTY_API_KEY');

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: 'Missing Guesty credentials' },
        { status: 500 }
      );
    }

    // Get OAuth token
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
      return Response.json(
        { error: 'OAuth failed', details: await tokenRes.text() },
        { status: tokenRes.status }
      );
    }

    const { access_token } = await tokenRes.json();

    // Fetch calendar - CORRECT ENDPOINT
    const calendarUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`;

    const calRes = await fetch(calendarUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json'
      }
    });

    if (!calRes.ok) {
      return Response.json(
        { error: 'Calendar fetch failed', details: await calRes.text() },
        { status: calRes.status }
      );
    }

    const data = await calRes.json();
    const days = data?.data?.days || [];

    // Transform to simple calendar object
    const calendar = {};
    days.forEach((day) => {
      calendar[day.date] = {
        available: day.status === 'available',
        price: day.price || 0,
        minNights: day.minNights || 1,
        status: day.status
      };
    });

    return Response.json({
      success: true,
      propertyName,
      listingId,
      calendar,
      totalDays: Object.keys(calendar).length
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
});