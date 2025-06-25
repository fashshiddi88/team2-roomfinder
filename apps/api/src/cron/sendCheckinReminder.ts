import { prisma } from '@/prisma/client';
import { sendMail } from '@/lib/nodemailer.config';

export async function sendCheckinReminders(): Promise<void> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      checkinDate: {
        gte: tomorrow,
        lt: nextDay,
      },
      status: 'CONFIRMED',
    },
    include: {
      user: true,
      room: {
        include: {
          property: true,
        },
      },
    },
  });

  for (const booking of bookings) {
    await sendMail({
      to: booking.user.email,
      subject: 'Reminder Check-in Besok!',
      html: `
        <p>Halo Mr/Mrs ${booking.user.name},</p>
        <p>Ini adalah pengingat bahwa Anda memiliki jadwal check-in besok di properti <strong>${booking.room.property.name}</strong>.</p>

        <h3>📄 Detail Pemesanan</h3>
        <ul>
          <li><strong>Nomor Pesanan:</strong> ${booking.orderNumber}</li>
          <li><strong>Nama Properti:</strong> ${booking.room.property.name}</li>
          <li><strong>Kamar:</strong> ${booking.room.name}</li>
          <li><strong>Check-in:</strong> ${booking.checkinDate.toDateString()}</li>
          <li><strong>Check-out:</strong> ${booking.checkoutDate.toDateString()}</li>
        </ul>

        <p>Pastikan Anda membawa identitas diri dan mengikuti aturan yang berlaku. Kami menantikan kedatangan Anda!</p>
        <p>Terima kasih,<br />Tim RoomFinder</p>
        `,
    });
  }
}
