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
}
