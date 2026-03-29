import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { differenceInDays, parseISO, eachDayOfInterval, format } from 'npm:date-fns@3.6.0';

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
    const { checkIn, checkOut, guests, minGuests, maxPrice, minBedrooms } = await req.json();

    const allProperties = await base44.entities.Property.list();

    const hiddenProperties = ['Desert Oasis Estate', 'Scottsdale Grand Retreat', 'Sedona Canyon Villa', 'Camelback Mountain Lodge', 'Sweet Escape (OLD - DELETE ME)'];

    let filteredProperties = allProperties.filter(property => {
      // Skip hidden properties
      if (hiddenProperties.includes(property.name)) return false;

      // Apply guest filter
      if (guests && property.max_guests < parseInt(guests)) return false;
      if (minGuests && property.max_guests < parseInt(minGuests)) return false;

      // Apply price filter
      if (maxPrice && property.price_per_night > parseInt(maxPrice)) return false;

      // Apply bedrooms filter
      if (minBedrooms && property.bedrooms < parseInt(minBedrooms)) return false;

      return true;
    });

    // Apply date range filter if checkIn and checkOut are provided
    if (checkIn && checkOut) {
      const checkInDate = parseISO(checkIn);
      const checkOutDate = parseISO(checkOut);
      
      // Get all dates in the stay (excluding checkout day)
      const stayDates = eachDayOfInterval({ start: checkInDate, end: checkOutDate })
        .slice(0, -1) // Exclude checkout day
        .map(date => format(date, 'yyyy-MM-dd'));

      if (stayDates.length === 0) {
        return Response.json({ success: true, properties: [] }, { headers: corsHeaders });
      }

      // Get availability for all properties in the date range
      const availabilityRecords = await base44.entities.PropertyAvailability.filter({
        date: { $gte: checkIn, $lt: checkOut },
        is_available: true
      });

      // Group available dates by property_id
      const propertyAvailableDates = new Map();
      for (const record of availabilityRecords) {
        if (!propertyAvailableDates.has(record.property_id)) {
          propertyAvailableDates.set(record.property_id, new Set());
        }
        propertyAvailableDates.get(record.property_id).add(record.date);
      }

      // Filter to only properties available for ALL required dates
      filteredProperties = filteredProperties.filter(property => {
        const availableDates = propertyAvailableDates.get(property.id);
        if (!availableDates) return false;
        
        return stayDates.every(date => availableDates.has(date));
      });
    }

    return Response.json(filteredProperties, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message, properties: [] },
      { status: 500, headers: corsHeaders }
    );
  }
});