import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: `profile-${Date.now()}`,
  }),
});

// Storage untuk main image properti
export const mainImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'properties/main',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: `main-${Date.now()}`,
  }),
});

// Storage untuk gallery images properti
export const galleryImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'properties/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: `gallery-${Date.now()}-${file.originalname}`,
  }),
});

export { cloudinary };
