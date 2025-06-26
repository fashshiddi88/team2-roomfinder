import { prisma } from '@/prisma/client';
import { BookingStatus } from '@prisma/client';

export class ReviewService {
  async createReview({
    userId,
    bookingId,
    comment,
    rating,
  }: {
    userId: number;
    bookingId: number;
    comment: string;
    rating: number;
  }) {
    // Cek booking valid
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: { include: { property: true } } },
    });

    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status !== 'DONE')
      throw new Error('You can only review after checkout');

    const existing = await prisma.review.findFirst({
      where: { bookingId, userId },
    });
    if (existing) throw new Error('You have already reviewed this booking');

    const review = await prisma.review.create({
      data: {
        bookingId,
        userId,
        propertyId: booking.room.property.id,
        comment,
        rating,
      },
    });

    return review;
  }

  public async replyReview({
    reviewId,
    userId,
    tenantReply,
  }: {
    reviewId: number;
    userId: number;
    tenantReply: string;
  }) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: {
          include: {
            room: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }
    const tenantId = tenant?.id;

    // Validasi apakah tenant berhak membalas review ini
    if (review.booking.room.property.tenantId !== tenantId) {
      throw new Error('Unauthorized to reply this review');
    }

    if (review.tenantReply) {
      throw new Error('Review already has a reply');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { tenantReply },
    });

    return updated;
  }
}
