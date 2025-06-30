'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withAuthRoles } from '@/middleware/withAuthRoles';
import TenantSidebar from '../Tenant_Navbar/page';

const dummyProperties = [
  {
    id: 1,
    name: 'Villa Serenity',
    category: 'Villa',
    image: '/villa.jpg',
    status: 'Available',
  },
  {
    id: 2,
    name: 'Urban Loft',
    category: 'Apartment',
    image: '/urban_loft.jpg',
    status: 'Not Available',
  },
];

function TenantMyPropertyPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Properties</h1>
            <Link
              href="/Tenant_Property/Create_Property"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Property
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {dummyProperties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Image
                        src={property.image}
                        alt={property.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4 font-semibold">{property.name}</td>
                    <td className="p-4">{property.category}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          property.status === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Link
                        href={`/tenant/properties/edit/${property.id}`}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => alert(`Deleting ${property.name}`)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {dummyProperties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No properties found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
export default withAuthRoles(['TENANT'])(TenantMyPropertyPage);
