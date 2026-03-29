import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Users, Bath, MapPin, ChevronDown, ChevronUp, ImageOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function RobustCardImage({ src, alt }) {
  const [status, setStatus] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setImgSrc(`${src}${src?.includes('?') ? '&' : '?'}t=${Date.now()}`);
    } else {
      setStatus('error');
    }
  };

  if (!src || status === 'error') {
    return (
      <div className="w-full h-full bg-stone-200 flex flex-col items-center justify-center gap-2">
        <ImageOff className="w-8 h-8 text-stone-400" />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRetryCount(0); setStatus('loading'); setImgSrc(`${src}?t=${Date.now()}`); }}
          className="flex items-center gap-1 px-2 py-1 bg-stone-700 text-white rounded text-xs hover:bg-stone-800"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 bg-[length:200%_100%] animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setStatus('loaded')}
        onError={handleError}
      />
    </>
  );
}

export default function PropertyCard({ property, index = 0 }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
        <Link to={createPageUrl('PropertyDetail') + '?id=' + property.id} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="cursor-pointer">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <RobustCardImage src={property.hero_image} alt={property.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Quick Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-white text-sm">
                <Bed className="w-4 h-4" />
                {property.bedrooms} Bedrooms
              </span>
              {property.beds && (
                <span className="flex items-center gap-1.5 text-white text-sm">
                  <Bed className="w-4 h-4" />
                  {property.beds} Beds
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1.5 text-white text-sm">
                  <Bath className="w-4 h-4" />
                  {property.bathrooms} Baths
                </span>
              )}
              <span className="flex items-center gap-1.5 text-white text-sm">
                <Users className="w-4 h-4" />
                {property.max_guests} Guests
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 
                className="text-xl text-stone-800 hover:text-amber-700 transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {property.name}
              </h3>
            </div>
            
            {property.location && (
              <p className="text-stone-500 text-sm flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                {property.location}
              </p>
            )}

            {property.tagline && (
              <p 
                className="text-amber-700 text-sm mb-4"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                {property.tagline}
              </p>
            )}
          </div>
        </Link>

        {/* Amenities - Outside the Link so clicking doesn't navigate */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {(showAllAmenities ? property.amenities : property.amenities.slice(0, 3)).map((amenity) => (
                <span 
                  key={amenity}
                  className="px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-600"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllAmenities(!showAllAmenities);
                  }}
                  className="px-2.5 py-1 bg-amber-100 rounded-full text-xs text-amber-700 hover:bg-amber-200 transition-colors flex items-center gap-1"
                >
                  {showAllAmenities ? (
                    <>Less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>+{property.amenities.length - 3} more <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}