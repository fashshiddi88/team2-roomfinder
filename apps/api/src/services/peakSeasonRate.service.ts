import { prisma } from '@/prisma/client';

export class PeakSeasonRateService {
  async setPeakSeasonRate(
    userId: number,
    roomId: number,
    startDate: Date,
    endDate: Date,
    priceModifierType: 'PERCENTAGE' | 'NOMINAL',
    priceModifierValue: number,
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: { tenantId: tenant.id },
      },
    });
    if (!room) throw new Error('Room not found or access denied');

    return await prisma.peakSeasonRate.create({
      data: {
        roomId,
        startDate,
        endDate,
        priceModifierType,
        priceModifierValue,
      },
    });
  }

  async getPeakSeasonsByRoomId(
    roomId: number,
    userId: number,
    page = 1,
    limit = 10,
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          tenantId: tenant.id,
        },
      },
    });

    if (!room) {
      throw new Error('Room not found or access denied');
    }

    const [total, peakSeasons] = await prisma.$transaction([
      prisma.peakSeasonRate.count({ where: { roomId } }),
      prisma.peakSeasonRate.findMany({
        where: { roomId },
        orderBy: { startDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: peakSeasons,
    };
  }
}
