import { Router } from 'express';
import { ReviewController } from '@/controllers/review.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class ReviewRouter {
  public router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.router = Router();
    this.reviewController = new ReviewController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/bookings/:bookingId/review',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      this.reviewController.createReview.bind(this.reviewController),
    );
    this.router.post(
      '/reviews/:id/reply',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('TENANT'),
      this.reviewController.replyReview.bind(this.reviewController),
    );
  }
}
