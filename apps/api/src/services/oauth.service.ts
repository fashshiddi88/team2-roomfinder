import axios from 'axios';
import { prisma } from '@/prisma/client';
import { JwtUtils } from '@/lib/token.config';
import { Role } from '@prisma/client';

export class OauthService {
  getGoogleRedirectUrl(): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      scope: 'openid email profile',
    });
    return `${baseUrl}?${params.toString()}`;
  }

  getGoogleTenantRedirectUrl(): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_TENANT_REDIRECT_URI!,
      scope: 'openid email profile',
    });
    return `${baseUrl}?${params.toString()}`;
  }

  async handleGoogleCallback(code: string, role: Role) {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenRes.data;

    const profileRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const { email, name, picture } = profileRes.data;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        profilePhoto: picture,
        isVerified: true,
        role,
        authProvider: 'GOOGLE',
      },
    });

    const token = JwtUtils.generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        purpose: 'access',
      },
      '2h',
    );

    return {
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
  async handleGoogleTenantCallback(code: string, companyName: string) {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_TENANT_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenRes.data;

    const profileRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const { email, name, picture } = profileRes.data;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        profilePhoto: picture,
        isVerified: true,
        role: 'TENANT',
        authProvider: 'GOOGLE',
      },
    });

    const existingTenant = await prisma.tenant.findUnique({
      where: { userId: user.id },
    });

    if (!existingTenant) {
      await prisma.tenant.create({
        data: {
          userId: user.id,
          companyName,
        },
      });
    }

    const token = JwtUtils.generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        purpose: 'access',
      },
      '2h',
    );

    return {
      message: 'Google login as tenant successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
