import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  bio: z.string().optional()
});
