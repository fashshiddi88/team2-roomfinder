import { Request, Response } from 'express';
import { ReviewService } from '@/services/review.service';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public async createReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const bookingId = Number(req.params.bookingId);
      const { comment, rating } = req.body;

      if (!comment || typeof rating !== 'number') {
        return res.status(400).json({
          message: 'Comment and rating are required',
        });
      }

      const result = await this.reviewService.createReview({
        userId,
        bookingId,
        comment,
        rating,
      });

      return res.status(201).json({
        message: 'Review submitted successfully',
        detail: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: 'Failed to submit review',
        detail: error.message,
      });
    }
  }
  public async replyReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewId = Number(req.params.id);
      const tenantId = (req as any).user?.userId;
      const { tenantReply } = req.body;

      const result = await this.reviewService.replyReview({
        reviewId,
        userId: tenantId,
        tenantReply,
      });

      res.status(200).json({
        message: 'Reply submitted successfully',
        detail: result,
      });
    } catch (error: any) {
      console.error('Reply review error:', error);
      res.status(400).json({
        message: 'Failed to reply review',
        detail: error.message,
      });
    }
  }
}
