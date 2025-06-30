'use client';

import Image from 'next/image';
import {
  hardDeleteProperty,
  restoreProperty,
  softDeleteProperty,
} from '@/lib/api/axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import Link from 'next/link';
import { PropertyType } from '@/types/property';

type Props = {
  properties: PropertyType[];
  setProperties: React.Dispatch<React.SetStateAction<PropertyType[]>>;
};

export default function TenantPropertyTable({
  properties,
  setProperties,
}: Props) {
  const handleArchive = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menonaktifkan properti ini?',
      text: 'Properti akan ditandai sebagai tidak tersedia.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, nonaktifkan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteProperty(id);
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, deletedAt: new Date() } : p)),
        );
        toast.success('Property berhasil ditandai tidak tersedia');
      } catch {
        toast.error('Gagal menghapus property');
      }
    }
  };

  const handleUnarchive = async (id: number) => {
    const result = await Swal.fire({
      title: 'Buka arsip properti?',
      text: 'Properti akan tersedia kembali.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, tampilkan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await restoreProperty(id);
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)),
        );
        toast.success('Properti berhasil diaktifkan kembali.');
      } catch {
        toast.error('Gagal mengaktifkan kembali properti.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus properti ini?',
      text: 'Properti akan dihapus dari property anda.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await hardDeleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
        toast.success('Property berhasil dihapus');
      } catch {
        toast.error('Gagal menghapus property');
      }
    }
  };
  return (
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
        {properties.map((property) => (
          <tr key={property.id} className="border-b hover:bg-gray-50 h-24">
            <td className="p-4">
              <Image
                src={property.image || '/urban_loft.jpg'}
                alt={property.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </td>
            <td className="p-4 font-semibold">{property.name}</td>
            <td className="p-4">{property.category?.name || '-'}</td>
            <td className="p-4">
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  property.deletedAt === null
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {property.deletedAt === null ? 'Available' : 'Unavailable'}
              </span>
            </td>
            <td className="p-4 whitespace-nowrap">
              <Link
                href={`/Tenant_Property/${property.id}`}
                className="text-blue-600 hover:underline mr-4"
              >
                Edit
              </Link>
              <button
                onClick={() =>
                  property.deletedAt
                    ? handleUnarchive(property.id)
                    : handleArchive(property.id)
                }
                className={`${
                  property.deletedAt
                    ? 'text-green-600 hover:underline mr-4'
                    : 'text-yellow-600 hover:underline mr-4'
                }`}
              >
                {property.deletedAt ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {properties.length === 0 && (
          <tr>
            <td colSpan={5} className="p-4 text-center text-gray-500">
              No properties found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
