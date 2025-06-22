import { Request, Response } from 'express';
import { PropertyExploreService } from '@/services/propertyExplore.service';

export class PropertyExploreController {
  private propertyExploreService: PropertyExploreService;

  constructor() {
    this.propertyExploreService = new PropertyExploreService();
  }

  async getPropertyDetail(req: Request, res: Response) {
    try {
      const propertyId = Number(req.params.id);
      const { startDate: start, endDate: end } = req.query;
      const startDate = start ? new Date(start as string) : undefined;
      const endDate = end ? new Date(end as string) : undefined;
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

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

      const detail = await this.propertyExploreService.getPropertyDetail(
        propertyId,
        startDate,
        endDate,
        days,
      );

      return res.status(200).json({
        message: 'Property detail fetched successfully',
        data: detail,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getRoomsByPropertyId(req: Request, res: Response) {
    try {
      const propertyId = Number(req.params.id);
      const { startDate: start, endDate: end } = req.query;
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

      const rooms = await this.propertyExploreService.getRoomsByPropertyId(
        propertyId,
        startDate,
        endDate,
        days,
      );
      return res
        .status(200)
        .json({ message: 'Rooms fetched successfully', data: rooms });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getRoomPricesByMonth(req: Request, res: Response) {
    try {
      const propertyId = Number(req.params.id);
      const { month } = req.query;

      if (!month || typeof month !== 'string') {
        return res.status(400).json({ message: 'Query "month" is required' });
      }

      const prices = await this.propertyExploreService.getRoomPricesByMonth(
        propertyId,
        month,
      );
      return res.status(200).json({ message: 'Prices fetched', data: prices });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
