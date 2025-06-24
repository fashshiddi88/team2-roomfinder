import { Prisma, Booking } from '@prisma/client';

export async function restoreResources(
  tx: Prisma.TransactionClient,
  booking: Booking,
) {
  // 1. Hitung ulang semua tanggal inap
  const days: Date[] = [];
  const current = new Date(booking.checkinDate);
  while (current < booking.checkoutDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 2. Update kembali kuota room pada setiap tanggal di RoomAvailability
  for (const day of days) {
    const availability = await tx.roomAvailability.findUnique({
      where: {
        roomId_date: {
          roomId: booking.roomId,
          date: new Date(day),
        },
      },
    });

    if (availability) {
      // kembalikan slot available
      await tx.roomAvailability.update({
        where: {
          roomId_date: {
            roomId: booking.roomId,
            date: new Date(day),
          },
        },
        data: {
          available: availability.available + 1,
        },
      });
    } else {
      // kalau belum ada, buat baru dengan default 1 less than room.qty
      const room = await tx.room.findUnique({
        where: { id: booking.roomId },
      });
      if (room) {
        await tx.roomAvailability.create({
          data: {
            roomId: room.id,
            date: new Date(day),
            available: room.qty, // aslinya restore ke full capacity
          },
        });
      }
    }
  }
}
