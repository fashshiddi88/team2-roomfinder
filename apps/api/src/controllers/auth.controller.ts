import { Request, Response } from 'express';
import { UserInput } from '@/models/interface';
import { TenantInput } from '@/models/interface';
import { AuthService } from '@/services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: UserInput = req.body;
      const result = await this.authService.createUser(data);
      res.status(201).json({
        message: 'User Created',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create user',
        detail: error,
      });
    }
  }

  async createTenant(req: Request, res: Response): Promise<void> {
    try {
      const data: TenantInput = req.body;
      const result = await this.authService.createTenant(data);
      res.status(201).json({
        message: 'Tenant Created',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create tenant',
        detail: error,
      });
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const token = req.query.token as string;
      const { password } = req.body;

      if (!token || !password) {
        res.status(400).json({
          message: 'Token and password are required',
        });
        return;
      }

      const result = await this.authService.verifyUser(token, password);

      res.status(200).json({
        message: 'Verification successful',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: 'Verification failed',
        detail: error.message,
      });
    }
  }
}
