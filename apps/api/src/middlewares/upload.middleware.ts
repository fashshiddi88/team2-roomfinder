import multer from 'multer';
import { profileStorage } from '@/lib/cloudinary.config';

export const uploadProfileImage = multer({
  storage: profileStorage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});
