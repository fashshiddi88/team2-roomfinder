import { Router } from 'express';
import { BookingController } from '@/controllers/booking.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { bookingSchema } from '@/lib/validations/validations.schema';
import { uploadPaymentProof } from '@/middlewares/upload.middleware';

export class BookingRouter {
  public router: Router;
  private bookingController: BookingController;

  constructor() {
    this.router = Router();
    this.bookingController = new BookingController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/bookings',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      ValidationMiddleware.validate(bookingSchema),
      this.bookingController.createBooking.bind(this.bookingController),
    );

    this.router.post(
      '/bookings/:id/payment-proof',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      uploadPaymentProof.single('file'),
      this.bookingController.uploadPaymentProof.bind(this.bookingController),
    );

    this.router.get(
      '/bookings',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      this.bookingController.getUserBookings.bind(this.bookingController),
    );

    this.router.delete(
      '/bookings/:id/cancel',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      this.bookingController.cancelBookingByUser.bind(this.bookingController),
    );

    this.router.get(
      '/bookings/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      this.bookingController.getBookingById.bind(this.bookingController),
    );
  }
}
