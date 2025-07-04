import { Request, Response } from 'express';
import { RoomAvailabilityService } from '@/services/roomAvailability.service';

export class RoomAvailabilityController {
  private roomAvailabilityService: RoomAvailabilityService;

  constructor() {
    this.roomAvailabilityService = new RoomAvailabilityService();
  }

  async setRoomAvailability(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({
          message: 'Forbidden: Only tenants can update room availability',
        });
      }

      const roomId = Number(req.params.roomId);
      const { date, available } = req.body;

      if (!roomId || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({ message: 'Invalid or missing date' });
      }

      if (typeof available !== 'number' || available < 0) {
        return res.status(400).json({ message: 'Invalid available value' });
      }

      const result = await this.roomAvailabilityService.setRoomAvailability(
        tenant.userId,
        roomId,
        date,
        available,
      );

      return res.status(200).json({
        message: 'Room availability updated',
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getRoomAvailabilities(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({
          message: 'Forbidden: Only tenants can access room availability',
        });
      }

      const roomId = Number(req.params.roomId);
      if (!roomId || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      const {
        month,
        page = '1',
        pageSize = '10',
        sortOrder = 'asc',
      } = req.query;

      const result = await this.roomAvailabilityService.getRoomAvailabilities({
        userId: tenant.userId,
        roomId,
        month: typeof month === 'string' ? month : undefined,
        page: parseInt(page as string, 10),
        pageSize: parseInt(pageSize as string, 10),
        sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
      });

      return res.status(200).json({
        message: 'Room availabilities fetched successfully',
        ...result,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
