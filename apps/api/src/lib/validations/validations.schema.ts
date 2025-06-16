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
