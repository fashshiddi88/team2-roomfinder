import { prisma } from '@/prisma/client';
import { generateOrderNumber } from '@/lib/utils/generateOrderNumber';
import { BookingStatus } from '@prisma/client';
import { restoreResources } from '@/lib/utils/restoreResource';
import { SnapRequest, ItemDetails } from '@/models/interface';
import { MidtransService } from './midtrans.service';

export class BookingService {
  constructor(private midtransService: MidtransService) {}
  async createBooking(data: {
    userId: number;
    propertyId: number;
    roomId: number;
    checkinDate: Date;
    checkoutDate: Date;
    bookingType: 'MANUAL' | 'GATEWAY';
    name?: string;
  }) {
    const {
      userId,
      propertyId,
      roomId,
      checkinDate,
      checkoutDate,
      bookingType,
      name,
    } = data;

    // Hitung jumlah hari
    const days: Date[] = [];
    const current = new Date(checkinDate);
    while (current < checkoutDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    if (days.length === 0) {
      throw new Error('Durasi inap minimal 1 hari');
    }

    // Ambil room dan peakRates
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { peakRates: true },
    });

    if (!room) throw new Error('Room tidak ditemukan');

    // Hitung total price
    let totalPrice = 0;
    const pricePerDay: number[] = [];

    for (const day of days) {
      let price = room.basePrice;
      const peak = room.peakRates.find(
        (rate) => day >= rate.startDate && day <= rate.endDate,
      );

      if (peak) {
        price +=
          peak.priceModifierType === 'PERCENTAGE'
            ? (price * peak.priceModifierValue) / 100
            : peak.priceModifierValue;
      }

      totalPrice += price;
      pricePerDay.push(Math.round(price));
    }

    // Validasi dan update nama user jika kosong
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User tidak ditemukan');

    if (!user.name && !name) {
      throw new Error('Nama wajib diisi karena nama user belum tersedia');
    }

    if (!user.name && name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // Ambil semua data availability untuk tanggal yang dibooking
    const availabilities = await prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          in: days,
        },
      },
    });

    // Untuk setiap hari, cek apakah masih tersedia
    for (const day of days) {
      const availability = availabilities.find(
        (a) =>
          a.date.toISOString().slice(0, 10) === day.toISOString().slice(0, 10),
      );

      const available = availability ? availability.available : room.qty;

      if (available <= 0) {
        throw new Error(
          `Kamar tidak tersedia pada tanggal ${day.toISOString().slice(0, 10)}`,
        );
      }
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    const booking = await prisma.$transaction(async (tx) => {
      // Buat booking
      const createdBooking = await tx.booking.create({
        data: {
          userId,
          propertyId,
          roomId,
          orderNumber,
          checkinDate,
          checkoutDate,
          totalPrice: Math.round(totalPrice),
          status: BookingStatus.WAITING_PAYMENT,
          bookingType,
          expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        },
      });

      // Kurangi stok roomAvailability untuk tiap hari
      for (const day of days) {
        await tx.roomAvailability.upsert({
          where: {
            roomId_date: {
              roomId,
              date: day,
            },
          },
          update: {
            available: {
              decrement: 1,
            },
          },
          create: {
            roomId,
            date: day,
            available: room.qty - 1,
          },
        });
      }

      return createdBooking;
    });

    // 2. Jika GATEWAY
    let paymentUrl: string | undefined;

    function formatMidtransTime(date: Date): string {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
      const dd = String(date.getDate()).padStart(2, '0');
      const HH = String(date.getHours()).padStart(2, '0');
      const MM = String(date.getMinutes()).padStart(2, '0');
      const SS = String(date.getSeconds()).padStart(2, '0');

      // Asumsi lokal kamu +0700, bisa juga pakai Intl.DateTimeFormat kalau mau fleksibel
      return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS} +0700`;
    }

    const itemDetails: ItemDetails[] = days.map((day, index) => ({
      id: `${room.id}-${index}`,
      name: `Room ${room.name} - ${day.toISOString().split('T')[0]}`,
      price: pricePerDay[index],
      quantity: 1,
    }));
    const grossAmount = itemDetails.reduce((acc, item) => acc + item.price, 0);
    const startTime = formatMidtransTime(new Date());

    if (bookingType === 'GATEWAY') {
      const payload: SnapRequest = {
        transaction_details: {
          order_id: booking.orderNumber,
          gross_amount: grossAmount,
        },
        customer_details: {
          first_name: user.name || 'Guest',
          email: user.email,
        },
        item_details: itemDetails,
        expiry: {
          start_time: startTime,
          unit: 'minutes',
          duration: 120,
        },
      };

      paymentUrl = await this.midtransService.createSnapTransaction(payload);
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          expiredAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      });
    }

    return { booking, paymentUrl };
  }

  public async uploadPaymentProof({
    bookingId,
    userId,
    fileUrl,
  }: {
    bookingId: number;
    userId: number;
    fileUrl: string;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new Error('Booking not found or unauthorized');
    }

    if (booking.status !== BookingStatus.WAITING_PAYMENT) {
      throw new Error('Cannot upload payment proof in current booking status');
    }
    if (booking.expiredAt && booking.expiredAt < new Date()) {
      throw new Error('Booking already expired');
    }

    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentProof: fileUrl,
        status: BookingStatus.WAITING_CONFIRMATION,
        autoCanceledAt: threeDaysLater,
      },
    });

    return updated;
  }

  async getUserBookings(
    userId: number,
    query: {
      status?: BookingStatus;
      orderNumber?: string;
      date?: string;
    },
  ) {
    const { status, orderNumber, date } = query;

    const where: any = {
      userId,
      deleteAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (orderNumber) {
      where.orderNumber = {
        contains: orderNumber,
        mode: 'insensitive',
      };
    }

    if (date) {
      const target = new Date(date);
      const next = new Date(target);
      next.setDate(target.getDate() + 1);

      where.checkinDate = {
        gte: target,
        lt: next,
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: true,
        room: true,
      },
    });

    return bookings;
  }

  public async cancelBookingByUser(bookingId: number, userId: number) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new Error('Booking not found or unauthorized');
    }

    if (booking.status !== 'WAITING_PAYMENT') {
      throw new Error('Cannot cancel booking at current status');
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELED' },
      });

      await restoreResources(tx, booking);
    });

    return { message: 'Booking canceled successfully' };
  }

  public async getBookingById(id: number, userId: number) {
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        property: {
          select: {
            name: true,
            address: true,
            city: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error('Booking tidak ditemukan');
    }

    return {
      id: booking.id,
      reservationId: booking.orderNumber,
      checkInDate: booking.checkinDate,
      checkOutDate: booking.checkoutDate,
      totalPrice: booking.totalPrice,
      bookingType: booking.bookingType,
      status: booking.status,
      propertyName: booking.property.name,
      location: `${booking.property.address}, ${booking.property.city}`,
      roomName: booking.room.name,
      userName: booking.user.name,
      userEmail: booking.user.email,
    };
  }
}
