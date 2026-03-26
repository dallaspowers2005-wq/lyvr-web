import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ThreeDPhotoCarousel } from '@/components/ui/3d-carousel';

const activities = [
  // On-Site Activities
  { 
    category: 'onsite', 
    title: 'Backyard Pools',
    icon: '🏊',
    image: 'https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/b6b382f9a_Screenshot2025-12-13at40411PM.png',
    description: 'Heated pools, diving boards & baja shelves'
  },
  { 
    category: 'onsite', 
    title: 'Sport Courts',
    icon: '🎾',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693113f3a59cea8a7e5c0a56/9d4d32258_Screenshot2026-02-04at101820PM.png',
    description: 'Pickleball, basketball & putting greens',
    linkPropertyId: '694722d95a5549eddb892bbe'
  },
  { 
    category: 'onsite', 
    title: 'Game Rooms',
    linkPropertyId: '693dfe0a0aa9961e1b93927c',
    icon: '🎱',
    image: 'https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/7edf82913_Screenshot2025-12-13at40847PM.png',
    description: 'Pool tables, foosball & karaoke nights'
  },
  { 
    category: 'onsite', 
    title: 'Outdoor Kitchens',
    icon: '🍖',
    image: 'https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/73fc0923a_Screenshot2025-12-11at90006AM.png',
    description: 'BBQ feasts under the Arizona sky',
    linkPropertyId: '6982b7500a1c801f0dc9aa6a'
  },
  { 
    category: 'onsite', 
    title: 'Fire Pits',
    icon: '🔥',
    image: 'https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/22da53a48_Screenshot2025-12-20at30150PM.png',
    description: 'S\'mores and storytelling evenings',
    linkPropertyId: '694722d95a5549eddb892bbe'
  },
  
  
];

export default function ActivitiesCarousel() {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    if (card.linkPropertyId) {
      navigate(createPageUrl('PropertyDetail') + '?id=' + card.linkPropertyId);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-stone-50 to-amber-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-amber-700 text-lg block mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Endless Adventures Await
          </span>
          <h2 className="text-stone-800 text-3xl md:text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
            Things To Do
          </h2>
        </div>

        {/* 3D Carousel */}
        <div className="pb-8">
          <ThreeDPhotoCarousel cards={activities} onCardClick={handleCardClick} />
        </div>
      </div>
    </section>
  );
}