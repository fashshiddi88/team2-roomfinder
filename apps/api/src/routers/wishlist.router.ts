import { Router } from 'express';
import { WishlistController } from '@/controllers/wishlist.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class WishlistRouter {
  public router: Router;
  private wishlistController: WishlistController;

  constructor() {
    this.router = Router();
    this.wishlistController = new WishlistController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/wishlist/:propertyId',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      this.wishlistController.toggleWishlist.bind(this.wishlistController),
    );
    this.router.get(
      '/wishlist',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      this.wishlistController.getWishlist.bind(this.wishlistController),
    );
  }
}
