import { Request, Response } from 'express';
import { WishlistService } from '@/services/wishlist.service';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistService();
  }

  public async toggleWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const propertyId = Number(req.params.propertyId);

      if (!userId || isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid user or property ID' });
      }

      const result = await this.wishlistService.toggleWishlist(
        userId,
        propertyId,
      );
      return res.status(200).json({
        message: result.message,
        isWishlisted: result.isWishlisted,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: 'Failed to toggle wishlist',
        error: error.message,
      });
    }
  }
  public async getWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const result = await this.wishlistService.getUserWishlist(userId);

      return res.status(200).json({
        message: 'Wishlist fetched successfully',
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch wishlist',
        detail: error,
      });
    }
  }
}
