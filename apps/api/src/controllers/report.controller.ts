import { Request, Response } from 'express';
import { ReportService } from '@/services/report.service';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  public async getSalesReport(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user?.userId;
      const { startDate, endDate, sortBy, sortOrder } = req.query;

      const result = await this.reportService.getSalesReport({
        tenantId,
        startDate: startDate as string,
        endDate: endDate as string,
        sortBy: sortBy as 'createdAt' | 'totalPrice',
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.status(200).json({
        message: 'Sales report fetched successfully',
        detail: result,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to fetch sales report',
        detail: error.message,
      });
    }
  }

  public async getPropertyReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: 'startDate and endDate are required',
        });
      }

      const result = await this.reportService.getPropertyReport({
        userId,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({
        message: 'Property report retrieved successfully',
        detail: result,
      });
    } catch (error: any) {
      console.error('Get property report error:', error);
      res.status(500).json({
        message: 'Failed to retrieve property report',
        detail: error.message,
      });
    }
  }

  public async getMonthlyIncomeReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      const year = req.query.year ? Number(req.query.year) : undefined;
      const month = req.query.month ? Number(req.query.month) : undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const report = await this.reportService.getMonthlyIncomeReport(
        userId,
        year,
        month,
        page,
        limit,
      );

      return res.status(200).json({
        message: 'Monthly income report fetched successfully',
        detail: report,
      });
    } catch (error: any) {
      console.error('[Monthly Income Report Error]', error);
      return res.status(500).json({
        message: 'Failed to fetch monthly income report',
        detail: error.message,
      });
    }
  }
}
