import { getGuestyToken } from './_guestyToken.js';

const PROPERTY_LISTING_IDS = {
  'The Big House': '672b6f92affe7d0034b8cc28',
  'Pieper Village': '65b6d13987c0b5008bf4e28f',
  'Cabin 1': '65255e489a1292003a926445',
  'Cabin Aspen (Cabin 1)': '65255e489a1292003a926445',
  'Cabin 2': '652568f555dc110035d204e6',
  'Cabin Birchwood (Cabin 2)': '652568f555dc110035d204e6',
  'Cabin 3': '65256c44ac11ca003e24a305',
  'Cabin Cedar (Cabin 3)': '65256c44ac11ca003e24a305',
  'Pieper Mansion': '658e2daeb89509003b398b86',
  'Peaceful Paradise': '64822be4fa66ea0038366435',
  'Sweet Escape': '64822be4fa66ea0038366435',
  'The Grand Oasis': '64822bd85744c8004ac1331c',
  'Grand Oasis': '64822bd85744c8004ac1331c',
  'The Max Resort': '6585f441ba1fb10012193e3d',
  'Epic Resort': '6585f441ba1fb10012193e3d',
  'Sweet Mountain Retreat': '672ba0ec7ca5e70034411a46'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ available: false, error: 'Method not allowed' });

  try {
    const { propertyName, checkIn, checkOut } = req.body;

    const listingId = PROPERTY_LISTING_IDS[propertyName];
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

    totalPrice = Math.round(totalPrice * 0.87);

    return res.status(200).json({ available: true, canBook: true, nights, totalPrice, message: `Available for ${nights} nights` });
  } catch (error) {
    return res.status(500).json({ available: false, error: error.message, canBook: false });
  }
}
