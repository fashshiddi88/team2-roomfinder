'use client';

import { useEffect, useState } from 'react';
import SideNavbar from '@/app/User_Navbar/page';
import { getProfileUser, updateUserProfile } from '@/lib/api/axios';


export default function SettingsPage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch profile and update state
    const refreshProfile = async () => {
        setLoading(true);
        try {
            const res = await getProfileUser();
            setUser({
                name: res.detail.name || '',
                email: res.detail.email || '',
                phone: res.detail.phone || '',
            });
        } catch (err) {
            console.error('Failed to refresh profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('email', user.email);
            formData.append('phone', user.phone);
            await updateUserProfile(formData);

            await refreshProfile();
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            {/* Profile Info */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Profile Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={user.phone}
                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                            className="w-full border rounded p-2"
                        />
                    </div> */}
                    <button
                        onClick={handleSave}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </section>

            {/* Password */}
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
                    <input type="checkbox" className="w-5 h-5" />
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
