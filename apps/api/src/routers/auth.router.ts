import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import {
  registerTenantSchema,
  userSchema,
} from '@/lib/validations/validations.schema';
import { registerSchema } from '@/lib/validations/validations.schema';
import { loginSchema } from '@/lib/validations/validations.schema';
import { verifySchema } from '@/lib/validations/validations.schema';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';

export class AuthRouter {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/register-user',
      ValidationMiddleware.validate(registerSchema),
      this.authController.create.bind(this.authController),
    );
    this.router.post(
      '/users/verify',
      ValidationMiddleware.validate(verifySchema),
      this.authController.verify.bind(this.authController),
    );
    this.router.post(
      '/register-tenant',
      ValidationMiddleware.validate(registerTenantSchema),
      this.authController.createTenant.bind(this.authController),
    );
    this.router.post(
      '/auth/login',
      ValidationMiddleware.validate(loginSchema),
      this.authController.login.bind(this.authController),
    );
  }
}
