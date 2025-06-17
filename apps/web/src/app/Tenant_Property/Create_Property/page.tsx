'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '@/app/Tenant_Navbar/page';

export default function TenantAddPropertyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    price: '',
    status: 'Available',
    image: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana
    if (!form.name || !form.category || !form.price) {
      alert('Please fill out required fields');
      return;
    }

    // Kirim data (sementara log saja)
    console.log('Property Data:', form);

    // Redirect (atau tampilkan notifikasi)
    router.push('/Tenant_Property');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <main className="flex-1 px-8 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Add New Property</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Property Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Price per Night (Rp)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border p-2 rounded"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Add Property
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
