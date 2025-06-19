import { Router } from 'express';
import { PropertyController } from '@/controllers/property.controller';
import { uploadFields } from '@/middlewares/upload.middleware';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';
import { createPropertySchema } from '@/lib/validations/validations.schema';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';

export class PropertyRouter {
  public router: Router;
  private propertyController: PropertyController;

  constructor() {
    this.router = Router();
    this.propertyController = new PropertyController();
    this.routes();
  }
  private routes(): void {
    this.router.post(
      '/property',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      uploadFields,
      ValidationMiddleware.validate(createPropertySchema),
      this.propertyController.createProperty.bind(this.propertyController),
    );
  }
}
