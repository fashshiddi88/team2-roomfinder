import { Request, Response } from 'express';
import { BookingService } from '@/services/booking.service';
import { BookingStatus } from '@prisma/client';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  async createBooking(req: Request, res: Response) {
    try {
      console.log('USER from token:', (req as any).user);
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: user ID not found' });
      }

      const { propertyId, roomId, startDate, endDate, bookingType, name } =
        req.body;

      if (!propertyId || !roomId || !startDate || !endDate || !bookingType) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      const booking = await this.bookingService.createBooking({
        userId,
        propertyId: Number(propertyId),
        roomId: Number(roomId),
        checkinDate: new Date(startDate),
        checkoutDate: new Date(endDate),
        bookingType,
        name,
      });

      return res.status(201).json({
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async uploadPaymentProof(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const bookingId = Number(req.params.id);
      const userId = (req as any).user?.userId;
      const file = (req as any).file as Express.Multer.File;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await this.bookingService.uploadPaymentProof({
        bookingId,
        userId,
        fileUrl: file.path,
      });

      return res.status(200).json({
        message: 'Payment proof uploaded successfully',
        detail: result,
      });
    } catch (error: any) {
      console.error('Upload payment proof error:', error);
      return res.status(500).json({
        message: 'Failed to upload payment proof',
        detail: error.message,
      });
    }
  }

  async getUserBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: user not found' });
      }

      const { status, orderNumber, date } = req.query;

      const bookings = await this.bookingService.getUserBookings(userId, {
        status: status as BookingStatus,
        orderNumber: orderNumber as string,
        date: date as string,
      });

      return res.status(200).json({
        message: 'Bookings fetched successfully',
        data: bookings,
      });
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  public async cancelBookingByUser(req: Request, res: Response) {
    try {
      const bookingId = Number(req.params.id);
      const userId = (req as any).user?.userId;

      if (!bookingId || !userId) {
        return res
          .status(400)
          .json({ message: 'Missing booking ID or user ID' });
      }

      const result = await this.bookingService.cancelBookingByUser(
        bookingId,
        userId,
      );

      return res.status(200).json({
        message: 'Booking canceled successfully',
        detail: result,
      });
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      return res.status(500).json({ message: error.message });
    }
  }
}
