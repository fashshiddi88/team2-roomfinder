'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '@/app/Tenant_Navbar/page';

export default function TenantAddPropertyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    address: '',
    cityId: '',
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (mainImage) {
      data.append('mainImage', mainImage);
    }

    if (galleryImages) {
      Array.from(galleryImages).forEach((file) => {
        data.append('galleryImages', file);
      });
    }

    try {
      const res = await fetch('http://localhost:8000/api/property', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Failed to submit');

      alert('Property created successfully!');
      router.push('/Tenant_Property');
    } catch (err) {
      alert('Failed to create property');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <main className="flex-1 px-8 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Add New Property</h2>

          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
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
              <label className="block font-medium mb-1">Category  *</label>
              <input
                type="text"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">City*</label>
              <input
                type="text"
                name="cityId"
                value={form.cityId}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
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

            <div>
              <label className="block font-medium mb-1">Main Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Gallery Images (multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryImages(e.target.files)}
                className="w-full"
              />
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
