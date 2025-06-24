import { Request, Response } from 'express';
import { MidtransService } from '../services/midtrans.service';
import { SnapRequest } from '../models/interface';

export class MidtransController {
  private midtransService: MidtransService;

  constructor() {
    this.midtransService = new MidtransService();
  }

  public async createSnapTransaction(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const payload: SnapRequest = req.body;

      // Validasi dasar
      if (
        !payload.transaction_details?.order_id ||
        !payload.transaction_details?.gross_amount
      ) {
        return res.status(400).json({ message: 'Missing transaction details' });
      }

      const redirectUrl =
        await this.midtransService.createSnapTransaction(payload);

      return res.status(200).json({
        message: 'Transaction created successfully',
        redirectUrl,
      });
    } catch (error: any) {
      console.error('[Controller Error]', error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  public async confirmPaymentStatus(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        res.status(400).json({ message: 'Missing order ID' });
        return;
      }

      const status = await this.midtransService.confirmMidtransPayment(orderId);

      res.status(200).json({
        message: 'Midtrans payment status retrieved successfully',
        detail: status,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to confirm payment status',
        detail: error.message,
      });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    console.log('[Webhook Received]', req.body);
    try {
      const payload = req.body;
      await this.midtransService.handleWebhook(payload);

      return res
        .status(200)
        .json({ message: 'Webhook processed successfully' });
    } catch (err: any) {
      console.error('[Midtrans Webhook Error]', err.message);
      return res
        .status(500)
        .json({ message: 'Failed to process webhook', detail: err.message });
    }
  }
}
