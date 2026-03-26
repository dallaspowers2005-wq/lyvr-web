import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Map property names to webhook endpoints
    const propertyWebhooks = {
      'The Big House': 'quote-big-house',
      'Pieper Village': 'quote-pieper-village',
      'Cabin 1': 'quote-cabin-1',
      'Cabin 2': 'quote-cabin-2',
      'Cabin 3': 'quote-cabin-3',
      'Pieper Mansion': 'quote-pieper-mansion',
      'Peaceful Paradise': 'quote-peaceful-paradise',
      'Sweet Escape': 'quote-sweet-escape',
      'The Grand Oasis': 'quote-grand-oasis',
      'Grand Oasis': 'quote-grand-oasis',
      'The Max Resort': 'quote-max-resort',
      'Sweet Mountain Retreat': 'quote-sweet-mountain-retreat'
    };

    const webhookPath = propertyWebhooks[body.propertyName];
    if (!webhookPath) {
      return Response.json(
        { success: false, error: `Unknown property: ${body.propertyName}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Calculate nights on the frontend to ensure accuracy (checkout day is not charged)
    const checkInDate = new Date(body.checkIn + 'T00:00:00');
    const checkOutDate = new Date(body.checkOut + 'T00:00:00');
    const calculatedNights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    console.log('Calculated nights:', calculatedNights, 'from', body.checkIn, 'to', body.checkOut);

    // Call N8N webhook to get quote (includes OAuth token caching and proper parsing)
    const response = await fetch(`https://d1-allas.app.n8n.cloud/webhook/${webhookPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: body.guests || 1
      })
    });

    const text = await response.text();
    console.log('N8N Response:', text);
    
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse N8N response:', e);
      return Response.json(
        { success: false, error: 'Invalid response from booking system', raw: text },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Override nights with our accurate calculation
    if (result.success && result.rates) {
      result.rates.nights = calculatedNights;
    }

    // Apply 13% discount to match calendar pricing
    if (result.success && result.rates && result.rates.totalPrice) {
      result.rates.totalPrice = Math.round(result.rates.totalPrice * 0.87);
    }

    return Response.json(result, { headers: corsHeaders });
  } catch (error) {
    console.error('Quote error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
});