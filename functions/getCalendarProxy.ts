Deno.serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const body = await req.json();
    const { listingId, propertyName, startDate, endDate } = body;

    const response = await fetch('https://d1-allas.app.n8n.cloud/webhook/guesty-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, propertyName, startDate, endDate })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ 
        error: `n8n webhook failed with status ${response.status}`,
        details: errorText 
      }, { status: response.status, headers });
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return Response.json({ 
        error: 'Invalid JSON response from n8n',
        rawResponse: text.substring(0, 500)
      }, { status: 500, headers });
    }

    return Response.json(data, { headers });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500, headers });
  }
});