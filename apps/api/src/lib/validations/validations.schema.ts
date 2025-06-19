import { z as zod } from 'zod';

export const userSchema = {
  body: zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  }),
  params: zod.object({
    id: zod.string(),
  }),
};

export const registerSchema = {
  body: zod.object({
    email: zod.string().email('Invalid email format'),
  }),
};

export const registerTenantSchema = {
  body: zod.object({
    email: zod.string().email({ message: 'Invalid email format' }),
    companyName: zod.string().min(1, { message: 'Company name is required' }),
  }),
};

export const loginSchema = {
  body: zod.object({
    email: zod.string().email('Invalid email format'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const verifySchema = {
  body: zod.object({
    password: zod.string().min(6, 'Password must be at least 6 characters'),
  }),
  query: zod.object({
    token: zod.string().min(1, 'Token is required'),
  }),
};

export const forgotPasswordSchema = {
  body: zod.object({
    email: zod.string().email(),
  }),
};

export const resetPasswordSchema = {
  body: zod.object({
    newPassword: zod.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const updateProfileSchema = {
  body: zod.object({
    name: zod.string().optional(),
    email: zod.string().email().optional(),
    phone: zod.string().optional(),
  }),
};

export const updatePasswordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(6, 'Old password must be at least 6 characters'),
    newPassword: zod
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: zod.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm password must match',
    path: ['confirmNewPassword'],
  });

export const propCategorySchema = {
  body: zod.object({
    name: zod.string().min(1, 'Category name is required'),
  }),
};

export const createPropertySchema = {
  body: zod.object({
    name: zod.string().min(1, 'Name is required'),
    categoryId: zod.coerce
      .number()
      .int()
      .positive('Category ID must be a positive number'),
    description: zod.string().optional(),
    address: zod.string().min(1, 'Address is required'),
    cityId: zod.coerce
      .number()
      .int()
      .positive('City ID must be a positive number'),
  }),
};
