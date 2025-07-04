import { Router } from 'express';
import { RoomAvailabilityController } from '@/controllers/roomAvailability.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class RoomAvailabilityRouter {
  public router: Router;
  private roomAvailabilityController: RoomAvailabilityController;

  constructor() {
    this.router = Router();
    this.roomAvailabilityController = new RoomAvailabilityController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/property/:propertyId/room/:roomId/availability',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomAvailabilityController.setRoomAvailability.bind(
        this.roomAvailabilityController,
      ),
    );
    this.router.get(
      '/property/:propertyId/room/:roomId/availability',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomAvailabilityController.getRoomAvailabilities.bind(
        this.roomAvailabilityController,
      ),
    );
  }
}
