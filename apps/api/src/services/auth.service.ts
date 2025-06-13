import { prisma } from '@/prisma/client';
import { Role } from '@prisma/client';
import { hashPassword, comparePassword } from '@/lib/utils/password.helper';
import { sendVerificationEmail } from '@/lib/utils/email';
import { randomUUID } from 'crypto';
import { JwtUtils } from '@/lib/token.config';
import { UserInput } from '@/models/interface';
import { UserPayLoad } from '@/models/interface';

export class AuthService {
  async createUser(data: UserInput) {
    const { email } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const verificationToken = randomUUID(); // gunakan UUID sebagai token
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam dari sekarang

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

    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationLink);

    return { message: 'User created. Verification email sent.' };
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

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email first');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload: UserPayLoad = {
      userId: user.id,
      email: user.email,
      role: user.role,
      purpose: 'access',
    };

    const accessToken = JwtUtils.generateToken(payload);

    return {
      message: 'Login successful',
      accessToken,
    };
  }
}
