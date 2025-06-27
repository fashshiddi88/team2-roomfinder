import { prisma } from '@/prisma/client';

export class WishlistService {
  public async toggleWishlist(userId: number, propertyId: number) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (existing) {
      // Jika sudah ada, berarti user ingin menghapus dari wishlist
      await prisma.wishlist.delete({
        where: {
          userId_propertyId: { userId, propertyId },
        },
      });
      return { message: 'Property removed from wishlist', isWishlisted: false };
    } else {
      // Jika belum ada, berarti user ingin menambahkan ke wishlist
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
            city: true, // opsional, jika ingin detail lokasi
          },
        },
      },
    });
    return wishlisted.map((w) => w.property);
  }
}
