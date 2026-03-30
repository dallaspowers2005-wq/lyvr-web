import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Bed, Users, Bath, MapPin, ChevronLeft, ChevronRight, X, 
  Check, Loader2, ImageOff, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/home/Footer';
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar';

// RobustImage Component - handles CORS issues and loading states
function RobustImage({ src, alt, className, onLoad }) {
  const [status, setStatus] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setStatus('loading');
    setRetryCount(0);
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (retryCount < 2) {
      // Retry with cache-busting
      setRetryCount(prev => prev + 1);
      setImgSrc(`${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`);
      setStatus('loading');
    } else {
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setStatus('loading');
    setImgSrc(`${src}?t=${Date.now()}`);
  };

  if (status === 'error') {
    return (
      <div className={`${className} bg-stone-200 flex flex-col items-center justify-center gap-2`}>
        <ImageOff className="w-8 h-8 text-stone-400" />
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-3 py-1 bg-stone-700 text-white rounded-lg text-sm hover:bg-stone-800"
        >
          <RefreshCw className="w-4 h-4" />
          Tap to reload
        </button>
      </div>
    );
  }

  return (
    <>
      {status === 'loading' && (
        <div 
          className={`${className} bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 bg-[length:200%_100%]`}
          style={{ animation: 'shimmer 1.5s infinite' }}
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${status === 'loading' ? 'hidden' : ''}`}
        referrerPolicy="no-referrer"
        onLoad={() => {
          setStatus('loaded');
          onLoad?.();
        }}
        onError={handleError}
      />
    </>
  );
}

// GalleryModal Component with touch and keyboard support
function GalleryModal({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Preload adjacent images for instant switching
  useEffect(() => {
    const preloadRange = 5;
    const imagesToPreload = [];
    
    for (let i = -preloadRange; i <= preloadRange; i++) {
      if (i !== 0) {
        const idx = (currentIndex + i + images.length) % images.length;
        imagesToPreload.push(images[idx]);
      }
    }
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center p-4">
        <RobustImage
          src={images[currentIndex]}
          alt={`Gallery ${currentIndex + 1}`}
          className="max-w-[85%] max-h-[75vh] object-contain"
        />
      </div>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Thumbnail Strip */}
      <div className="bg-black/80 p-4 overflow-x-auto">
        <div className="flex gap-2 justify-center">
          {images.slice(0, 20).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <RobustImage src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}



export default function PropertyDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');
  const from = urlParams.get('from');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const properties = await base44.entities.Property.filter({ id: propertyId });
      return properties[0];
    },
    enabled: !!propertyId
  });

  const allImages = property ? [property.hero_image, ...(property.gallery_images || [])].filter(Boolean) : [];

  // Check availability when both dates are selected
  useEffect(() => {
    if (!checkIn || !checkOut || !property?.name) {
      setAvailability(null);
      return;
    }

    async function checkAvail() {
      setChecking(true);
      try {
        const response = await fetch('/api/checkAvailability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyName: property.name, checkIn, checkOut })
        });
        const data = await response.json();

        // Calculate nights correctly (checkout day is not charged)
        const checkInDate = new Date(checkIn + 'T00:00:00');
        const checkOutDate = new Date(checkOut + 'T00:00:00');
        const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        if (data) {
          data.nights = nights;
        }

        setAvailability(data);
      } catch (error) {
        setAvailability({ available: false, message: 'Error checking availability', canBook: false });
      } finally {
        setChecking(false);
      }
    }

    checkAvail();
  }, [checkIn, checkOut, property?.name]);

  const handleDateSelect = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (date > checkIn) {
      const nights = Math.floor((new Date(date) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      if (nights < 2) return; // enforce 2-night minimum
      setCheckOut(date);
    } else {
      setCheckIn(date);
      setCheckOut(null);
    }
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
    setAvailability(null);
  };

  const bookingMutation = useMutation({
    mutationFn: (data) => base44.entities.BookingInquiry.create(data),
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries(['booking-inquiries']);
    }
  });

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !availability?.available) return;

    const checkInDate = new Date(checkIn + 'T00:00:00');
    const checkOutDate = new Date(checkOut + 'T00:00:00');
    const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const accommodationFare = availability.totalPrice || 0;
    const cleaningFee = Math.round(accommodationFare * 0.10);
    const taxes = Math.round(accommodationFare * 0.12);

    navigate(createPageUrl('Checkout'), {
      state: {
        propertyName: property.name,
        checkIn,
        checkOut,
        guests,
        nights,
        nightlyRate: property.price_per_night,
        accommodationFare,
        cleaningFee,
        taxes
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl text-stone-800 mb-4">Property not found</h1>
        <Link to={createPageUrl('Properties')} className="text-amber-600 hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to={createPageUrl(from === 'home' ? 'Home' : 'Properties')} 
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full transition-all duration-300 font-medium text-sm border border-amber-200"
            >
              ← Back to {from === 'home' ? 'Home' : 'Properties'}
            </Link>
            <Link to={createPageUrl('Home')} onClick={() => window.scrollTo(0, 0)} className="text-stone-800 font-light tracking-wide">
              LoveYourVacationRentals.com
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Video or Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        {property.video_url ? (
          <iframe
            src={
              property.video_url.includes('youtube.com/watch') 
                ? property.video_url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1'
                : property.video_url.includes('youtu.be/')
                  ? 'https://www.youtube.com/embed/' + property.video_url.split('youtu.be/')[1].split('?')[0] + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=' + property.video_url.split('youtu.be/')[1].split('?')[0]
                  : property.video_url
            }
            className="w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
            allowFullScreen
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        ) : (
          <RobustImage
            src={property.hero_image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {property.name}
            </h1>
            {property.location && (
              <p className="text-white/90 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {property.location}
              </p>
            )}
          </div>
        </div>

        {/* Gallery Button */}
        {allImages.length > 0 && (
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-8 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-stone-800 font-medium hover:bg-white transition-colors z-10"
          >
            View Gallery ({allImages.length})
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Bed className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-stone-800">{property.bedrooms}</p>
                  <p className="text-stone-500 text-sm">Bedrooms</p>
                </div>
              </div>
              {property.beds && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Bed className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-stone-800">{property.beds}</p>
                    <p className="text-stone-500 text-sm">Beds</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Bath className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-stone-800">{property.bathrooms}</p>
                    <p className="text-stone-500 text-sm">Bathrooms</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-stone-800">{property.max_guests}</p>
                  <p className="text-stone-500 text-sm">Guests</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl text-stone-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  About This Property
                </h2>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-amber-600" />
                      <span className="text-stone-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Where You'll Sleep */}
            {property.bedrooms > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Where You'll Sleep
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory">
                  {(() => {
                    // Generate bedroom cards based on bedroom count and guest capacity
                    const bedrooms = property.bedrooms || 1;
                    const bedroomDetails = property.bedroom_details || null;

                    if (bedroomDetails && Array.isArray(bedroomDetails)) {
                      return bedroomDetails.map((room, idx) => (
                        <div key={idx} className="flex-shrink-0 w-48 border border-stone-200 rounded-xl p-5 snap-start">
                          <Bed className="w-7 h-7 text-stone-600 mb-3" />
                          <p className="font-medium text-stone-800 text-sm">{room.name}</p>
                          <p className="text-stone-500 text-xs mt-1">{room.beds}</p>
                        </div>
                      ));
                    }

                    // Auto-generate reasonable bedroom layout
                    const rooms = [];
                    const guestsPerRoom = Math.ceil((property.max_guests || bedrooms * 2) / bedrooms);

                    for (let i = 0; i < bedrooms; i++) {
                      let bedType;
                      if (i === 0) {
                        bedType = '1 king bed';
                      } else if (i === 1) {
                        bedType = '1 queen bed';
                      } else if (guestsPerRoom >= 4) {
                        bedType = i % 2 === 0 ? '2 queen beds' : '2 twin beds';
                      } else {
                        bedType = i % 3 === 0 ? '1 king bed' : i % 3 === 1 ? '1 queen bed' : '2 twin beds';
                      }

                      rooms.push(
                        <div key={i} className="flex-shrink-0 w-48 border border-stone-200 rounded-xl p-5 snap-start">
                          <Bed className="w-7 h-7 text-stone-600 mb-3" />
                          <p className="font-medium text-stone-800 text-sm">
                            {i === 0 ? 'Master Bedroom' : `Bedroom ${i + 1}`}
                          </p>
                          <p className="text-stone-500 text-xs mt-1">{bedType}</p>
                        </div>
                      );
                    }
                    return rooms;
                  })()}
                </div>
              </div>
            )}

            {/* Photo Gallery Preview */}
            {property.gallery_images && property.gallery_images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {property.gallery_images.slice(0, 6).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx + 1);
                        setShowGallery(true);
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <RobustImage
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {idx === 5 && property.gallery_images.length > 6 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-2xl font-semibold">
                            +{property.gallery_images.length - 5}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Booking Section - Full Width */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {bookingSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl text-stone-800 mb-2">Booking Request Sent!</h3>
                  <p className="text-stone-600 text-sm mb-6">We'll contact you within 24 hours to confirm your reservation.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setBookingSuccess(false);
                      clearDates();
                      setEmail('');
                      setPhone('');
                    }}
                  >
                    Book Another Stay
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Date Selection */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="border border-stone-300 rounded-lg p-3">
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Check-in</label>
                        <span className="text-sm text-stone-800">{checkIn || 'Select'}</span>
                      </div>
                      <div className="border border-stone-300 rounded-lg p-3">
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Check-out</label>
                        <span className="text-sm text-stone-800">{checkOut || 'Select'}</span>
                      </div>
                    </div>
                    
                    {(checkIn || checkOut) && (
                      <button onClick={clearDates} className="text-xs text-amber-600 hover:underline">
                        Clear dates
                      </button>
                    )}

                    <div className="text-xs text-stone-500 text-center mb-4">
                      {!checkIn && 'Select check-in date'}
                      {checkIn && !checkOut && 'Select check-out date (2-night minimum)'}
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="mb-6">
                    <AvailabilityCalendar
                      propertyName={property.name}
                      onDateSelect={(date) => handleDateSelect(date)}
                      selectedCheckIn={checkIn}
                      selectedCheckOut={checkOut}
                    />
                  </div>

                  {/* Availability Check */}
                  {checking && (
                    <div className="text-center py-4 mb-4">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-600" />
                    </div>
                  )}

                  {availability && !checking && (
                    <div className={`mb-6 p-4 rounded-lg ${availability.available ? 'bg-green-50' : 'bg-red-50'}`}>
                      {availability.available ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-stone-700">
                            <span>{availability.nights} nights</span>
                            <span>${availability.totalPrice}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t">
                            <span>Total</span>
                            <span>${availability.totalPrice}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-red-700 text-sm text-center">{availability.message}</p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    disabled={!checkIn || !checkOut || !availability?.available || checking}
                    className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50"
                  >
                    {checking ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Book Now'
                    )}
                  </Button>
                </>
              )}
            </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <GalleryModal
            images={allImages}
            initialIndex={currentImageIndex}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && property.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={property.video_url.includes('youtube.com/watch') 
                  ? property.video_url.replace('watch?v=', 'embed/') + '?autoplay=1'
                  : property.video_url.includes('youtu.be/')
                    ? 'https://www.youtube.com/embed/' + property.video_url.split('youtu.be/')[1] + '?autoplay=1'
                    : property.video_url
                }
                className="w-full h-full rounded-xl"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}