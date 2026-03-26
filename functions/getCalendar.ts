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
    const { propertyName, startDate, endDate } = await req.json();

    const WEBHOOK_MAP = {
      'The Big House': 'https://d1-allas.app.n8n.cloud/webhook/cal-big-house',
      'Pieper Village': 'https://d1-allas.app.n8n.cloud/webhook/cal-pieper-village',
      'Cabin 1': 'https://d1-allas.app.n8n.cloud/webhook/cal-cabin-1',
      'Cabin Aspen (Cabin 1)': 'https://d1-allas.app.n8n.cloud/webhook/cal-cabin-1',
      'Cabin 2': 'https://d1-allas.app.n8n.cloud/webhook/cal-cabin-2',
      'Cabin Birchwood (Cabin 2)': 'https://d1-allas.app.n8n.cloud/webhook/cal-cabin-2',
      'Cabin 3': 'https://d1-allas.app.n8n.cloud/webhook/cal-cabin-3',
      'Cabin Cedar (Cabin 3)': 'https://d1-allas.app.n8n.cloud/webhook/cal-cabin-3',
      'Pieper Mansion': 'https://d1-allas.app.n8n.cloud/webhook/cal-pieper-mansion',
      'Peaceful Paradise': 'https://d1-allas.app.n8n.cloud/webhook/cal-peaceful-paradise',
      'Sweet Escape': 'https://d1-allas.app.n8n.cloud/webhook/cal-sweet-escape',
      'Grand Oasis': 'https://d1-allas.app.n8n.cloud/webhook/cal-grand-oasis',
      'The Grand Oasis': 'https://d1-allas.app.n8n.cloud/webhook/cal-grand-oasis',
      'The Max Resort': 'https://d1-allas.app.n8n.cloud/webhook/cal-max-resort',
      'Epic Resort': 'https://d1-allas.app.n8n.cloud/webhook/cal-max-resort',
      'Sweet Mountain Retreat': 'https://d1-allas.app.n8n.cloud/webhook/cal-sweet-mountain'
    };

    const webhookUrl = WEBHOOK_MAP[propertyName];
    if (!webhookUrl) {
      return Response.json(
        { success: false, error: 'Property not found', calendar: {} },
        { status: 404, headers: corsHeaders }
      );
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate })
    });

    const data = await response.json();

    // Apply 13% discount to daily rates
    if (data.calendar) {
      for (const date in data.calendar) {
        if (data.calendar[date].price) {
          data.calendar[date].price = Math.round(data.calendar[date].price * 0.87);
        }
      }
    }

    return Response.json(data, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message, calendar: {} },
      { status: 500, headers: corsHeaders }
    );
  }
});