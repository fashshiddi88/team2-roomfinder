import { Router } from 'express';
import { DashboardController } from '@/controllers/dashboard.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class DashboardRouter {
  public router: Router;
  private dashboardController: DashboardController;

  constructor() {
    this.router = Router();
    this.dashboardController = new DashboardController();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      '/dashboard/bookings/tenant',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.dashboardController.getTenantBookings.bind(this.dashboardController),
    );

    this.router.patch(
      '/dashboard/bookings/:id/accept',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.dashboardController.acceptBooking.bind(this.dashboardController),
    );

    this.router.patch(
      '/dashboard/bookings/:id/reject',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.dashboardController.rejectBooking.bind(this.dashboardController),
    );

    this.router.delete(
      '/dashboard/:id/cancel-by-tenant',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.dashboardController.cancelBookingByTenant.bind(
        this.dashboardController,
      ),
    );
  }
}
