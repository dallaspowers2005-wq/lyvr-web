import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, Users, Mail, Phone } from 'lucide-react';
import Footer from '@/components/home/Footer';

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No booking found</h2>
          <Link to={createPageUrl('Properties')}>
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your reservation has been successfully confirmed
            </p>
          </div>

          {/* Confirmation Code */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8 text-center">
            <p className="text-sm text-amber-800 mb-1">Confirmation Code</p>
            <p className="text-3xl font-bold text-amber-900 tracking-wider">
              {booking.confirmationCode}
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Property</div>
                    <div className="font-semibold">{booking.propertyName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Check-in</div>
                    <div className="font-semibold">{booking.checkInFormatted}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Check-out</div>
                    <div className="font-semibold">{booking.checkOutFormatted}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Guests</div>
                    <div className="font-semibold">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{booking.email}</span>
                </div>
                {booking.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{booking.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Booking Total</h3>
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-green-600">${booking.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• A confirmation email has been sent to {booking.email}</li>
              <li>• You'll receive check-in instructions 24 hours before arrival</li>
              <li>• Contact us anytime if you have questions</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl('Home')} className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link to={createPageUrl('Properties')} className="flex-1">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Browse More Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}