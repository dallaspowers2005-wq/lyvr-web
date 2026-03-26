import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bed, Users, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Footer from '@/components/home/Footer';
import { base44 } from '@/api/base44Client';

export default function FlexibleResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [propertiesMap, setPropertiesMap] = useState({});

  useEffect(() => {
    const stored = sessionStorage.getItem('flexibleSearchResults');
    if (stored) {
      setResults(JSON.parse(stored));
    }
    // Fetch all properties to get images/details
    base44.entities.Property.list().then(props => {
      const map = {};
      props.forEach(p => { map[p.name] = p; });
      setPropertiesMap(map);
    });
    setIsLoading(false);
  }, []);

  const formatDateRange = (checkIn, checkOut) => {
    const opts = { month: 'short', day: 'numeric' };
    const start = new Date(checkIn + 'T12:00:00').toLocaleDateString('en-US', opts);
    const end = new Date(checkOut + 'T12:00:00').toLocaleDateString('en-US', opts);
    return `${start} – ${end}`;
  };

  const handleBookWindow = (propertyName, window) => {
    // Navigate to PropertyDetail page with exact dates pre-filled
    const params = new URLSearchParams();
    params.set('checkIn', window.checkIn);
    params.set('checkOut', window.checkOut);
    window.location.href = createPageUrl('PropertyDetail') + `?name=${encodeURIComponent(propertyName)}&${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!results || !results.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">No Results Found</h2>
          <Link to={createPageUrl('Home')}>
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const durationLabel = {
    weekday: 'Weekday stays (Mon-Fri)',
    '1week': '1 week',
    '2weeks': '2 weeks',
    '1month': '1 month'
  }[results.searchParams?.duration] || results.searchParams?.duration;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl text-stone-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Flexible Search Results
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-stone-600">
            <span>Duration: <strong>{durationLabel}</strong></span>
            <span>•</span>
            <span>
              {results.propertiesWithAvailability} of {results.totalProperties} properties available
            </span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {results.results.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl text-stone-800 mb-2">No availability found</h2>
            <p className="text-stone-600 mb-6">
              Try adjusting your dates or duration for more options
            </p>
            <Link to={createPageUrl('Home')}>
              <Button>Search Again</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.results.map((property, index) => (
              <motion.div
                key={property.property}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Property Hero Image */}
                {propertiesMap[property.property]?.hero_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={propertiesMap[property.property].hero_image}
                      alt={property.property}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                {/* Property Header */}
                <div className="p-6 border-b border-stone-100">
                  <h3 className="text-xl font-semibold text-stone-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {property.property}
                  </h3>
                  {propertiesMap[property.property] && (
                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                      {propertiesMap[property.property].bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          {propertiesMap[property.property].bedrooms} beds
                        </span>
                      )}
                      {propertiesMap[property.property].max_guests && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Up to {propertiesMap[property.property].max_guests} guests
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-amber-600">
                      ${property.cheapest.avgPerNight}
                    </span>
                    <span className="text-sm text-stone-500">/night</span>
                  </div>
                  <p className="text-sm text-stone-600">
                    {property.totalWindows} available {property.totalWindows === 1 ? 'window' : 'windows'}
                  </p>
                </div>

                {/* Best Window */}
                <div className="p-6 bg-amber-50/50">
                  <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Best Deal</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-medium text-stone-800">
                      {formatDateRange(property.cheapest.checkIn, property.cheapest.checkOut)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-stone-600">
                      {property.cheapest.nights} nights
                    </span>
                    <span className="font-bold text-stone-800">
                      ${property.cheapest.totalPrice} total
                    </span>
                  </div>
                  <Button
                    onClick={() => handleBookWindow(property.property, property.cheapest)}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Book This Window
                  </Button>
                </div>

                {/* Other Windows */}
                {property.windows.length > 1 && (
                  <div className="p-6">
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-3">
                      Other Available Dates
                    </p>
                    <div className="space-y-3">
                      {property.windows.slice(1, 3).map((window, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          onClick={() => handleBookWindow(property.property, window)}
                        >
                          <div>
                            <div className="font-medium text-stone-800">
                              {formatDateRange(window.checkIn, window.checkOut)}
                            </div>
                            <div className="text-xs text-stone-500">
                              {window.nights} nights
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">
                              ${window.totalPrice}
                            </div>
                            <div className="text-xs text-stone-500">
                              ${window.avgPerNight}/night
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {property.totalWindows > 3 && (
                      <p className="text-xs text-center text-stone-500 mt-3">
                        +{property.totalWindows - 3} more available
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}