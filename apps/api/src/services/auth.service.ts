import { prisma } from '@/prisma/client';
import { Role } from '@prisma/client';
import { hashPassword, comparePassword } from '@/lib/utils/password.helper';
import { sendVerificationEmail } from '@/lib/utils/email';
import { sendMail } from '@/lib/nodemailer.config';
import { randomUUID } from 'crypto';
import { JwtUtils } from '@/lib/token.config';
import { UserInput } from '@/models/interface';
import { TenantInput } from '@/models/interface';
import bcrypt from 'bcrypt';
import { UserPayLoad } from '@/models/interface';

export class AuthService {
  async createUser(data: UserInput) {
    const { email } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        name: '',
        role: Role.USER,
        isVerified: false,
        verificationToken,
        verificationExpires,
      },
    });

    const verificationLink = `${process.env.FRONTEND_URL}/Register_Pass?token=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationLink);

    return { message: 'User created. Verification email sent.' };
  }

  async createTenant(data: TenantInput) {
    const { email, companyName } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    const user = await prisma.user.create({
      data: {
        email,
        name: '',
        role: Role.TENANT,
        isVerified: false,
        verificationToken,
        verificationExpires,
        tenant: {
          create: {
            companyName,
          },
        },
      },
      include: { tenant: true },
    });

    const verificationLink = `${process.env.FRONTEND_URL}/Register_Tenant_Pass?token=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationLink);

    return { message: 'Tenant created. Verification email sent.' };
  }

  async verifyUser(token: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        isVerified: false,
        verificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return { message: 'Account verified successfully' };
  }

  public async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Email not found, please Sign Up');
    }

    if (!user.passwordHash) {
      throw new Error('User registered via OAuth. Please login with Google.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = JwtUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      purpose: 'access',
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }

  public async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Email not found');
    }

    const resetToken = JwtUtils.generateToken(
      { userId: user.id, email: user.email, role: user.role },
      '15m', // token expire 15 menit
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested to reset your password.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return { message: 'Password reset email sent' };
  }

  public async resetPassword(token: string, newPassword: string) {
    const decoded = JwtUtils.verifyToken(token); // verify dulu

    if (!decoded || !decoded.userId) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password has been reset successfully' };
  }
}
