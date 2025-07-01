'use client';

import { ChangeEvent } from 'react';

type Props = {
  propertyName: string;
  propertyLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  setCheckIn: (value: string) => void;
  setCheckOut: (value: string) => void;
  setGuests: (value: number) => void;
  onCheckAvailability: (
    checkIn: string,
    checkOut: string,
    guests: number,
  ) => void;
};

export default function StickySearchBar({
  propertyName,
  propertyLocation,
  checkIn,
  checkOut,
  guests,
  setCheckIn,
  setCheckOut,
  setGuests,
  onCheckAvailability,
}: Props) {
  return (
    <div className="bg-white shadow sticky top-0 z-50 border-b">
      <div className="max-w-screen-xl mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-[1fr_180px_180px_200px_auto] gap-4 items-end">
        <div>
          <h2 className="text-lg font-semibold">{propertyName}</h2>
          <p className="text-sm text-gray-500">{propertyLocation}</p>
        </div>

        <div>
          <label className="text-xs text-gray-500">Check‑In</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCheckIn(e.target.value)
            }
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Check‑Out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCheckOut(e.target.value)
            }
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Guest
          </label>
          <div className="flex items-center h-7 border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              id="guests"
              value={guests}
              readOnly
              className="w-full px-4 text-center focus:outline-none"
              min="1"
              max="10"
            />
            <button
              type="button"
              onClick={() => setGuests(Math.min(10, guests + 1))}
              className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            if (!checkIn || !checkOut || guests === 0) {
              alert('Please select dates and guests');
            } else {
              onCheckAvailability(checkIn, checkOut, guests);
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          Check Availability
        </button>
      </div>
    </div>
  );
}
