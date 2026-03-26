import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { format, addMonths } from 'npm:date-fns@3.6.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all properties
    const properties = await base44.asServiceRole.entities.Property.list();
    
    const startDate = format(new Date(), 'yyyy-MM-dd');
    const endDate = format(addMonths(new Date(), 12), 'yyyy-MM-dd');
    
    // Fetch all calendars from n8n webhook
    const response = await fetch('https://d1-allas.app.n8n.cloud/webhook/guesty-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate
      })
    });
    
    const data = await response.json();
    
    if (!data.success || !data.properties) {
      throw new Error('Failed to fetch calendars from n8n');
    }
    
    const allCalendars = data.properties;
    
    let totalSynced = 0;
    
    // Delete all existing availability records
    const existing = await base44.asServiceRole.entities.PropertyAvailability.list();
    for (const record of existing) {
      await base44.asServiceRole.entities.PropertyAvailability.delete(record.id);
    }
    
    // Process each property
    for (const property of properties) {
      if (!property.name || !allCalendars[property.name]) continue;
      
      const calendar = allCalendars[property.name] || {};
      
      // Create new availability records
      const records = [];
      for (const [dateStr, dayData] of Object.entries(calendar)) {
        records.push({
          property_id: property.id,
          date: dateStr,
          is_available: dayData.available === true
        });
      }
      
      if (records.length > 0) {
        await base44.asServiceRole.entities.PropertyAvailability.bulkCreate(records);
        totalSynced += records.length;
      }
    }
    
    return Response.json({
      success: true,
      properties_synced: properties.length,
      dates_synced: totalSynced,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});