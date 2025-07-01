import { Router } from 'express';
import { PeakSeasonRateController } from '@/controllers/peakSeasonRate.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { peakSeasonRateSchema } from '@/lib/validations/validations.schema';

export class PeakSeasonRateRouter {
  public router: Router;
  private peakSeasonRateController: PeakSeasonRateController;

  constructor() {
    this.router = Router();
    this.peakSeasonRateController = new PeakSeasonRateController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/room/:roomId/peak-season',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      ValidationMiddleware.validate(peakSeasonRateSchema),
      this.peakSeasonRateController.setPeakSeasonRate.bind(
        this.peakSeasonRateController,
      ),
    );

    this.router.get(
      '/property/rooms/:roomId/peak-seasons',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.peakSeasonRateController.getPeakSeasonsByRoomId.bind(
        this.peakSeasonRateController,
      ),
    );
  }
}
