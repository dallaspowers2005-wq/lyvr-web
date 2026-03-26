Deno.serve(async (req) => {
  const ALLOWED_ORIGINS = [
    'https://love-your-vacation-rentalscom-7e5c0a56.base44.app',
    'https://loveyourvacationrental.com',
    'https://www.loveyourvacationrental.com'
  ];

  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // --- Input Validation ---
    const required = ['firstName', 'lastName', 'email', 'propertyName', 'checkIn', 'checkOut'];
    for (const field of required) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim().length === 0) {
        return Response.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return Response.json(
        { success: false, error: 'Invalid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Date sanity check
    const checkIn = new Date(body.checkIn);
    const checkOut = new Date(body.checkOut);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return Response.json(
        { success: false, error: 'Invalid dates' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (checkOut <= checkIn) {
      return Response.json(
        { success: false, error: 'Check-out must be after check-in' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Price sanity check
    const totalPrice = Number(body.totalPrice);
    if (isNaN(totalPrice) || totalPrice < 10 || totalPrice > 100000) {
      return Response.json(
        { success: false, error: 'Invalid price' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Card must be present
    if (!body.card || !body.card.number || !body.card.exp_month || !body.card.exp_year || !body.card.cvc) {
      return Response.json(
        { success: false, error: 'Card details are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Sanitize string fields
    body.firstName = body.firstName.trim().slice(0, 50);
    body.lastName = body.lastName.trim().slice(0, 50);
    body.email = body.email.trim().toLowerCase().slice(0, 100);
    body.propertyName = body.propertyName.trim().slice(0, 100);

    // --- Forward to n8n ---
    const response = await fetch('https://d1-allas.app.n8n.cloud/webhook/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
});