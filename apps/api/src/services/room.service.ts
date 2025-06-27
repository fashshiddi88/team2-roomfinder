import { prisma } from '@/prisma/client';

export class RoomService {
  async createRoom(
    userId: number,
    propertyId: number,
    data: {
      name: string;
      description?: string;
      qty: number;
      basePrice: number;
      capacity: number;
    },
    image: Express.Multer.File,
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');
    // Validasi: Property harus milik tenant
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId: tenant?.id,
        deletedAt: null,
      },
    });
    if (!property) throw new Error('Property not found or access denied');

    // Simpan room ke database
    const room = await prisma.room.create({
      data: {
        propertyId,
        name: data.name,
        description: data.description,
        qty: data.qty,
        basePrice: data.basePrice,
        capacity: data.capacity,
        image: image.path,
      },
    });

    return room;
  }

  async updateRoom(
    roomId: number,
    userId: number,
    data: {
      name?: string;
      description?: string;
      qty?: number;
      basePrice?: number;
      capacity?: number;
    },
    image?: Express.Multer.File,
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

    if (!room) throw new Error('Room not found or access denied');

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        name:
          data.name !== undefined && data.name.trim() !== ''
            ? data.name
            : room.name,
        description:
          data.description !== undefined && data.description.trim() !== ''
            ? data.description
            : room.description,
        qty: data.qty !== undefined ? data.qty : room.qty,
        basePrice:
          data.basePrice !== undefined ? data.basePrice : room.basePrice,
        capacity: data.capacity !== undefined ? data.capacity : room.capacity,
        image: image?.path ?? room.image,
      },
    });

    return updated;
  }

  async softDeleteRoom(roomId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          tenantId: tenant.id,
        },
        deletedAt: null,
      },
    });

    if (!room) throw new Error('Room not found or access denied');

    await prisma.room.update({
      where: { id: roomId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Room successfully soft-deleted' };
  }

  async hardDeleteRoom(roomId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          tenantId: tenant.id,
        },
      },
      select: { id: true },
    });

    if (!room) throw new Error('Room not found or access denied');

    await prisma.room.delete({
      where: { id: roomId },
    });

    return { message: 'Room permanently deleted' };
  }

  async restoreRoom(roomId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        property: {
          tenantId: tenant.id,
        },
        deletedAt: { not: null },
      },
    });

    if (!room) throw new Error('Room not found or not eligible for restore');

    await prisma.room.update({
      where: { id: roomId },
      data: { deletedAt: null },
    });

    return { message: 'Room successfully restored' };
  }

  async getTenantRoom(userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    return prisma.room.findMany({
      where: {
        deletedAt: null,
        property: {
          tenantId: tenant.id,
        },
      },
      include: {
        availabilities: true,
        peakRates: true,
        property: true,
      },
    });
  }
}
