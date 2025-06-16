import { Router } from 'express';
import { OauthController } from '@/controllers/oauth.controller';

export class OauthRouter {
  public router: Router;
  private oauthController: OauthController;

  constructor() {
    this.router = Router();
    this.oauthController = new OauthController();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      '/auth/google',
      this.oauthController.googleRedirect.bind(this.oauthController),
    );
    this.router.get(
      '/auth/google/callback',
      this.oauthController.googleCallback.bind(this.oauthController),
    );

    this.router.get(
      '/auth/google/tenant',
      this.oauthController.googleTenantRedirect.bind(this.oauthController),
    );

    this.router.get(
      '/auth/google/tenant-callback',
      this.oauthController.googleTenantCallback.bind(this.oauthController),
    );
  }
}
