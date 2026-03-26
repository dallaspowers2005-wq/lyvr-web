import React from 'react';
import { motion } from 'framer-motion';
import { Palmtree, Sofa, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const trustPillars = [
  {
    icon: Palmtree,
    title: 'Room for the whole crew',
    stat: 'Sleeps up to 30',
    caption: 'Space for Everyone',
    rotation: -3,
    tapeColor: 'bg-pink-200/70',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693113f3a59cea8a7e5c0a56/b4e20cfcd_Screenshot2026-02-10at35038PM.png',
    linkTo: '69841c03f684f61004cbdacb'
  },
  {
    icon: Sofa,
    title: 'No shared walls, no strangers',
    stat: '100% Private',
    caption: 'Your Private Resort',
    rotation: 2,
    tapeColor: 'bg-green-200/70',
    image: 'https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/b6b382f9a_Screenshot2025-12-13at40411PM.png',
    linkTo: '693dfe0a0aa9961e1b93927c'
  },
  {
    icon: Heart,
    title: 'Outdoor dining & resort-style living',
    stat: '5-Star Standard',
    caption: 'Luxury Getaways',
    rotation: -2,
    tapeColor: 'bg-yellow-200/70',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693113f3a59cea8a7e5c0a56/0ed1ebd1c_Screenshot2026-02-10at72813PM.png',
    linkTo: '693e4008d07c549518b20f0e'
  },
  {
    icon: Sparkles,
    title: 'Where traditions begin',
    stat: '1000+ Happy Families',
    caption: 'Memory Makers',
    rotation: 3,
    tapeColor: 'bg-blue-200/70',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693113f3a59cea8a7e5c0a56/e7ff16ea3_Screenshot2026-02-10at72500PM.png',
    linkTo: '693f413feb4eb49075db1b52'
  }
];

export default function TrustSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-stone-50 to-amber-50/30 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
      `}</style>

      {/* Scrapbook paper texture */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span 
            className="text-amber-700 text-base md:text-lg lg:text-xl"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Why Families Choose Us
          </span>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Polaroid Scrapbook Grid */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {trustPillars.map((pillar, index) => {
            const CardContent = (
              <motion.div
                key={pillar.caption}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: pillar.rotation }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ rotate: 0, scale: 1.05, y: -8 }}
                className="group relative"
              >
                {/* Polaroid Card */}
                <div className="bg-white rounded-lg shadow-xl p-4 md:p-5 transform transition-all duration-500">
                {/* Photo */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-sm mb-4">
                  <img 
                    src={pillar.image} 
                    alt={pillar.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Stat Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-amber-600 font-bold text-sm" style={{ fontFamily: 'Caveat, cursive' }}>
                      {pillar.stat}
                    </span>
                  </div>
                </div>

                {/* Caption Area - Handwritten style */}
                <div className="text-center space-y-1">
                  <h3 
                    className="text-xl md:text-2xl text-stone-800"
                    style={{ fontFamily: 'Caveat, cursive', fontWeight: 700 }}
                  >
                    {pillar.caption}
                  </h3>
                  <p 
                    className="text-base md:text-lg text-stone-600"
                    style={{ fontFamily: 'Caveat, cursive' }}
                  >
                    {pillar.title}
                  </p>
                </div>
              </div>
            </motion.div>
            );
            
            return pillar.linkTo ? (
              <Link key={pillar.caption} to={createPageUrl('PropertyDetail') + '?id=' + pillar.linkTo} onClick={() => window.scrollTo(0, 0)}>
                {CardContent}
              </Link>
            ) : CardContent;
          })}
        </div>
      </div>
    </section>
  );
}