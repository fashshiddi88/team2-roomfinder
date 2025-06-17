// src/components/SearchForm.js
'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function SearchForm() {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  
  const cities = [
    "Jakarta", "Bali", "Bandung", "Yogyakarta", "Surabaya",
    "Lombok", "Medan", "Makassar", "Semarang", "Palembang"
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic pencarian akan diimplementasi kemudian
    console.log({
      destination,
      checkInDate,
      checkOutDate,
      guests
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="relative">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <select
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={new Date()}
            placeholderText="Choose Date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate || new Date()}
            placeholderText="Choose Date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Guests */}
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guest
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setGuests(prev => Math.max(1, prev - 1))}
              className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              id="guests"
              value={guests}
              readOnly
              className="w-full px-4 py-3 text-center focus:outline-none"
              min="1"
              max="10"
            />
            <button
              type="button"
              onClick={() => setGuests(prev => Math.min(10, prev + 1))}
              className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Find a Stay
        </button>
      </div>
    </form>
  );
}