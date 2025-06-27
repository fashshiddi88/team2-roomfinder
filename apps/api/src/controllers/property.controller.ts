import { Request, Response } from 'express';
import { PropertyService } from '@/services/property.service';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  async createProperty(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can create properties' });
      }

      const { name, categoryId, description, address, cityId } = req.body;

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const mainImage = files?.mainImage?.[0];
      const galleryImages = files?.galleryImages || [];

      if (!mainImage) {
        return res.status(400).json({ message: 'Main image is required' });
      }

      const property = await this.propertyService.createPropertyFromUser(
        user.userId,
        {
          name,
          categoryId: Number(categoryId),
          description,
          address,
          cityId: Number(cityId),
        },
        mainImage,
        galleryImages,
      );

      return res.status(201).json({
        message: 'Property created successfully',
        data: property,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async updateProperty(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can update properties' });
      }

      const propertyId = Number(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const rawBody = {
        name: req.body.name,
        categoryId: req.body.categoryId
          ? Number(req.body.categoryId)
          : undefined,
        description: req.body.description,
        address: req.body.address,
        cityId: req.body.cityId ? Number(req.body.cityId) : undefined,
      };

      // Type-safe file access from multer.fields
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const mainImage = files?.['mainImage']?.[0];
      const galleryImages = files?.['galleryImages'] || [];

      const updatedProperty = await this.propertyService.updateProperty(
        propertyId,
        tenant.userId,
        rawBody,
        mainImage,
        galleryImages,
      );

      return res.status(200).json({
        message: 'Property updated successfully',
        data: updatedProperty,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async softDeleteProperty(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can delete properties' });
      }

      const propertyId = Number(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const result = await this.propertyService.softDeleteProperty(
        propertyId,
        tenant.userId,
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async hardDeleteProperty(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can delete properties' });
      }

      const propertyId = Number(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const result = await this.propertyService.hardDeleteProperty(
        propertyId,
        tenant.userId,
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async restoreProperty(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({
          message: 'Forbidden: Only tenants can restore properties',
        });
      }

      const propertyId = Number(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const result = await this.propertyService.restoreProperty(
        propertyId,
        tenant.userId,
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getTenantProperties(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can view this data' });
      }

      const properties = await this.propertyService.getTenantProperties(
        tenant.userId,
      );

      return res.status(200).json({
        message: 'Properties fetched successfully',
        data: properties,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
