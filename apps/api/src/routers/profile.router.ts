import { Router } from 'express';
import { ProfileController } from '@/controllers/profile.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { uploadProfileImage } from '@/middlewares/upload.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { updateProfileSchema } from '@/lib/validations/validations.schema';
import { updatePasswordSchema } from '@/lib/validations/validations.schema';

export class ProfileRouter {
  public router: Router;
  private profileController: ProfileController;

  constructor() {
    this.router = Router();
    this.profileController = new ProfileController();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      '/profile',
      AuthenticationMiddleware.verifyToken,
      this.profileController.getProfileUser.bind(this.profileController),
    );
    this.router.patch(
      '/profile',
      AuthenticationMiddleware.verifyToken,
      uploadProfileImage.single('image'),
      ValidationMiddleware.validate(updateProfileSchema),
      this.profileController.updateProfile.bind(this.profileController),
    );
    this.router.get(
      '/verify-updated-email',
      AuthenticationMiddleware.verifyToken,
      this.profileController.verifyUpdatedEmail.bind(this.profileController),
    );
    this.router.patch(
      '/profile/password',
      AuthenticationMiddleware.verifyToken,
      ValidationMiddleware.validate(updatePasswordSchema),
      this.profileController.updatePassword.bind(this.profileController),
    );
  }
}
