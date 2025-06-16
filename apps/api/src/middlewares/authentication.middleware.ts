import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '@/lib/token.config';

export class AuthenticationMiddleware {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          message: 'Unauthorized: no or invalid token format',
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = JwtUtils.verifyToken(token) as any;

      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Unauthorized: invalid or expired token',
      });
    }
  }
}
