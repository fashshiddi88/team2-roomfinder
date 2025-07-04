import { prisma } from '@/prisma/client';

export class RoomAvailabilityService {
  async setRoomAvailability(
    userId: number,
    roomId: number,

    date: string,
    available: number,
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    // Cek apakah room milik tenant
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: { tenantId: tenant.id },
      },
    });
    if (!room) throw new Error('Room not found or access denied');

    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Validasi nilai available
    if (available < 0) {
      throw new Error('Available count cannot be negative');
    }

    // Set atau update RoomAvailability
    const availability = await prisma.roomAvailability.upsert({
      where: {
        roomId_date: {
          roomId,
          date: normalizedDate,
        },
      },
      update: { available },
      create: {
        roomId,
        date: normalizedDate,
        available,
      },
    });

    return availability;
  }

  async getRoomAvailabilities(params: {
    userId: number;
    roomId: number;
    month?: string; // format 'YYYY-MM'
    page?: number;
    pageSize?: number;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      userId,
      roomId,
      month,
      page = 1,
      pageSize = 10,
      sortOrder = 'asc',
    } = params;

    // Pastikan tenant valid
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    // Pastikan room milik tenant
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          tenantId: tenant.id,
        },
      },
    });
    if (!room) throw new Error('Room not found or access denied');

    // Filter tanggal berdasarkan bulan (jika diberikan)
    let dateFilter = {};
    if (month) {
      const [year, monthStr] = month.split('-');
      const startDate = new Date(Number(year), Number(monthStr) - 1, 1);
      const endDate = new Date(Number(year), Number(monthStr), 0, 23, 59, 59);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // Hitung offset
    const skip = (page - 1) * pageSize;

    // Ambil data dengan filter, sort, dan pagination
    const [availabilities, total] = await Promise.all([
      prisma.roomAvailability.findMany({
        where: {
          roomId,
          ...dateFilter,
        },
        orderBy: {
          date: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.roomAvailability.count({
        where: {
          roomId,
          ...dateFilter,
        },
      }),
    ]);

    return {
      data: availabilities,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
