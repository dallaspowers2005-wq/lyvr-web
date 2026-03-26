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

    // Get date range for next year
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
      .toISOString().split('T')[0];

    // Call updateAllPropertyCalendars to refresh all property availability data
    const { data } = await base44.functions.invoke('updateAllPropertyCalendars', {
      startDate,
      endDate
    });

    console.log('Calendar refresh completed at', new Date().toISOString());
    console.log('Result:', data);

    return Response.json({
      success: true,
      message: 'All calendars refreshed successfully',
      timestamp: new Date().toISOString(),
      data
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error refreshing calendars:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
});