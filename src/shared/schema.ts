import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const insertUserSchema = authSchema.extend({
  username: z.string().min(2, 'Username must be at least 2 characters'),
});

export const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  bio: z.string().optional()
});

export const insertBirthDetailsSchema = z.object({
  birthDate: z.date(),
  birthTime: z.string().optional(),
  birthPlace: z.string().min(2, 'Birth place must be at least 2 characters')
});

export type AuthSchema = z.infer<typeof authSchema>;
export type InsertUserSchema = z.infer<typeof insertUserSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type InsertBirthDetailsSchema = z.infer<typeof insertBirthDetailsSchema>;
