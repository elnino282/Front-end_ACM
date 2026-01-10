import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// PROFILE RESPONSE
// ═══════════════════════════════════════════════════════════════

export const ProfileRoleSchema = z.object({
    id: z.number().int().positive().optional(),
    code: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional().nullable(),
});

const ProfileRoleEntrySchema = z.union([ProfileRoleSchema, z.string()]);

export const ProfileResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    username: z.string().min(1),
    email: z.string().email().nullable().optional(),
    fullName: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    roles: z.array(ProfileRoleEntrySchema).optional(),
    // Address fields
    provinceId: z.number().nullable().optional(),
    provinceName: z.string().nullable().optional(),
    wardId: z.number().nullable().optional(),
    wardName: z.string().nullable().optional(),
    // Timestamp
    joinedDate: z.string().nullable().optional(),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// PROFILE UPDATE
// ═══════════════════════════════════════════════════════════════

export const ProfileUpdateRequestSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    fullName: z.string().max(255, "Full name is too long").optional().or(z.literal("")),
    phone: z.string().max(30, "Phone number is too long").optional().or(z.literal("")),
    provinceId: z.number().optional(),
    wardId: z.number().optional(),
});

export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════════════════════════════

export const ProfileChangePasswordRequestSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    roles: z.array(z.string()).optional(),
}).strict();

export type ProfileChangePasswordRequest = z.infer<typeof ProfileChangePasswordRequestSchema>;
