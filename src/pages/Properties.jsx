import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Calendar, Users, Bed, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import PropertyCard from '@/components/properties/PropertyCard';
import Footer from '@/components/home/Footer';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { differenceInDays, parseISO } from 'date-fns';

export default function Properties() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    checkIn: urlParams.get('checkIn') || '',
    checkOut: urlParams.get('checkOut') || '',
    guests: urlParams.get('guests') || '',
    minGuests: '',
    maxPrice: '',
    minBedrooms: ''
  });

  const isFlexible = urlParams.get('flexible') === '1';
  const flexibleAvailableNames = isFlexible
    ? JSON.parse(sessionStorage.getItem('flexibleAvailableProperties') || '[]')
    : null;

  const { data: filteredProperties = [], isLoading } = useQuery({
    queryKey: ['filteredProperties', filters.checkIn, filters.checkOut, filters.guests, filters.minGuests, filters.maxPrice, filters.minBedrooms, isFlexible],
    queryFn: async () => {
      const response = await base44.functions.invoke('filterProperties', filters);
      const all = response.data || [];
      if (isFlexible && flexibleAvailableNames && flexibleAvailableNames.length > 0) {
        return all.filter(p => flexibleAvailableNames.includes(p.name));
      }
      return all;
    }
  });

  const clearFilters = () => {
    setFilters({
      checkIn: '',
      checkOut: '',
      guests: '',
      minGuests: '',
      maxPrice: '',
      minBedrooms: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                            <Link 
                                              to={createPageUrl('Home')} 
                                              onClick={() => window.scrollTo(0, 0)}
                                              className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full transition-all duration-300 font-medium text-sm border border-amber-200"
                                            >
                                              ← Back to Home
                                            </Link>
                            <Link to={createPageUrl('Home')} className="text-stone-800 font-light tracking-wide">
                              LoveYourVacationRental.com
                            </Link>
                          </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-3xl md:text-5xl text-stone-800 mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Find Your Perfect Family Escape
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Explore our handpicked collection of luxury homes, each designed for unforgettable multi-generational gatherings.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-stone-200 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400" />
              <Input
                type="date"
                placeholder="Check in"
                value={filters.checkIn}
                onChange={(e) => setFilters({...filters, checkIn: e.target.value})}
                className="w-36 h-10 text-sm"
              />
              <span className="text-stone-400">—</span>
              <Input
                type="date"
                placeholder="Check out"
                value={filters.checkOut}
                onChange={(e) => setFilters({...filters, checkOut: e.target.value})}
                className="w-36 h-10 text-sm"
              />
            </div>

            {/* Guest Filter */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-400" />
              <Select value={filters.guests} onValueChange={(v) => setFilters({...filters, guests: v})}>
                <SelectTrigger className="w-32 h-10">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4+ Guests</SelectItem>
                  <SelectItem value="8">8+ Guests</SelectItem>
                  <SelectItem value="12">12+ Guests</SelectItem>
                  <SelectItem value="16">16+ Guests</SelectItem>
                  <SelectItem value="20">20+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms Filter */}
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-stone-400" />
              <Select value={filters.minBedrooms} onValueChange={(v) => setFilters({...filters, minBedrooms: v})}>
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                  <SelectItem value="6">6+ Bedrooms</SelectItem>
                  <SelectItem value="8">8+ Bedrooms</SelectItem>
                  <SelectItem value="10">10+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* More Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  More Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <Label className="text-sm text-stone-600">Minimum Guests</Label>
                    <Select value={filters.minGuests} onValueChange={(v) => setFilters({...filters, minGuests: v})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Sleeps 10+</SelectItem>
                        <SelectItem value="15">Sleeps 15+</SelectItem>
                        <SelectItem value="20">Sleeps 20+</SelectItem>
                        <SelectItem value="25">Sleeps 25+</SelectItem>
                        <SelectItem value="30">Sleeps 30+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-stone-600">Maximum Price/Night</Label>
                    <Select value={filters.maxPrice} onValueChange={(v) => setFilters({...filters, maxPrice: v})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">Up to $500</SelectItem>
                        <SelectItem value="750">Up to $750</SelectItem>
                        <SelectItem value="1000">Up to $1,000</SelectItem>
                        <SelectItem value="1500">Up to $1,500</SelectItem>
                        <SelectItem value="2000">Up to $2,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="h-10 text-stone-500 hover:text-stone-700 gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-stone-500">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <p className="text-stone-500 mt-4">Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-xl text-stone-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              No properties found
            </h3>
            <p className="text-stone-500 mb-4">
              Try adjusting your filters to see more options
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}