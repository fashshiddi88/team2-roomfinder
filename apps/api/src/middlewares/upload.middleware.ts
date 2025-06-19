import multer from 'multer';
import { profileStorage } from '@/lib/cloudinary.config';

export const uploadProfileImage = multer({
  storage: profileStorage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

// Kombinasi upload untuk create property
export const uploadPropertyImages = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadFields = uploadPropertyImages.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }, // boleh disesuaikan jumlah maksimal
]);
