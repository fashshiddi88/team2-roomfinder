import { Request, Response } from 'express';
import { PropertyCategoryService } from '@/services/propertyCategory.service';

export class PropertyCategoryController {
  private propertyCategoryService: PropertyCategoryService;

  constructor() {
    this.propertyCategoryService = new PropertyCategoryService();
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await this.propertyCategoryService.createCategory(name);
      res.status(201).json({
        message: 'Category created successfully',
        data: category,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to create category', detail: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;
      const category = await this.propertyCategoryService.updateCategory(
        id,
        name,
      );
      res.status(200).json({
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to update category', detail: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this.propertyCategoryService.deleteCategory(id);
      res
        .status(200)
        .json({ message: 'Category deleted successfully (soft delete)' });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to delete category', detail: error.message });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.propertyCategoryService.getAllCategories();
      res.status(200).json({ data: categories });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to get categories', detail: error.message });
    }
  }

  async getAllIncludingDeleted(req: Request, res: Response) {
    try {
      const categories =
        await this.propertyCategoryService.getAllIncludingDeleted();
      res.status(200).json({ data: categories });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to get categories', detail: error.message });
    }
  }

  async restoreCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const category = await this.propertyCategoryService.restoreCategory(id);
      res.status(200).json({
        message: 'Category restored successfully',
        data: category,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to restore category', detail: error.message });
    }
  }
}
