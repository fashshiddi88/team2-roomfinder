import { prisma } from '@/prisma/client';

export class WishlistService {
  public async toggleWishlist(userId: number, propertyId: number) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: {
          userId_propertyId: { userId, propertyId },
        },
      });
      return { message: 'Property removed from wishlist', isWishlisted: false };
    } else {
      await prisma.wishlist.create({
        data: { userId, propertyId },
      });
      return { message: 'Property added to wishlist', isWishlisted: true };
    }
  }

  public async getUserWishlist(userId: number) {
    const wishlisted = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            city: true,
            PropertyImages: {
              take: 1, // Ambil hanya 1 gambar utama
            },
            rooms: {
              take: 1, // Ambil 1 kamar untuk ambil harga
              select: {
                basePrice: true,
              },
            },
          },
        },
      },
    });

    return wishlisted.map((w) => {
      const property = w.property;
      return {
        id: property.id,
        name: property.name,
        city: property.city,
        price: property.rooms?.[0]?.basePrice ?? 0,
        mainImage: property.PropertyImages?.[0]?.url ?? '/default.jpg',
      };
    });
  }
}
