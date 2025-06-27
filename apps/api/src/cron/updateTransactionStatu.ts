import { prisma } from '@/prisma/client';
import { BookingStatus } from '@prisma/client';
import { restoreResources } from '@/lib/utils/restoreResource';

export async function updateTransactionStatuses() {
  const now = new Date();

  // EXPIRED jika lewat 2 jam tanpa bayar
  const expiredTransactions = await prisma.booking.findMany({
    where: {
      status: BookingStatus.WAITING_PAYMENT,
      expiredAt: { lt: now },
    },
  });

  for (const trx of expiredTransactions) {
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: trx.id },
        data: { status: BookingStatus.EXPIRED },
      });

      await restoreResources(tx, trx);
    });
  }

  // CANCELLED jika tidak dikonfirmasi dalam 3 hari
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const staleTransactions = await prisma.booking.findMany({
    where: {
      status: BookingStatus.WAITING_CONFIRMATION,
      createdAt: { lt: threeDaysAgo },
    },
  });

  for (const trx of staleTransactions) {
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: trx.id },
        data: { status: BookingStatus.CANCELED },
      });

      await restoreResources(tx, trx);
    });
  }
}
