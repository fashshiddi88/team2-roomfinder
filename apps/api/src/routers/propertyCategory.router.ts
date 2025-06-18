import { Router } from 'express';
import { PropertyCategoryController } from '@/controllers/propertyCategory.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class PropertyCategoryRouter {
  public router: Router;
  private propertyCategoryController: PropertyCategoryController;

  constructor() {
    this.router = Router();
    this.propertyCategoryController = new PropertyCategoryController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/property-category',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyCategoryController.createCategory.bind(
        this.propertyCategoryController,
      ),
    );
    this.router.patch(
      '/property-category/update/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyCategoryController.updateCategory.bind(
        this.propertyCategoryController,
      ),
    );
    this.router.delete(
      '/property-category/delete/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyCategoryController.deleteCategory.bind(
        this.propertyCategoryController,
      ),
    );
    this.router.get(
      '/property-category',
      this.propertyCategoryController.getAllCategories.bind(
        this.propertyCategoryController,
      ),
    );
    this.router.get(
      '/property-category/all',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyCategoryController.getAllIncludingDeleted.bind(
        this.propertyCategoryController,
      ),
    );
    this.router.patch(
      '/property-category/restore/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyCategoryController.restoreCategory.bind(
        this.propertyCategoryController,
      ),
    );
  }
}
