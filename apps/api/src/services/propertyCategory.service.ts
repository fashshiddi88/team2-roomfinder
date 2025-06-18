import { prisma } from '@/prisma/client';

export class PropertyCategoryService {
  async createCategory(name: string) {
    return await prisma.propertyCategory.create({
      data: { name },
    });
  }

  async updateCategory(id: number, name: string) {
    return await prisma.propertyCategory.update({
      where: { id },
      data: { name },
    });
  }

  async deleteCategory(id: number) {
    return await prisma.propertyCategory.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getAllCategories() {
    return await prisma.propertyCategory.findMany({
      where: { isDeleted: false },
    });
  }

  async getAllIncludingDeleted() {
    return await prisma.propertyCategory.findMany();
  }

  async restoreCategory(id: number) {
    return await prisma.propertyCategory.update({
      where: { id },
      data: { isDeleted: false },
    });
  }
}
