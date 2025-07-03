import axios from 'axios';
import { BookingTypeEnum } from '@/types/property';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export async function loginUser(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data.data;
}

export async function registerUser(email: string) {
  const response = await api.post('/api/register-user', { email });
  return response.data;
}

interface CreateTenantPayload {
  email: string;
  companyName: string;
}

export async function registerTenant(data: CreateTenantPayload) {
  const res = await api.post('/api/register-tenant', data);
  return res.data;
}

export async function registerSetPassword(token: string, password: string) {
  const response = await api.post('/api/users/verify', { token, password });
  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post(`/api/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string) {
  console.log(token, newPassword);
  const response = await api.post(`/api/auth/reset-password`, {
    token,
    newPassword,
  });

  return response.data;
}

export async function getProfileUser() {
  const response = await api.get('/api/profile');
  return response.data;
}

export async function getProfileTenant() {
  const response = await api.get('/api/profile/tenant');
  return response.data;
}

export async function getTenantProperties() {
  const response = await api.get('/api/property/my-properties');
  return response.data;
}

export async function getAllPropertyCategories() {
  const response = await api.get('/api/property-category/all');
  return response.data.data;
}

export async function getAllCities() {
  const response = await api.get('/api/cities');
  return response.data.data;
}

export async function createProperty(formData: FormData) {
  const response = await api.post('/api/property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function softDeleteProperty(id: number) {
  const response = await api.delete(`/api/property/${id}`);
  return response.data;
}

export async function restoreProperty(id: number) {
  const response = await api.patch(`/api/property/restore/${id}`);
  return response.data;
}

export async function hardDeleteProperty(id: number) {
  const response = await api.delete(`/api/property/hard-delete/${id}`);
  return response.data;
}

export async function updateProperty(
  id: number,
  form: {
    name?: string;
    categoryId?: string;
    description?: string;
    address?: string;
    cityId?: string;
  },
  mainImage?: File | null,
  galleryImages?: FileList | null,
) {
  const data = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, value);
    }
  });

  if (mainImage) {
    data.append('mainImage', mainImage);
  }

  if (galleryImages) {
    Array.from(galleryImages).forEach((file) => {
      data.append('galleryImages', file);
    });
  }

  const response = await api.put(`/api/property/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function getPropertyById(id: number | string) {
  const res = await api.get(`/api/property/${id}`);
  return res.data;
}

export async function getTenantRooms() {
  const response = await api.get('/api/property/my-rooms');
  return response.data;
}

export async function getRoomsByProperty(propertyId: number | string) {
  const res = await api.get(`/api/property/${propertyId}/rooms`);
  return res.data;
}

export async function createRoom(propertyId: number, formData: FormData) {
  const response = await api.post(
    `/api/property/${propertyId}/rooms`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

export async function updateRoom(
  propertyId: number,
  roomId: number,
  form: {
    name?: string;
    description?: string;
    qty?: number;
    basePrice?: number;
    capacity?: number;
  },
  image?: File | null,
) {
  const data = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, String(value));
    }
  });

  if (image) {
    data.append('image', image);
  }

  const response = await api.put(
    `/api/property/${propertyId}/room/${roomId}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}

export async function softDeleteRoom(propertyId: number, roomId: number) {
  const response = await api.delete(
    `/api/property/${propertyId}/room/${roomId}`,
  );
  return response.data;
}

export async function restoreRoom(propertyId: number, roomId: number) {
  const response = await api.patch(
    `/api/property/${propertyId}/room/restore/${roomId}`,
  );
  return response.data;
}

export async function hardDeleteRoom(propertyId: number, roomId: number) {
  const response = await api.delete(
    `/api/property/${propertyId}/room/${roomId}`,
  );
  return response.data;
}

export async function getPeakSeasonsByRoomId(
  roomId: number,
  page = 1,
  limit = 5,
) {
  const res = await api.get(`/api/property/rooms/${roomId}/peak-seasons`, {
    params: { page, limit },
  });
  return res.data;
}

export async function setPeakSeasonRate(
  roomId: number,
  payload: {
    startDate: string;
    endDate: string;
    priceModifierType: 'PERCENTAGE' | 'NOMINAL';
    priceModifierValue: number;
  },
) {
  const response = await api.post(`/api/room/${roomId}/peak-season`, payload);
  return response.data;
}

export async function getRoomById(id: number) {
  const res = await api.get(`/api/room/${id}`);
  return res.data;
}

type CatalogQuery = {
  search?: string;
  categoryId?: number;
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  capacity?: number;
  startDate?: Date;
  endDate?: Date;
};

export async function getCatalogProperties(query: CatalogQuery) {
  const params = new URLSearchParams();

  if (query.search) params.append('search', query.search);
  if (query.categoryId)
    params.append('categoryId', query.categoryId.toString());
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.sortOrder) params.append('sortOrder', query.sortOrder);
  if (query.page) params.append('page', query.page.toString());
  if (query.pageSize) params.append('pageSize', query.pageSize.toString());
  if (query.capacity) params.append('capacity', query.capacity.toString());
  if (query.startDate)
    params.append('startDate', query.startDate.toISOString());
  if (query.endDate) params.append('endDate', query.endDate.toISOString());

  const response = await api.get('/api/catalog', { params });

  return response.data;
}

export async function getPropertyDetail(
  propertyId: number,
  startDate?: Date,
  endDate?: Date,
) {
  const params = new URLSearchParams();

  if (startDate) {
    params.append('startDate', startDate.toISOString());
  }

  if (endDate) {
    params.append('endDate', endDate.toISOString());
  }

  const response = await api.get(
    `/api/property-detail/${propertyId}?${params.toString()}`,
  );
  return response.data.data;
}

type CreateBookingPayload = {
  propertyId: number;
  roomId: number;
  startDate: string;
  endDate: string;
  bookingType: BookingTypeEnum;
  name?: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  const response = await api.post('/api/bookings', payload);
  return response.data;
}

export async function getBookingById(bookingId: number) {
  const response = await api.get(`/api/bookings/${bookingId}`);
  return response.data.data; // hasil: object detail booking
}

export async function cancelBookingById(bookingId: number) {
  const response = await api.delete(`/api/bookings/${bookingId}/cancel`);
  return response.data;
}

export async function uploadPaymentProof(bookingId: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(
    `/api/bookings/${bookingId}/payment-proof`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}

export async function getTenantBookings({
  status,
  search,
  page = 1,
}: {
  status?: string;
  search?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (page) params.append('page', page.toString());

  const response = await api.get(
    `/api/dashboard/bookings/tenant?${params.toString()}`,
  );

  return response.data;
}

export async function acceptBookingByTenant(bookingId: number) {
  const response = await api.patch(
    `/api/dashboard/bookings/${bookingId}/accept`,
  );
  return response.data.detail;
}

export async function rejectBookingByTenant(bookingId: number) {
  const response = await api.patch(
    `/api/dashboard/bookings/${bookingId}/reject`,
  );
  return response.data.detail;
}

export const cancelBookingByTenant = async (bookingId: number) => {
  const response = await api.delete(
    `/api/dashboard/${bookingId}/cancel-by-tenant`,
  );
  return response.data;
};

export const updateUserProfile = async (formData: FormData) => {
  const response = await api.patch('/api/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export async function updateUserPassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  const response = await api.patch('/api/profile/password', {
    oldPassword,
    newPassword,
  });
  return response.data;
}
