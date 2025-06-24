import multer from 'multer';
import {
  paymentProofStorage,
  profileStorage,
  roomStorage,
} from '@/lib/cloudinary.config';

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

export const uploadRoomImage = multer({
  storage: roomStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadPaymentProof = multer({
  storage: paymentProofStorage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg and .png files are allowed'));
    }
  },
});
