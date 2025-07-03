import { Request, Response } from 'express';
import { DashboardService } from '@/services/dashboard.service';

export enum BookingStatus {
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  DONE = 'DONE',
}

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getTenantBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const statusParam = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const pageParam = req.query.page as string | undefined;

      const status =
        statusParam &&
        Object.values(BookingStatus).includes(statusParam as BookingStatus)
          ? (statusParam as BookingStatus)
          : undefined;

      const page = pageParam ? parseInt(pageParam, 10) : 1;

      if (!userId) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: Tenant not found' });
      }

      const result = await this.dashboardService.getTenantBookings({
        userId,
        status,
        search,
        page,
      });

      return res.status(200).json({
        message: 'Tenant bookings retrieved successfully',
        data: result.data,
        totalPages: result.totalPages,
        totalData: result.totalData,
        currentPage: page,
      });
    } catch (error: any) {
      console.error('Error fetching tenant bookings:', error);
      return res.status(500).json({
        message: 'Failed to retrieve tenant bookings',
        detail: error.message,
      });
    }
  }

  public async acceptBooking(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const tenantId = (req as any).user?.userId;

      const result = await this.dashboardService.acceptBooking(id, tenantId);
      res.status(200).json({ message: 'Transaction accepted', detail: result });
    } catch (error: any) {
      res.status(400).json({
        message: 'Failed to accept transaction',
        detail: error.message || 'Unknown error',
      });
    }
  }

  public async rejectBooking(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const tenantId = (req as any).user?.userId;

      const result = await this.dashboardService.rejectBooking(id, tenantId);
      res.status(200).json({ message: 'Transaction rejected', detail: result });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Failed to reject transaction', detail: error });
    }
  }

  public async cancelBookingByTenant(req: Request, res: Response) {
    try {
      const bookingId = Number(req.params.id);
      const tenantUserId = (req as any).user?.userId;

      const result = await this.dashboardService.cancelBookingByTenant(
        bookingId,
        tenantUserId,
      );

      res.status(200).json({
        message: 'Booking canceled successfully',
        detail: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: 'Failed to cancel booking',
        detail: error.message,
      });
    }
  }
}
