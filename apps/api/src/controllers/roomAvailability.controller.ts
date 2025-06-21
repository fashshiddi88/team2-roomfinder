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
      const { date, isAvailable } = req.body;

      if (!roomId || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      const result = await this.roomAvailabilityService.setRoomAvailability(
        tenant.userId,
        roomId,
        date,
        isAvailable,
      );

      return res.status(200).json({
        message: 'Room availability updated',
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
