import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Users, ArrowRight, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

function FeaturedImage({ src, alt }) {
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
      <div className="w-full h-full bg-stone-200 flex items-center justify-center">
        <ImageOff className="w-8 h-8 text-stone-400" />
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

export default function FeaturedProperties() {
  const { data: properties = [] } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => base44.entities.Property.filter({ is_featured: true })
  });

  const featuredHomes = properties.map(prop => ({
    id: prop.id,
    name: prop.name,
    tagline: prop.tagline,
    image: prop.hero_image,
    bedrooms: prop.bedrooms,
    guests: prop.max_guests,
    features: prop.amenities?.slice(0, 6) || []
  }));
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-amber-50/30 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span 
            className="text-amber-700 text-base md:text-lg"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Our Favorite Escapes
          </span>
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl text-stone-800 mt-4 px-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Handpicked Homes for Your Family
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4 md:mt-6" />
        </motion.div>

        {/* Properties Grid */}
        {featuredHomes.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredHomes.map((home, index) => (
            <motion.div
              key={home.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group cursor-pointer"
            >
              <Link to={createPageUrl('PropertyDetail') + '?id=' + home.id + '&from=home'} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <FeaturedImage src={home.image} alt={home.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Quick Stats */}
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex justify-between">
                    <div className="flex gap-3 md:gap-4">
                      <span className="flex items-center gap-1 md:gap-1.5 text-white text-xs md:text-sm">
                        <Bed className="w-3 h-3 md:w-4 md:h-4" />
                        {home.bedrooms} Bedrooms
                      </span>
                      <span className="flex items-center gap-1 md:gap-1.5 text-white text-xs md:text-sm">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        {home.guests} Guests
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <h3 
                    className="text-lg md:text-xl text-stone-800 mb-1"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {home.name}
                  </h3>
                  <p 
                    className="text-amber-700 text-xs md:text-sm mb-3 md:mb-4"
                    style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  >
                    {home.tagline}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mt-auto">
                    {home.features.slice(0, 3).map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 md:px-2.5 py-0.5 md:py-1 bg-stone-100 rounded-full text-xs text-stone-600"
                      >
                        {feature}
                      </span>
                    ))}
                    {home.features.length > 3 && (
                      <span className="px-2 md:px-2.5 py-0.5 md:py-1 bg-amber-100 rounded-full text-xs text-amber-700">
                        +{home.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to={createPageUrl('Properties')}>
            <Button 
              variant="outline"
              className="group h-14 px-8 text-lg border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-300"
            >
              See All Houses
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}