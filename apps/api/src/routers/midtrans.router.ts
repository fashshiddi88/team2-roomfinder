import { Router } from 'express';
import { MidtransController } from '@/controllers/midtrans.controller';
import { AuthenticationMiddleware } from '@/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { snapRequestSchema } from '@/lib/validations/validations.schema';

export class MidtransRouter {
  public router: Router;
  private midtransController: MidtransController;

  constructor() {
    this.router = Router();
    this.midtransController = new MidtransController();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/midtrans/transaction',
      AuthenticationMiddleware.verifyToken,
      AuthorizationMiddleware.allowRoles('USER'),
      ValidationMiddleware.validate(snapRequestSchema),
      this.midtransController.createSnapTransaction.bind(
        this.midtransController,
      ),
    );
    this.router.post(
      '/midtrans/webhook',
      this.midtransController.handleWebhook.bind(this.midtransController),
    );
    this.router.get(
      '/midtrans/confirm/:orderId',
      this.midtransController.confirmPaymentStatus.bind(
        this.midtransController,
      ),
    );
  }
}
