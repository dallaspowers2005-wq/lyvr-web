import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';

const stayDurations = [
  { label: 'Weekday stays (Cheaper!)', value: 'weekday' },
  { label: '1 week', value: '1week' },
  { label: '2 weeks', value: '2weeks' },
  { label: '1 month', value: '1month' }
];

function generateMonths() {
  const months = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const date = addMonths(today, i);
    months.push({
      date,
      label: format(date, 'MMMM'),
      year: format(date, 'yyyy')
    });
  }
  return months;
}

export default function SearchByDateSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('exact');
  const [selectedDuration, setSelectedDuration] = useState('1week');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const months = generateMonths();

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (isAfter(date, startDate) || isSameDay(date, startDate)) {
      setEndDate(date);
    } else {
      setEndDate(startDate);
      setStartDate(date);
    }
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return isAfter(date, startDate) && isBefore(date, endDate);
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedMonths([]);
  };

  const toggleMonth = (monthLabel) => {
    setSelectedMonths(prev => 
      prev.includes(monthLabel) 
        ? prev.filter(m => m !== monthLabel)
        : [...prev, monthLabel]
    );
  };

  const runFlexibleSearch = () => {
    setIsSearching(true);

    let searchMonths = 'anytime';
    if (selectedMonths.length > 0) {
      searchMonths = selectedMonths.map(function(m) {
        const parts = m.split('-');
        const monthName = parts[0];
        const year = parts[1];
        const monthNum = new Date(monthName + ' 1, ' + year).getMonth() + 1;
        return year + '-' + String(monthNum).padStart(2, '0');
      });
    }

    base44.functions.invoke('flexibleSearch', { duration: selectedDuration, months: searchMonths })
      .then(function(response) {
        const data = response.data;
        if (data && data.success && data.results && data.results.length > 0) {
          const availableNames = data.results.map(function(r) { return r.property; });
          sessionStorage.setItem('flexibleAvailableProperties', JSON.stringify(availableNames));
          sessionStorage.setItem('flexibleSearchResults', JSON.stringify(data));
          window.location.href = createPageUrl('Properties') + '?flexible=1';
        } else {
          setIsSearching(false);
          alert('No availability found. Try different dates or duration.');
        }
      })
      .catch(function() {
        setIsSearching(false);
        alert('Search failed. Please try again.');
      });
  };

  const handleExactSearch = () => {
    if (startDate) {
      const params = new URLSearchParams();
      params.set('checkIn', format(startDate, 'yyyy-MM-dd'));
      if (endDate) params.set('checkOut', format(endDate, 'yyyy-MM-dd'));
      window.location.href = createPageUrl('Properties') + '?' + params.toString();
    }
  };

  const renderCalendar = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    const startDay = start.getDay();
    const today = startOfDay(new Date());

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-stone-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const isStart = startDate && isSameDay(day, startDate);
            const isEnd = endDate && isSameDay(day, endDate);
            const inRange = isDateInRange(day);
            const isPast = isBefore(day, today);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && handleDateClick(day)}
                disabled={isPast}
                className={`
                  h-10 rounded-lg text-sm transition-all
                  ${isPast ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-stone-100 cursor-pointer'}
                  ${isStart || isEnd ? 'bg-violet-600 text-white hover:bg-violet-700' : ''}
                  ${inRange ? 'bg-violet-100 text-violet-800' : ''}
                  ${!isStart && !isEnd && !inRange && !isPast ? 'text-stone-700' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    } else if (startDate) {
      return format(startDate, 'MMM d, yyyy');
    }
    return 'Choose dates';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-stone-50 to-amber-50/30">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 
            className="text-3xl md:text-4xl text-stone-800 mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Ready to Plan Your Escape?
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Select your dates and discover the perfect home for your family getaway.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl max-w-xl mx-auto"
        >
          {/* Date Picker Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:border-violet-400 transition-colors mb-6 group"
          >
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-stone-400 group-hover:text-violet-500 transition-colors" />
              <span className={`${startDate ? 'text-stone-800' : 'text-stone-500'}`}>
                {getDisplayText()}
              </span>
            </div>
            <span className="text-violet-600 text-sm font-medium">
              {startDate ? 'Edit' : 'Select'}
            </span>
          </button>

          <Button 
            onClick={() => {
              if (activeTab === 'exact') {
                handleExactSearch();
              } else {
                runFlexibleSearch();
              }
            }}
            disabled={isSearching || (activeTab === 'exact' && !startDate)}
            className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-50"
          >
            {isSearching ? 'Searching properties...' : 'Search Available Homes'}
          </Button>
        </motion.div>
      </div>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tab Switcher */}
              <div className="flex justify-center pt-6 pb-4">
                <div className="inline-flex bg-stone-100 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab('exact')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === 'exact' 
                        ? 'bg-white text-stone-800 shadow-sm' 
                        : 'text-stone-600 hover:text-stone-800'
                    }`}
                  >
                    Exact dates
                  </button>
                  <button
                    onClick={() => setActiveTab('flexible')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === 'flexible' 
                        ? 'bg-white text-stone-800 shadow-sm' 
                        : 'text-stone-600 hover:text-stone-800'
                    }`}
                  >
                    I'm flexible
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {activeTab === 'exact' ? (
                  <div className="py-4">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                        disabled={isBefore(startOfMonth(addMonths(currentMonth, -1)), startOfMonth(new Date()))}
                        className="p-2 hover:bg-stone-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-medium text-stone-800">
                        {format(currentMonth, 'MMMM yyyy')}
                      </span>
                      <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        disabled={isAfter(startOfMonth(addMonths(currentMonth, 1)), addMonths(new Date(), 12))}
                        className="p-2 hover:bg-stone-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Selected dates display */}
                    {(startDate || endDate) && (
                      <div className="mb-4 p-3 bg-violet-50 rounded-lg text-center">
                        <p className="text-sm text-violet-800">
                          {startDate && format(startDate, 'MMM d, yyyy')}
                          {startDate && endDate && ' → '}
                          {endDate && format(endDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    
                    <div className="max-w-sm mx-auto">
                      {renderCalendar(currentMonth)}
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <h3 className="text-center font-semibold text-stone-800 mb-4">
                      How long would you like to stay?
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                      {stayDurations.map(duration => (
                        <button
                          key={duration.value}
                          onClick={() => setSelectedDuration(duration.value)}
                          className={`px-4 py-2 rounded-full border text-sm transition-all ${
                            selectedDuration === duration.value
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-300 text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          {duration.label}
                        </button>
                      ))}
                    </div>

                    <h3 className="text-center font-semibold text-stone-800 mb-4">
                      When do you want to go?
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 px-2">
                      <button
                        onClick={() => setSelectedMonths([])}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border transition-all ${
                          selectedMonths.length === 0
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <CalendarIcon className="w-5 h-5 text-stone-500 mb-1" />
                        <span className="text-xs text-stone-700">Anytime</span>
                      </button>
                      <div className="text-stone-400 flex items-center px-2">or</div>
                      {months.map(month => (
                        <button
                          key={`${month.label}-${month.year}`}
                          onClick={() => toggleMonth(`${month.label}-${month.year}`)}
                          className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border transition-all ${
                            selectedMonths.includes(`${month.label}-${month.year}`)
                              ? 'border-violet-500 bg-violet-50'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <CalendarIcon className="w-5 h-5 text-stone-500 mb-1" />
                          <span className="text-xs font-medium text-stone-700">{month.label}</span>
                          <span className="text-xs text-stone-500">{month.year}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-stone-200 px-6 py-4 flex justify-between items-center">
                <button
                  onClick={clearDates}
                  className="text-stone-600 hover:text-stone-800 text-sm font-medium"
                >
                  Clear dates
                </button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    if (activeTab === 'flexible') {
                      runFlexibleSearch();
                    }
                  }}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6"
                >
                  Apply
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}