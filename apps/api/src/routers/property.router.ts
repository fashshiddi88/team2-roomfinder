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

    this.router.put(
      '/property/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      uploadFields,
      this.propertyController.updateProperty.bind(this.propertyController),
    );
    this.router.delete(
      '/property/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyController.softDeleteProperty.bind(this.propertyController),
    );

    this.router.delete(
      '/property/hard-delete/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyController.hardDeleteProperty.bind(this.propertyController),
    );
    this.router.patch(
      '/property/restore/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyController.restoreProperty.bind(this.propertyController),
    );

    this.router.get(
      '/property/my-properties',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyController.getTenantProperties.bind(this.propertyController),
    );

    this.router.get(
      '/property/:id',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.propertyController.getPropertyById.bind(this.propertyController),
    );

    
  }
}
