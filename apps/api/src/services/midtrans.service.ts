import axios from 'axios';
import { prisma } from '@/prisma/client';
import { sendMail } from '@/lib/nodemailer.config';
import { BookingStatus } from '@prisma/client';
import { SnapRequest } from '@/models/interface';

export class MidtransService {
  private readonly serverKey: string;
  private readonly baseSnap: string;

  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY as string;
    this.baseSnap = process.env.MIDTRANS_SNAP_DEVELOPMENT as string;
  }

  private getAuthHeader(): string {
    const encoded = Buffer.from(`${this.serverKey}:`).toString('base64');
    return `Basic ${encoded}`;
  }

  async createSnapTransaction(payload: SnapRequest): Promise<string> {
    try {
      const response = await axios.post(this.baseSnap, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
      });

      return response.data.redirect_url;
    } catch (error: any) {
      console.error('[Midtrans Error]', error.response?.data || error.message);
      throw new Error('Failed to create Midtrans transaction');
    }
  }

  async confirmMidtransPayment(orderId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        '[Midtrans Confirm Error]',
        error.response?.data || error.message,
      );
      throw new Error('Failed to confirm Midtrans payment');
    }
  }

  async handleWebhook(payload: any): Promise<void> {
    const { order_id, transaction_status, fraud_status } = payload;

    // Cari booking berdasarkan order_id
    const booking = await prisma.booking.findUnique({
      where: { orderNumber: order_id },
      include: {
        room: true,
        user: true,
        property: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Skip jika status bukan GATEWAY
    if (booking.bookingType !== 'GATEWAY') {
      throw new Error('Invalid booking type for gateway payment');
    }

    // Update status booking berdasarkan status Midtrans
    let newStatus: BookingStatus | null = null;

    switch (transaction_status) {
      case 'settlement':
      case 'capture':
        if (fraud_status && fraud_status !== 'accept') return;
        newStatus = BookingStatus.CONFIRMED;
        break;
      case 'cancel':
      case 'deny':
      case 'expire':
        newStatus = BookingStatus.CANCELED;
        break;
      case 'pending':
        newStatus = BookingStatus.WAITING_PAYMENT;
        break;
      default:
        console.log(
          `[Webhook] Unknown transaction_status: ${transaction_status}`,
        );
        return;
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: newStatus,
        confirmedAt:
          newStatus === BookingStatus.CONFIRMED ? new Date() : undefined,
      },
    });

    if (newStatus === BookingStatus.CONFIRMED) {
      await sendMail({
        to: booking.user.email,
        subject: 'Pembayaran Anda Telah Dikonfirmasi',
        html: `
        <p>Halo Mr/Mrs ${booking.user.name},</p>

<p>Terima kasih telah melakukan pemesanan di platform kami. Berikut adalah detail pemesanan Anda:</p>

<h3> Detail Pemesanan</h3>
<ul>
  <li><strong>Nomor Pesanan:</strong> ${booking.orderNumber}</li>
  <li><strong>Nama Properti:</strong> ${booking.property.name}</li>
  <li><strong>Kamar:</strong> ${booking.room.name}</li>
  <li><strong>Tanggal Check-in:</strong> ${booking.checkinDate}</li>
  <li><strong>Tanggal Check-out:</strong> ${booking.checkoutDate}</li>
  <li><strong>Total Harga:</strong> Rp${booking.totalPrice}</li>
</ul>

<h3> Tata Cara Penggunaan Properti</h3>
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
    } else if (newStatus === BookingStatus.CANCELED) {
      await sendMail({
        to: booking.user.email,
        subject: 'Pembayaran Anda Ditolak',
        html: `
        <p>Halo Mr/Mrs ${booking.user.name},</p>
        <p>Mohon maaf, bukti pembayaran Anda untuk pesanan <strong>${booking.orderNumber}</strong> telah <strong>ditolak atau dibatalkan</strong>.</p>
        <p>Silakan lakukan pemesanan ulang atau hubungi support kami.</p>
      `,
      });
    }

    console.log(`[Webhook] Booking ${order_id} updated to ${newStatus}`);
  }
}
