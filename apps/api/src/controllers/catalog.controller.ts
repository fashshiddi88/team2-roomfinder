import { Request, Response } from 'express';
import { CatalogService } from '@/services/catalog.service';

export class CatalogController {
  private catalogService: CatalogService;

  constructor() {
    this.catalogService = new CatalogService();
  }

  async getCatalogProperties(req: Request, res: Response) {
    try {
      const {
        search,
        categoryId,
        sortBy,
        sortOrder,
        page = '1',
        pageSize = '10',
        capacity: cap,
        startDate: start,
        endDate: end,
        userId: userIdStr, // 👈 Tambahkan ini
      } = req.query;

      const numericPage = Number(page);
      const numericPageSize = Number(pageSize);
      const capacity = cap ? Number(cap) : undefined;
      const userId = userIdStr ? Number(userIdStr) : undefined; // 👈 Parse userId
      const startDate = start ? new Date(start as string) : undefined;
      const endDate = end ? new Date(end as string) : undefined;

      function getDateRange(start: Date, end: Date): Date[] {
        const dates: Date[] = [];
        const current = new Date(start);
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return dates;
      }

      const days = startDate && endDate ? getDateRange(startDate, endDate) : [];

      const result = await this.catalogService.getAvailableProperties({
        search: search as string,
        categoryId: categoryId ? Number(categoryId) : undefined,
        sortBy: sortBy as 'name' | 'price',
        sortOrder: sortOrder as 'asc' | 'desc',
        page: numericPage,
        pageSize: numericPageSize,
        capacity,
        startDate,
        endDate,
        days,
        userId, // 👈 Dikirim ke service
      });

      return res.status(200).json({
        message: 'Catalog properties fetched successfully',
        data: result.data,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: numericPage,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async getAllCities(req: Request, res: Response) {
    try {
      const cities = await this.catalogService.getAllCities();
      res.status(200).json({
        message: 'Cities fetched successfully',
        data: cities,
      });
    } catch (err: any) {
      res.status(500).json({
        message: 'Failed to fetch cities',
        error: err.message,
      });
    }
  }
}
