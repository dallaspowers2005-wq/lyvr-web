import { getGuestyToken, corsHeaders, CALENDAR_LISTING_IDS, formatCalendarDays } from './_guesty.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const { propertyName, listingId: rawListingId, startDate, endDate } = req.body;
    const listingId = rawListingId || CALENDAR_LISTING_IDS[propertyName];

    if (!listingId) {
      return res.status(404).json({ success: false, error: 'Property not found', calendar: {} });
    }

    const token = await getGuestyToken();
    const calRes = await fetch(
      `https://open-api.guesty.com/v1/listings/${listingId}/calendar?from=${startDate}&to=${endDate}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    );

    if (!calRes.ok) {
      throw new Error(`Calendar API error: ${await calRes.text()}`);
    }

    const data = await calRes.json();
    const days = Array.isArray(data) ? data : [];
    const calendar = formatCalendarDays(days);

    return res.status(200).json({ success: true, calendar, daysLoaded: Object.keys(calendar).length });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, calendar: {} });
  }
}
