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

    const properties = await base44.entities.Property.list();

    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
      .toISOString().split('T')[0];

    console.log(`Starting calendar update for ${properties.length} properties`);

    const updatePromises = properties.map(async (property) => {
      console.log(`Updating calendar for: ${property.name}`);
      try {
        const { data } = await base44.functions.invoke('getCalendar', {
          propertyName: property.name,
          startDate,
          endDate,
        });
        
        if (data.success) {
          console.log(`✓ Successfully updated ${property.name}`);
        } else {
          console.error(`✗ Failed to update ${property.name}: ${data.error}`);
        }
        
        return { property: property.name, success: data.success, error: data.error };
      } catch (error) {
        console.error(`✗ Error updating ${property.name}: ${error.message}`);
        return { property: property.name, success: false, error: error.message };
      }
    });

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Calendar update completed: ${successCount}/${properties.length} successful`);

    return Response.json({ 
      success: true, 
      message: `Updated ${successCount}/${properties.length} properties`, 
      results 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in updateAllPropertyCalendars:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
});