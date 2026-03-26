import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { eachDayOfInterval, parseISO } from 'npm:date-fns@3.6.0';

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
    const { property_id, check_in, check_out } = await req.json();

    if (!property_id || !check_in || !check_out) {
      return Response.json(
        { available: false, error: 'Missing required parameters' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get all dates in the range
    const dates = eachDayOfInterval({
      start: parseISO(check_in),
      end: parseISO(check_out)
    });

    // Check each date
    for (const date of dates) {
      const dateStr = date.toISOString().split('T')[0];
      
      const availabilityRecords = await base44.entities.PropertyAvailability.filter({
        property_id,
        date: dateStr
      });

      if (availabilityRecords.length === 0) {
        // No data = assume unavailable for safety
        return Response.json({
          available: false,
          reason: 'No availability data for this date range'
        }, { headers: corsHeaders });
      }

      if (!availabilityRecords[0].is_available) {
        return Response.json({
          available: false,
          reason: `Date ${dateStr} is not available`
        }, { headers: corsHeaders });
      }
    }

    // All dates are available
    return Response.json({
      available: true
    }, { headers: corsHeaders });

  } catch (error) {
    return Response.json(
      { available: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
});