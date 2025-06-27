import { Router } from 'express';
import { PropertyExploreController } from '@/controllers/propertyExplore.controller';

export class PropertyExploreRouter {
  public router: Router;
  private propertyExploreController: PropertyExploreController;

  constructor() {
    this.router = Router();
    this.propertyExploreController = new PropertyExploreController();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      '/property-detail/:id',
      this.propertyExploreController.getPropertyDetail.bind(
        this.propertyExploreController,
      ),
    );
    this.router.get(
      '/property-detail/:id/rooms',
      this.propertyExploreController.getRoomsByPropertyId.bind(
        this.propertyExploreController,
      ),
    );
    this.router.get(
      '/property-detail/:id/room-prices',
      this.propertyExploreController.getRoomPricesByMonth.bind(
        this.propertyExploreController,
      ),
    );
    this.router.get(
      '/property-detail/:propertyId/prices/calendar',
      this.propertyExploreController.getRoomPricesTwoMonths.bind(
        this.propertyExploreController,
      ),
    );
  }
}
