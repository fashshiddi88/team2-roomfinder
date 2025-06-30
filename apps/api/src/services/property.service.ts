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

  async getPropertyById(propertyId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId: tenant.id,
      },
      include: {
        category: true,
        city: true,
        rooms: {
          include: {
            availabilities: true,
          },
        },
        PropertyImages: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!property) throw new Error('Property not found or not owned by tenant');

    return property;
  }

  async updateProperty(
    propertyId: number,
    userId: number,
    data: {
      name?: string;
      categoryId?: number;
      description?: string;
      address?: string;
      cityId?: number;
    },
    mainImage?: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const existing = await prisma.property.findFirst({
      where: { id: propertyId, tenantId: tenant.id },
      include: { PropertyImages: true },
    });

    if (!existing) throw new Error('Property not found or access denied');

    // Upload main image (if any)
    const mainImageUrl = mainImage
      ? (
          await cloudinary.uploader.upload(mainImage.path, {
            folder: 'properties/main',
          })
        ).secure_url
      : existing.image;

    // Upload gallery (if any)
    let newGallery: { url: string }[] = [];
    if (galleryImages?.length) {
      const uploads = galleryImages.map((img) =>
        cloudinary.uploader.upload(img.path, { folder: 'properties/gallery' }),
      );
      const results = await Promise.all(uploads);
      newGallery = results.map((res) => ({ url: res.secure_url }));

      await prisma.propertyImage.deleteMany({ where: { propertyId } });
    }

    // Hanya update field yang tidak kosong atau null
    const sanitized = {
      name: data.name?.trim() || existing.name,
      categoryId: data.categoryId ?? existing.categoryId,
      description: data.description?.trim() || existing.description,
      address: data.address?.trim() || existing.address,
      cityId: data.cityId ?? existing.cityId,
      image: mainImageUrl,
      ...(newGallery.length > 0 && {
        PropertyImages: { create: newGallery },
      }),
    };

    return prisma.property.update({
      where: { id: propertyId },
      data: sanitized,
      include: { PropertyImages: true },
    });
  }

  async softDeleteProperty(propertyId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const existing = await prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId: tenant.id,
        deletedAt: null,
      },
    });

    if (!existing) throw new Error('Property not found or access denied');

    await prisma.property.update({
      where: { id: propertyId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Property successfully soft-deleted' };
  }

  async hardDeleteProperty(propertyId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const existing = await prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId: tenant.id,
      },
    });

    if (!existing) throw new Error('Property not found or access denied');

    // Hapus gambar-gambar terlebih dahulu
    await prisma.propertyImage.deleteMany({
      where: { propertyId },
    });

    // Hapus properti
    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { message: 'Property permanently deleted' };
  }

  async restoreProperty(propertyId: number, userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId: tenant.id,
        deletedAt: { not: null },
      },
    });

    if (!property)
      throw new Error('Property not found or not eligible for restore');

    await prisma.property.update({
      where: { id: propertyId },
      data: { deletedAt: null },
    });

    return { message: 'Property successfully restored' };
  }

  async getTenantProperties(userId: number) {
    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) throw new Error('Tenant not found');

    return prisma.property.findMany({
      where: { tenantId: tenant.id },
      include: {
        rooms: true,
        PropertyImages: true,
        category: true,
        city: {
          include: { province: true },
        },
      },
    });
  }
}
