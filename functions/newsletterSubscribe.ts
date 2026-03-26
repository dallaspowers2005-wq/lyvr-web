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
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    const MAILCHIMP_API_KEY = Deno.env.get('MAILCHIMP_API_KEY') || '';
    const MAILCHIMP_LIST_ID = Deno.env.get('MAILCHIMP_LIST_ID') || '';
    const MAILCHIMP_DC = Deno.env.get('MAILCHIMP_DC') || 'us4';

    const response = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: email.trim().toLowerCase(),
          status: 'subscribed',
          tags: ['Newsletter', 'Website Subscriber'],
        })
      }
    );

    const result = await response.json();

    // Mailchimp returns 400 if already subscribed — that's fine
    if (response.ok || result.title === 'Member Exists') {
      return Response.json(
        { success: true, message: 'Subscribed successfully!' },
        { headers: corsHeaders }
      );
    }

    // Handle "Forgotten" status
    if (result.title === 'Forgotten Email Not Subscribed') {
      return Response.json(
        { success: true, message: 'Subscribed successfully!' },
        { headers: corsHeaders }
      );
    }

    return Response.json(
      { success: false, error: 'Subscription failed. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Newsletter error:', error);
    return Response.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
});