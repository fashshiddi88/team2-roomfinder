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
}
