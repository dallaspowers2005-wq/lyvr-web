import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HeroSection from '@/components/home/HeroSection';
import TrustSection from '@/components/home/TrustSection';
import ActivitiesCarousel from '@/components/home/ActivitiesCarousel';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AreaActivitiesSection from '@/components/home/AreaActivitiesSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import SearchByDateSection from '@/components/home/SearchByDateSection';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustSection />
      <ActivitiesCarousel />
      <FeaturedProperties />
      <AreaActivitiesSection />
      <ReviewsSection />
      <SearchByDateSection />
      <Footer />
    </div>
  );
}