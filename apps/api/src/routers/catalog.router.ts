import { Router } from 'express';
import { CatalogController } from '@/controllers/catalog.controller';

export class CatalogRouter {
  public router: Router;
  private catalogController: CatalogController;

  constructor() {
    this.router = Router();
    this.catalogController = new CatalogController();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      '/catalog',
      this.catalogController.getCatalogProperties.bind(this.catalogController),
    );
    this.router.get(
      '/cities',
      this.catalogController.getAllCities.bind(this.catalogController),
    );
    this.router.get(
      '/properties',
      this.catalogController.getAllProperties.bind(this.catalogController),
    );
  }
}
