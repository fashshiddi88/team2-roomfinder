import axios from 'axios';
import { prisma } from '@/prisma/client';
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

    console.log(`[Webhook] Booking ${order_id} updated to ${newStatus}`);
  }
}
