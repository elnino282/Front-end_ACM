/**
 * Sign Up Feature - Type Definitions
 * Matches Sign In pattern for consistency
 */

import { z } from 'zod';

const PHONE_PATTERN = /^[0-9+\-\s()]*$/;

export const UserRoleSchema = z.enum(['FARMER', 'BUYER'], {
  errorMap: () => ({ message: 'Please select your role' }),
});
export type UserRole = z.infer<typeof UserRoleSchema>;

export const SignUpFormSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .trim()
      .refine((value) => value === '' || PHONE_PATTERN.test(value), {
        message: 'Please enter a valid phone number',
      }),
    role: UserRoleSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z.boolean().refine((value) => value, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;

export interface SignUpProps {
  onSignUp: (formData: SignUpFormData) => Promise<void>;
}
