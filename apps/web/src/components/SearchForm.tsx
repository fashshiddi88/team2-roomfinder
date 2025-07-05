'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { getAllCities } from '@/lib/api/axios';
import { toast } from 'sonner';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';

export default function SearchForm() {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getAllCities();
        setCities(data);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat data kota');
      }
    };
    fetchCities();
  }, []);

  function toISOStringWithOffset(date: Date) {
    const adjusted = new Date(date);
    adjusted.setHours(12, 0, 0, 0);
    return adjusted.toISOString();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate || !selectedCityId) return;

    router.push(
      `/Explore?cityId=${selectedCityId}&checkIn=${toISOStringWithOffset(checkInDate)}&checkOut=${toISOStringWithOffset(checkOutDate)}&guests=${guests}`,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Destination */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <select
            id="cityId"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div className="w-full">
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
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Check-out */}
        <div className="w-full">
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
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Guests */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <div className="flex h-12 items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
              className="w-10 h-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              id="guests"
              value={guests}
              readOnly
              className="w-full h-full text-center outline-none"
              min="1"
              max="10"
            />
            <button
              type="button"
              onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
              className="w-10 h-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Cari
        </button>
      </div>
    </form>
  );
}
