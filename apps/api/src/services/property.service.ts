import { cloudinary } from '@/lib/cloudinary.config';
import { prisma } from '@/prisma/client';

export class PropertyService {
  async createPropertyFromUser(
    userId: number,
    data: {
      name: string;
      categoryId: number;
      description?: string;
      address: string;
      cityId: number;
    },
    mainImage: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    return this.createProperty(tenant.id, data, mainImage, galleryImages);
  }

  private async uploadMainImage(file: Express.Multer.File) {
    return await cloudinary.uploader.upload(file.path, {
      folder: 'properties/main',
    });
  }

  private async uploadGalleryImages(files: Express.Multer.File[]) {
    const uploads = files.map((img) =>
      cloudinary.uploader.upload(img.path, {
        folder: 'properties/gallery',
      }),
    );
    const results = await Promise.all(uploads);
    return results.map((res) => ({ url: res.secure_url }));
  }

  private async createProperty(
    tenantId: number,
    data: {
      name: string;
      categoryId: number;
      description?: string;
      address: string;
      cityId: number;
    },
    mainImage: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ) {
    if (!mainImage) throw new Error('Main image is required');

    const mainUpload = await this.uploadMainImage(mainImage);
    const galleryUploadResults = galleryImages?.length
      ? await this.uploadGalleryImages(galleryImages)
      : [];

    return await prisma.property.create({
      data: {
        tenantId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        address: data.address,
        cityId: data.cityId,
        image: mainUpload.secure_url,
        PropertyImages: {
          create: galleryUploadResults,
        },
      },
      include: {
        PropertyImages: true,
      },
    });
  }
}
