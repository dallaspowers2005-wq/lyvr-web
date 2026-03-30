import { getGuestyToken, CALENDAR_LISTING_IDS } from './_guesty.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).json({});

  try {
    const { propertyName, checkIn, checkOut } = req.body;
    const listingId = CALENDAR_LISTING_IDS[propertyName];

    if (!listingId) {
      return res.status(400).json({ available: false, error: `Unknown property: "${propertyName}"`, canBook: false });
    }

    const checkInDate = new Date(checkIn + 'T00:00:00');
    const checkOutDate = new Date(checkOut + 'T00:00:00');
    const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const endDateObj = new Date(checkOutDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDate = endDateObj.toISOString().split('T')[0];

    const token = await getGuestyToken();
    const calRes = await fetch(
      `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${checkIn}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    );

    if (!calRes.ok) {
      return res.status(500).json({ available: false, error: `Calendar fetch failed: ${await calRes.text()}`, canBook: false });
    }

    const data = await calRes.json();
    const days = data?.data?.days || [];

    let totalPrice = 0;
    let isAvailable = true;

    for (let i = 0; i < nights; i++) {
      const d = new Date(checkInDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const day = days.find(x => x.date === dateStr);

      if (!day || day.status !== 'available') {
        isAvailable = false;
        break;
      }
      totalPrice += day.price || 0;
    }

    if (!isAvailable) {
      return res.status(200).json({ available: false, message: 'Selected dates are not available', canBook: false });
    }

    // Apply 13% discount
    totalPrice = Math.round(totalPrice * 0.87);

    return res.status(200).json({ available: true, canBook: true, nights, totalPrice, message: `Available for ${nights} nights` });
  } catch (error) {
    return res.status(500).json({ available: false, error: error.message, canBook: false });
  }
}
