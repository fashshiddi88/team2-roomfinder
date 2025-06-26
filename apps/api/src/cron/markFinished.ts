import { prisma } from '@/prisma/client';
import { BookingStatus } from '@prisma/client';

export async function markFinishedBookings() {
  const now = new Date();

  const bookingsToUpdate = await prisma.booking.findMany({
    where: {
      status: BookingStatus.CONFIRMED,
      checkoutDate: { lt: now },
    },
  });

  for (const booking of bookingsToUpdate) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.DONE },
    });
  }
}
