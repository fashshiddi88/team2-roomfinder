import { prisma } from '@/prisma/client';
import { comparePassword, hashPassword } from '@/lib/utils/password.helper';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/lib/utils/email';

export class ProfileService {
  public async getProfileUser(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePhoto: true,
      },
    });
  }

  public async updateProfile(
    userId: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      profilePhoto?: string;
    },
    file?: Express.Multer.File,
  ) {
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) throw new Error('User not found');

    const isEmailChanged = data.email && data.email !== currentUser.email;

    const updateData: any = {
      name: data.name,
      phone: data.phone,
    };

    if (file?.path) updateData.profilePhoto = file.path;

    if (isEmailChanged && data.email) {
      const verificationToken = randomUUID();
      const verificationExpires = new Date(Date.now() + 3600 * 1000);

      updateData.email = data.email;
      updateData.isVerified = false;
      updateData.verificationToken = verificationToken;
      updateData.verificationExpires = verificationExpires;

      const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
      await sendVerificationEmail(data.email, verificationLink);
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  public async verifyUpdatedEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        isVerified: false,
        verificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return { message: 'Email verified successfully' };
  }
}
