import { prisma } from '@/prisma/client';

export async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;

  // cari atau buat record counter hari ini
  const result = await prisma.dailyOrderCounter.upsert({
    where: {
      date: new Date(yyyy, today.getMonth(), today.getDate()), // reset jam ke 00:00:00
    },
    update: {
      counter: {
        increment: 1,
      },
    },
    create: {
      date: new Date(yyyy, today.getMonth(), today.getDate()),
      counter: 1,
    },
  });

  const orderNumber = `INV-${datePart}-${String(result.counter).padStart(4, '0')}`;
  return orderNumber;
}
