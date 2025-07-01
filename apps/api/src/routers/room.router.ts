import { Router } from 'express';
import { RoomController } from '@/controllers/room.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { uploadRoomImage } from '@/middlewares/upload.middleware';
import { createRoomSchema } from '@/lib/validations/validations.schema';

export class RoomRouter {
  public router: Router;
  private roomController: RoomController;

  constructor() {
    this.router = Router();
    this.roomController = new RoomController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/property/:propertyId/rooms',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      uploadRoomImage.single('image'),
      ValidationMiddleware.validate(createRoomSchema),
      this.roomController.createRoom.bind(this.roomController),
    );

    this.router.put(
      '/property/:propertyId/room/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      uploadRoomImage.single('image'),
      this.roomController.updateRoom.bind(this.roomController),
    );
    this.router.delete(
      '/property/:propertyId/room/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomController.softDeleteRoom.bind(this.roomController),
    );
    this.router.delete(
      '/property/:propertyId/room/delete/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomController.hardDeleteRoom.bind(this.roomController),
    );
    this.router.patch(
      '/property/:propertyId/room/restore/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomController.restoreRoom.bind(this.roomController),
    );
    this.router.get(
      '/property/my-rooms',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomController.getTenantRooms.bind(this.roomController),
    );
    this.router.get(
      '/property/:propertyId/rooms',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomController.getRoomsByProperty.bind(this.roomController),
    );

    this.router.get(
      '/room/:roomId',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.roomController.getRoomById.bind(this.roomController),
    );

    this.router.get(
      '/room-detail/:roomId',
      this.roomController.getPublicRoomById.bind(this.roomController),
    );
  }
}
