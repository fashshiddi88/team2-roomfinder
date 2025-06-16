import { Request, Response } from 'express';
import { OauthService } from '@/services/oauth.service';

export class OauthController {
  private oauthService = new OauthService();

  googleRedirect(req: Request, res: Response) {
    const redirectUrl = this.oauthService.getGoogleRedirectUrl();
    res.redirect(redirectUrl);
  }

  async googleCallback(req: Request, res: Response) {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is missing' });
    }

    try {
      const result = await this.oauthService.handleGoogleCallback(code, 'USER');
      res.json(result);
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      res
        .status(500)
        .json({ message: 'Google login failed', detail: err.message });
    }
  }

  googleTenantRedirect(req: Request, res: Response) {
    const { companyName } = req.query;

    if (!companyName) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const state = encodeURIComponent(JSON.stringify({ companyName }));

    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_TENANT_REDIRECT_URI}&scope=openid%20email%20profile&state=${state}`;

    res.redirect(redirectUrl);
  }

  async googleTenantCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const state = req.query.state as string;

    let companyName = '';
    try {
      const parsedState = JSON.parse(decodeURIComponent(state));
      companyName = parsedState.companyName;
    } catch {
      return res
        .status(400)
        .json({ message: 'Invalid or missing state parameter' });
    }

    if (!code || !companyName) {
      return res.status(400).json({ message: 'Missing code or company name' });
    }

    try {
      const result = await this.oauthService.handleGoogleTenantCallback(
        code,
        companyName,
      );
      res.json(result);
    } catch (err: any) {
      console.error('Google OAuth tenant error:', err);
      res.status(500).json({
        message: 'Google login as tenant failed',
        detail: err.message,
      });
    }
  }
}
