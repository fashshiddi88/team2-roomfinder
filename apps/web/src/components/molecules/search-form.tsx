"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeTabs from "../atomics/property-type-tabs";

interface SearchFormProps {
  cities: string[];
  propertyTypes: string[];
}

export default function SearchForm({ cities, propertyTypes }: SearchFormProps) {
  const [selectedTab, setSelectedTab] = useState("Rooms");
  const [selectedCity, setSelectedCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <div className="w-full max-w-6xl px-4 mx-auto -mt-16 z-10 relative">
      <Card className="shadow-lg">
        <CardContent>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">FIND</h2>

            <PropertyTypeTabs
              propertyTypes={propertyTypes}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Location Dropdown */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select your destination</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Check In Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check In
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Check Out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check Out
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <div className="relative">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full p-3 rounded-lg">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
