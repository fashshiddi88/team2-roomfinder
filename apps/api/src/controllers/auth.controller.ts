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

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const result = await this.authService.login(email, password);

      res.status(200).json({
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        message: 'Unauthorized: Failed login',
        error: error.message,
      });
    }
  }

  public async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      const result = await this.authService.resetPassword(token, newPassword);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
