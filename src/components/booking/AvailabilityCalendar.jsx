import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Simple in-memory cache so navigating back doesn't re-fetch
const calendarCache = {};

export default function AvailabilityCalendar({ 
  listingId,
  propertyName,
  onDateSelect, 
  selectedCheckIn, 
  selectedCheckOut 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendar, setCalendar] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!listingId && !propertyName) {
      setLoading(false);
      setError('No listing ID or property name provided');
      return;
    }

    const cacheKey = listingId || propertyName;

    // Check cache first (valid for 5 minutes)
    if (calendarCache[cacheKey] && (Date.now() - calendarCache[cacheKey].timestamp < 5 * 60 * 1000)) {
      setCalendar(calendarCache[cacheKey].data);
      setLoading(false);
      return;
    }

    const loadCalendar = async (attempt = 1) => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
          .toISOString().split('T')[0];

        const response = await base44.functions.invoke('getCalendar', {
          listingId: listingId || null,
          propertyName: propertyName || null,
          startDate,
          endDate
        });

        const data = response.data;

        if (data.success && data.calendar && Object.keys(data.calendar).length > 0) {
          setCalendar(data.calendar);
          calendarCache[cacheKey] = { data: data.calendar, timestamp: Date.now() };
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('No availability data found');
        }
      } catch (err) {
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
          return loadCalendar(attempt + 1);
        }
        setError('Failed to connect to calendar service. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
  }, [listingId, propertyName]);

  const getDaysInMonth = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = calendar[dateStr] || {};

      days.push({
        date: dateStr,
        day: d,
        available: dayData.available === true,
        price: dayData.price || 0,
        status: dayData.status || 'unknown'
      });
    }

    return days;
  };

  const isPast = (dateStr) => dateStr < new Date().toISOString().split('T')[0];
  const isToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0];
  const isInRange = (dateStr) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
  };
  const isCheckIn = (dateStr) => dateStr === selectedCheckIn;
  const isCheckOut = (dateStr) => dateStr === selectedCheckOut;

  const handleDayClick = (dateStr, dayData) => {
    if (isPast(dateStr)) return;
    if (!dayData.available) return;
    if (onDateSelect) onDateSelect(dateStr);
  };

  const prevMonth = () => {
    const today = new Date();
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const months = [0, 1].map(offset => {
    const m = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset);
    return {
      label: m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days: getDaysInMonth(m.getFullYear(), m.getMonth())
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <span className="ml-2 text-stone-500">Loading availability...</span>
      </div>
    );
  }

  const retry = () => {
    const cacheKey = listingId || propertyName;
    delete calendarCache[cacheKey];
    setError(null);
    setLoading(true);
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
      .toISOString().split('T')[0];
    base44.functions.invoke('getCalendar', {
      listingId: listingId || null,
      propertyName: propertyName || null,
      startDate,
      endDate
    }).then(response => {
      const data = response.data;
      if (data.success && data.calendar && Object.keys(data.calendar).length > 0) {
        setCalendar(data.calendar);
        calendarCache[cacheKey] = { data: data.calendar, timestamp: Date.now() };
      } else {
        setError(data.error || 'No availability data found');
      }
    }).catch(() => {
      setError('Failed to connect to calendar service. Please try again.');
    }).finally(() => setLoading(false));
  };

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg p-4">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 mb-2 font-medium">{error}</p>
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (Object.keys(calendar).length === 0) {
    return (
      <div className="text-center py-8 bg-amber-50 rounded-lg p-4">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-700 mb-2">No calendar data available</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="availability-calendar">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 border border-stone-300 rounded-full hover:bg-stone-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium text-stone-700">
          {months[0].label} — {months[1].label}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 border border-stone-300 rounded-full hover:bg-stone-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {months.map((month, idx) => (
          <div key={idx}>
            <h4 className="text-center font-semibold text-stone-800 mb-3">
              {month.label}
            </h4>

            <div className="grid grid-cols-7 text-center text-xs text-stone-500 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <span key={d} className="py-1 font-medium">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {month.days.map((day, i) => {
                if (!day) {
                  return <div key={i} className="aspect-square" />;
                }

                const past = isPast(day.date);
                const today = isToday(day.date);
                const available = day.available && !past;
                const inRange = isInRange(day.date);
                const checkIn = isCheckIn(day.date);
                const checkOut = isCheckOut(day.date);

                let bgClass = '';
                let textClass = 'text-stone-700';
                let cursor = 'cursor-pointer';

                if (checkIn || checkOut) {
                  bgClass = 'bg-amber-600';
                  textClass = 'text-white';
                } else if (inRange) {
                  bgClass = 'bg-amber-100';
                } else if (past) {
                  bgClass = 'bg-stone-100';
                  textClass = 'text-stone-400';
                  cursor = 'cursor-not-allowed';
                } else if (available) {
                  bgClass = 'bg-green-50 hover:bg-green-100';
                } else {
                  bgClass = 'bg-red-50';
                  textClass = 'text-stone-400 line-through';
                  cursor = 'cursor-not-allowed';
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleDayClick(day.date, day)}
                    className={`
                      aspect-square flex flex-col items-center justify-center text-sm rounded-lg
                      ${bgClass} ${textClass} ${cursor}
                      ${today && !checkIn && !checkOut ? 'ring-2 ring-amber-400' : ''}
                    `}
                  >
                    <span className="font-medium">{day.day}</span>
                    {available && day.price > 0 && !checkIn && !checkOut && (
                      <span className="text-[10px] text-stone-500">${day.price}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-stone-600 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-100 rounded" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-100 rounded" /> Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-amber-600 rounded" /> Selected
        </span>
      </div>
    </div>
  );
}