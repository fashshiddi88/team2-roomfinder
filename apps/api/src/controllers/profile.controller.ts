import { Request, Response } from 'express';
import { ProfileService } from '@/services/profile.service';

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  public async getProfileUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      const user = await this.profileService.getProfileUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: 'Profile fetched successfully',
        detail: user,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Failed to fetch profile',
        detail: error instanceof Error ? error.message : error,
      });
    }
  }

  public async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { name, email, phone } = req.body;
      const file = req.file;

      const updatedUser = await this.profileService.updateProfile(
        userId,
        { name, email, phone },
        file,
      );

      res.status(200).json({
        message: 'Profile updated successfully',
        detail: updatedUser,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        message: 'Failed to update profile',
        detail: error,
      });
    }
  }

  async verifyUpdatedEmail(req: Request, res: Response): Promise<void> {
    try {
      const token = req.query.token as string;

      if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
      }

      const result = await this.profileService.verifyUpdatedEmail(token);

      res.status(200).json({
        message: 'Email verification successful',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: 'Email verification failed',
        detail: error.message,
      });
    }
  }
}
