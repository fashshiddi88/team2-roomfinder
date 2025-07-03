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
      confirmButtonText: 'Ya, nonaktifkan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteProperty(id);
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, deletedAt: new Date() } : p))
        );
        toast.success('Properti berhasil dinonaktifkan.');
      } catch {
        toast.error('Gagal menonaktifkan properti.');
      }
    }
  };

  const handleUnarchive = async (id: number) => {
    const result = await Swal.fire({
      title: 'Aktifkan kembali properti ini?',
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
          prev.map((p) => (p.id === id ? { ...p, deletedAt: null } : p))
        );
        toast.success('Properti berhasil diaktifkan kembali.');
      } catch {
        toast.error('Gagal mengaktifkan kembali properti.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus permanen properti ini?',
      text: 'Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await hardDeleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
        toast.success('Properti berhasil dihapus.');
      } catch {
        toast.error('Gagal menghapus properti.');
      }
    }
  };

  return (
    <table className="w-full table-auto text-sm text-left text-gray-700">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4">Image</th>
          <th className="p-4">Name</th>
          <th className="p-4">Category</th>
          <th className="p-4">Status</th>
          <th className="p-4">Room</th>
          <th className="p-4 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {properties.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-500">
              No properties found.
            </td>
          </tr>
        ) : (
          properties.map((property) => (
            <tr key={property.id} className="border-b hover:bg-gray-50 h-24">
              <td className="p-4">
                <Image
                  src={property.image || '/urban_loft.jpg'}
                  alt={property.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </td>
              <td className="p-4 font-medium">{property.name}</td>
              <td className="p-4">{property.category?.name || '-'}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    property.deletedAt === null
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {property.deletedAt === null ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="p-4">
                <Link
                  href={`/Tenant_Property/Manage_Rooms/${property.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Manage
                </Link>
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-3 flex-wrap">
                  <Link
                    href={`/Tenant_Property/${property.id}`}
                    className="text-blue-600 hover:underline"
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
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    } hover:underline`}
                  >
                    {property.deletedAt ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
