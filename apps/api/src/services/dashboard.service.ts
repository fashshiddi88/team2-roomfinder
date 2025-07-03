import { prisma } from '@/prisma/client';
import { BookingStatus } from '@prisma/client';
import { sendMail } from '@/lib/nodemailer.config';

export class DashboardService {
  async getTenantBookings({
    userId,
    status,
  }: {
    userId: number;
    status?: BookingStatus;
  }) {
    const tenant = await prisma.tenant.findUnique({
      where: { userId },
    });

    if (!tenant) throw new Error('Unauthorized: tenant not found');

    const properties = await prisma.property.findMany({
      where: { tenantId: tenant.id },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
        ...(status ? { status } : {}),
      },
      include: {
        user: true,
        room: true,
        property: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings;
  }

  public async acceptBooking(bookingId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({
      where: { userId },
    });

    if (!tenant) {
      throw new Error('Unauthorized - Tenant not found');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        user: true,
        property: true,
      },
    });

    if (!booking) throw new Error('Booking not found');

    if (booking.property.tenantId !== tenant.id) {
      throw new Error('Unauthorized');
    }

    if (booking.status !== 'WAITING_CONFIRMATION') {
      throw new Error('Only bookings waiting for confirmation can be accepted');
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        autoCanceledAt: null,
        confirmedAt: new Date(),
      },
    });
    // Kirim email notifikasi
    await sendMail({
      to: booking.user.email,
      subject: 'Pembayaran Anda Telah Dikonfirmasi',
      html: `
      <p>Halo Mr/Mrs ${booking.user.name},</p>

<p>Terima kasih telah melakukan pemesanan di platform kami. Berikut adalah detail pemesanan Anda:</p>

<h3>Detail Pemesanan</h3>
<ul>
  <li><strong>Nomor Pesanan:</strong> ${booking.orderNumber}</li>
  <li><strong>Nama Properti:</strong> ${booking.property.name}</li>
  <li><strong>Kamar:</strong> ${booking.room.name}</li>
  <li><strong>Tanggal Check-in:</strong> ${booking.checkinDate}</li>
  <li><strong>Tanggal Check-out:</strong> ${booking.checkoutDate}</li>
  <li><strong>Total Harga:</strong> Rp${booking.totalPrice}</li>
</ul>

<h3>Tata Cara Penggunaan Properti</h3>
<ol>
  <li>Check-in dimulai pukul 14.00 WIB dan check-out maksimal pukul 12.00 WIB.</li>
  <li>Tunjukkan email ini atau ID pemesanan saat tiba di lokasi.</li>
  <li>Dilarang membawa hewan peliharaan tanpa izin terlebih dahulu.</li>
  <li>Dilarang merokok di dalam ruangan.</li>
  <li>Mohon jaga kebersihan dan ketertiban selama menginap.</li>
</ol>

<p>Jika Anda memiliki pertanyaan atau kendala, silakan hubungi tim support kami.</p>

<p>Selamat menginap!<br />
Tim RoomFinder</p>
    `,
    });
    return updated;
  }

  public async rejectBooking(bookingId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({
      where: { userId },
    });

    if (!tenant) {
      throw new Error('Unauthorized - Tenant not found');
    }

    // Ambil booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        user: true,
        property: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.property.tenantId !== tenant.id) {
      throw new Error('Unauthorized');
    }

    if (booking.status !== 'WAITING_CONFIRMATION') {
      throw new Error('Only bookings waiting for confirmation can be rejected');
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'WAITING_PAYMENT',
        paymentProof: null,
        autoCanceledAt: null,
      },
    });

    // Kirim email notifikasi ke user
    await sendMail({
      to: booking.user.email,
      subject: 'Pembayaran Anda Ditolak',
      html: `
      <p>Halo Mr/Mrs ${booking.user.name},</p>
      <p>Mohon maaf, bukti pembayaran Anda untuk pesanan <strong>${booking.orderNumber}</strong> telah <strong>ditolak</strong>.</p>
      <p>Silakan upload ulang bukti pembayaran yang valid.</p>
    `,
    });

    return updated;
  }

  public async cancelBookingByTenant(bookingId: number, tenantUserId: number) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!booking) throw new Error('Booking not found');

    // Pastikan booking milik tenant tersebut
    const tenant = await prisma.tenant.findUnique({
      where: { userId: tenantUserId },
    });

    if (!tenant || booking.room.property.tenantId !== tenant.id) {
      throw new Error('Unauthorized');
    }

    if (booking.status !== 'WAITING_PAYMENT') {
      throw new Error(
        'Only bookings with status WAITING_PAYMENT can be canceled',
      );
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELED',
      },
    });

    return { message: 'Booking has been canceled by tenant' };
  }
}
