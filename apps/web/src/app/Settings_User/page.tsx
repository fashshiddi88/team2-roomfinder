'use client';
import SideNavbar from '@/app/User_Navbar/page';
import { useState } from 'react';

export default function SettingsPage() {
    const [emailNotif, setEmailNotif] = useState(true);

    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            {/* Profile Info */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Profile Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" defaultValue="Alex Morgan" className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" defaultValue="alex@example.com" className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input type="tel" defaultValue="+628123456789" className="w-full border rounded p-2" />
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </section>

            {/* Change Password */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Change Password</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input type="password" className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input type="password" className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input type="password" className="w-full border rounded p-2" />
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Update Password
                    </button>
                </div>
            </section>

            {/* Notifications */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Notifications</h2>
                <label className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={emailNotif}
                        onChange={() => setEmailNotif(!emailNotif)}
                        className="w-5 h-5"
                    />
                    <span className="text-gray-700">Receive booking updates via email</span>
                </label>
            </section>

            {/* Delete Account */}
            <section className="mt-10 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                <button className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition">
                    Delete Account
                </button>
            </section>
        </div>
    );
}

