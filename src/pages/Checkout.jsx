import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Loader2, Lock, AlertCircle, Shield } from 'lucide-react';
import Footer from '@/components/home/Footer';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [testMode, setTestMode] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const showTestCard = urlParams.get('test') === 'true';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [card, setCard] = useState({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    zip: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!bookingData) {
      navigate(createPageUrl('Properties'));
      return;
    }
    loadPricing();
  }, []);

  const loadPricing = () => {
    if (bookingData.accommodationFare && bookingData.accommodationFare > 0) {
      setQuote({
        success: true,
        rates: {
          accommodationFare: bookingData.accommodationFare,
          cleaningFee: bookingData.cleaningFee || 0,
          taxes: bookingData.taxes || 0,
          serviceFee: 0,
          totalPrice: bookingData.totalPrice || (bookingData.accommodationFare + (bookingData.cleaningFee || 0) + (bookingData.taxes || 0))
        }
      });
      return;
    }

    if (bookingData.nightlyRate) {
      const checkInDate = new Date(bookingData.checkIn + 'T00:00:00');
      const checkOutDate = new Date(bookingData.checkOut + 'T00:00:00');
      const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const accommodationFare = bookingData.nightlyRate * nights;
      const cleaningFee = Math.round(accommodationFare * 0.10);
      const taxes = Math.round(accommodationFare * 0.12);
      const totalPrice = accommodationFare + cleaningFee + taxes;
      setQuote({
        success: true,
        rates: { accommodationFare, cleaningFee, taxes, serviceFee: 0, totalPrice }
      });
      return;
    }

    fetchQuoteFromAPI();
  };

  const fetchQuoteFromAPI = async () => {
    try {
      const calResponse = await fetch('/api/getCalendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyName: bookingData.propertyName,
          startDate: bookingData.checkIn,
          endDate: bookingData.checkOut
        })
      });
      const data = await calResponse.json();

      if (data && data.calendar) {
        const checkInDate = new Date(bookingData.checkIn + 'T00:00:00');
        const checkOutDate = new Date(bookingData.checkOut + 'T00:00:00');
        const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        let accommodationFare = 0;
        const currentDate = new Date(checkInDate);
        for (let i = 0; i < nights; i++) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const dayData = data.calendar[dateStr];
          if (dayData && dayData.price) accommodationFare += dayData.price;
          currentDate.setDate(currentDate.getDate() + 1);
        }
        const cleaningFee = Math.round(accommodationFare * 0.10);
        const taxes = Math.round(accommodationFare * 0.12);
        const totalPrice = accommodationFare + cleaningFee + taxes;
        setQuote({ success: true, rates: { accommodationFare, cleaningFee, taxes, serviceFee: 0, totalPrice } });
        setError('');
      } else {
        setError('Failed to load pricing. Please try again.');
      }
    } catch (err) {
      setError('Failed to load pricing. Please try again.');
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCard({ ...card, number: formatted });
    }
  };

  const useTestCard = () => {
    setCard({
      number: '4580 4580 4580 4580',
      exp_month: '12',
      exp_year: '2028',
      cvc: '123',
      zip: '85001'
    });
    setTestMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cardNum = card.number.replace(/\s/g, '');
    if (cardNum.length < 13 || cardNum.length > 19) {
      setError('Please enter a valid card number.');
      setIsLoading(false);
      return;
    }
    const expMonth = parseInt(card.exp_month);
    if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
      setError('Please enter a valid expiration month (01-12).');
      setIsLoading(false);
      return;
    }
    const expYear = parseInt(card.exp_year);
    const currentYear = new Date().getFullYear();
    if (isNaN(expYear) || expYear < currentYear || expYear > currentYear + 15) {
      setError('Please enter a valid expiration year.');
      setIsLoading(false);
      return;
    }
    if (card.cvc.length < 3) {
      setError('Please enter a valid CVC.');
      setIsLoading(false);
      return;
    }

    try {
      const formattedPhone = formData.phone.replace(/[^0-9+]/g, '');
      const phone = formattedPhone.startsWith('+') ? formattedPhone : '+1' + formattedPhone;

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: phone,
        propertyName: bookingData.propertyName,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: quote.rates.totalPrice,
        accommodationFare: quote.rates.accommodationFare,
        cleaningFee: quote.rates.cleaningFee,
        taxes: quote.rates.taxes,
        serviceFee: quote.rates.serviceFee || 0,
        card: {
          number: cardNum,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          cvc: card.cvc,
          zip: card.zip
        }
      };

      const { data } = await base44.functions.invoke('processCheckout', payload);

      if (data.success) {
        navigate(createPageUrl('BookingConfirmation'), { state: data });
      } else {
        setError(data.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingData) return null;

  const checkInDate = new Date(bookingData.checkIn + 'T00:00:00');
  const checkOutDate = new Date(bookingData.checkOut + 'T00:00:00');
  const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div>
                <div className="text-sm text-gray-500">Property</div>
                <div className="font-semibold text-lg">{bookingData.propertyName}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Check-in</div>
                  <div className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Check-out</div>
                  <div className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Guests</div>
                  <div className="font-medium">{bookingData.guests}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nights</div>
                  <div className="font-medium">{nights}</div>
                </div>
              </div>
            </div>

            {quote && quote.rates && (
              <div className="space-y-3">
                {quote.rates.accommodationFare > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accommodation</span>
                    <span>${quote.rates.accommodationFare.toFixed(2)}</span>
                  </div>
                )}
                {quote.rates.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning Fee</span>
                    <span>${quote.rates.cleaningFee.toFixed(2)}</span>
                  </div>
                )}
                {quote.rates.taxes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>${quote.rates.taxes.toFixed(2)}</span>
                  </div>
                )}
                {quote.rates.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>${quote.rates.serviceFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${quote.rates.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Guest Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Card Information</h3>
                  {showTestCard && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={useTestCard}
                      className="text-xs"
                    >
                      Use Test Card
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Card Number"
                      value={card.number}
                      onChange={handleCardNumberChange}
                      required
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="MM"
                      value={card.exp_month}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 2) setCard({ ...card, exp_month: val });
                      }}
                      required
                      maxLength={2}
                    />
                    <Input
                      placeholder="YYYY"
                      value={card.exp_year}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 4) setCard({ ...card, exp_year: val });
                      }}
                      required
                      maxLength={4}
                    />
                    <Input
                      placeholder="CVC"
                      value={card.cvc}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 4) setCard({ ...card, cvc: val });
                      }}
                      required
                      maxLength={4}
                    />
                  </div>
                  <Input
                    placeholder="Billing ZIP Code"
                    value={card.zip}
                    onChange={(e) => setCard({ ...card, zip: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Your card is securely tokenized via GuestyPay. We never store card details.</span>
                </div>
              </div>

              {testMode && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Test Mode:</strong> Using Guesty test card.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !quote}
                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Pay ${quote?.rates.totalPrice.toFixed(2) || '0.00'}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Your payment is secure and encrypted.
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}