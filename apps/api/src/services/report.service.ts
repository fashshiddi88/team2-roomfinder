import { prisma } from '@/prisma/client';

export class ReportService {
  public async getSalesReport({
    tenantId,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    tenantId: number;
    startDate?: string;
    endDate?: string;
    sortBy?: 'createdAt' | 'totalPrice';
    sortOrder?: 'asc' | 'desc';
  }) {
    const tenant = await prisma.tenant.findUnique({
      where: { userId: tenantId },
    });
    if (!tenant) throw new Error('Tenant not found');

    const filters: any = {
      property: {
        tenantId: tenant.id,
      },
      status: 'CONFIRMED',
    };

    if (startDate && endDate) {
      filters.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await prisma.booking.findMany({
      where: filters,
      include: {
        property: true,
        user: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return bookings.map((b) => ({
      orderNumber: b.orderNumber,
      user: b.user.name,
      property: b.property.name,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt,
    }));
  }

  public async getPropertyReport({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
  }) {
    const tenant = await prisma.tenant.findUnique({
      where: { userId }, // userId dari token
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const tenantId = tenant.id;
    const properties = await prisma.property.findMany({
      where: { tenantId: tenant.id },
      include: {
        rooms: {
          include: {
            availabilities: {
              where: {
                date: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
            },
          },
        },
      },
    });

    const result = properties.map((property) => ({
      propertyId: property.id,
      propertyName: property.name,
      rooms: property.rooms.map((room) => {
        const availabilityMap = new Map<string, number>();
        for (const avail of room.availabilities) {
          availabilityMap.set(
            avail.date.toISOString().split('T')[0],
            avail.available,
          );
        }

        // Buat array tanggal
        const dates: string[] = [];
        let cursor = new Date(startDate);
        const end = new Date(endDate);
        while (cursor <= end) {
          const dateStr = cursor.toISOString().split('T')[0];
          dates.push(dateStr);
          cursor.setDate(cursor.getDate() + 1);
        }

        return {
          roomId: room.id,
          roomName: room.name,
          availability: dates.map((date) => ({
            date,
            available: availabilityMap.get(date) ?? room.qty,
          })),
        };
      }),
    }));

    return result;
  }

  async getMonthlyIncomeReport(userId: number, year?: number, month?: number) {
    const tenant = await prisma.tenant.findUnique({
      where: { userId }, // userId dari token
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const tenantId = tenant.id;
    const today = new Date();

    const targetYear = year ?? today.getFullYear();
    const targetMonth = month ?? today.getMonth() + 1; // getMonth() => 0-based

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const properties = await prisma.property.findMany({
      where: { tenantId },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    if (propertyIds.length === 0) return { totalIncome: 0, bookings: [] };

    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
        status: 'CONFIRMED',
        checkinDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        orderNumber: true,
        totalPrice: true,
        checkinDate: true,
        checkoutDate: true,
        user: { select: { name: true, email: true } },
        room: { select: { name: true } },
      },
    });

    const totalIncome = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalIncome,
      bookings,
      month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
    };
  }
}
