import { prisma } from '@/prisma/client';

export class RoomAvailabilityService {
  async setRoomAvailability(
    userId: number,
    roomId: number,

    date: string,
    isAvailable: boolean,
  ) {
    // Pastikan tenant valid
    console.log('UserID from token:', userId);
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

    // Set atau update RoomAvailability
    const availability = await prisma.roomAvailability.upsert({
      where: {
        roomId_date: {
          roomId,
          date: new Date(date),
        },
      },
      update: { isAvailable },
      create: {
        roomId,
        date: new Date(date),
        isAvailable,
      },
    });

    return availability;
  }
}
