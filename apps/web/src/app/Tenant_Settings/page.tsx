'use client';

import React, { useState } from 'react';
import TenantNavbar from '@/app/Tenant_Navbar/page';

export default function TenantSettingsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic untuk submit settings update
    console.log('Submitted:', form);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <TenantNavbar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2 mt-1"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded p-2 mt-1"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded p-2 mt-1"
              value={form.phone}
              onChange={handleChange}
              placeholder="+62..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
