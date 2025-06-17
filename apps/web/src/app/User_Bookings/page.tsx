'use client';

// Update the import path to match the actual file name and casing
// Update the import path to match the actual file name and casing
import SideNavbar from '@/app/User_Navbar/page'; 

export default function BookingsPage() {
  const bookings = [
    { id: 1, property: "Villa Serenity", location: "Bali", date: "2025-07-01 to 2025-07-05", guests: 2, status: "Confirmed" },
    { id: 2, property: "Urban Loft", location: "Jakarta", date: "2025-07-10 to 2025-07-12", guests: 1, status: "Pending" },
    { id: 3, property: "Mountain Retreat", location: "Bandung", date: "2025-08-01 to 2025-08-03", guests: 4, status: "Cancelled" }
  ];

  return (
    <div className="flex">
      <SideNavbar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        <ul className="space-y-4">
          {bookings.map(b => (
            <li key={b.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold">{b.property} - {b.location}</h2>
              <p className="text-sm text-gray-600">Date: {b.date}</p>
              <p className="text-sm text-gray-600">Guests: {b.guests}</p>
              <p className={`text-sm font-semibold ${b.status === "Confirmed" ? "text-green-600" : b.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                Status: {b.status}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
