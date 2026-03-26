import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = Deno.env.get("GUESTY_CLIENT_ID");
    const clientSecret = Deno.env.get("GUESTY_API_KEY");

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: "Missing Guesty credentials" },
        { status: 500 }
      );
    }

    // Get OAuth token
    const tokenRes = await fetch("https://open-api.guesty.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "open-api"
      })
    });

    if (!tokenRes.ok) {
      return Response.json(
        { error: "OAuth failed", details: await tokenRes.text() },
        { status: tokenRes.status }
      );
    }

    const { access_token } = await tokenRes.json();

    // Fetch all listings from Guesty
    const listingsRes = await fetch(
      "https://open-api.guesty.com/v1/listings?limit=100&fields=_id title nickname address",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json"
        }
      }
    );

    if (!listingsRes.ok) {
      return Response.json(
        { error: "Failed to fetch listings", details: await listingsRes.text() },
        { status: listingsRes.status }
      );
    }

    const data = await listingsRes.json();
    
    // Return simplified list
    const listings = (data.results || []).map(listing => ({
      id: listing._id,
      title: listing.title,
      nickname: listing.nickname,
      address: listing.address?.full || listing.address?.city || 'No address'
    }));

    return Response.json({
      success: true,
      count: listings.length,
      listings
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
});