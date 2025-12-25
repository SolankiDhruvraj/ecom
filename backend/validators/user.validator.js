import { z } from 'zod';

export const addressZodSchema = z.object({
    street: z.string().min(3, 'Street must be at least 3 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    postalCode: z.string().regex(/^\d{5,6}$/, 'Postal code must be 5 or 6 digits'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
});

export const userZodSchema = z.object({
    name: z.string().min(3, 'Enter a minimum of 3 characters'),
    email: z.string().email('Invalid Email Address'),
    password: z.string().min(6, 'Enter at least 6 character password'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    userType: z.enum(['user', 'admin'], { required_error: 'Please select user type' }),
});

export const loginZodSchema = z.object({
    email: z.string().email('Invalid Email Address'),
    password: z.string().min(6, 'Enter at least 6 character password'),
    userType: z.enum(['user', 'admin']).optional().default('user'),
});
