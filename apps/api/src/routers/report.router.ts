import { Router } from 'express';
import { ReportController } from '@/controllers/report.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class ReportRouter {
  public router: Router;
  private reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      '/dashboard/sales-report',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.reportController.getSalesReport.bind(this.reportController),
    );
    this.router.get(
      '/dashboard/property-report',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.reportController.getPropertyReport.bind(this.reportController),
    );
    this.router.get(
      '/dashboard/monthly-income',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.reportController.getMonthlyIncomeReport.bind(this.reportController),
    );
  }
}
