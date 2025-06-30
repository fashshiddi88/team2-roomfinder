import { z as zod } from 'zod';

export const loginSchema = zod.object({
  email: zod.string().email('Invalid email format'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

export const verifyPasswordSchema = zod.object({
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  token: zod.string().min(1, 'Token is required'),
});

export const registerTenantSchema = zod.object({
  email: zod.string().email({ message: 'Invalid email format' }),
  companyName: zod.string().min(1, { message: 'Company name is required' }),
});
