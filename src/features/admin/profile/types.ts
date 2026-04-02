import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// ADMIN PROFILE DATA
// ═══════════════════════════════════════════════════════════════

export interface AdminProfileData {
  // Personal Information
  id: number;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  bio?: string;

  // Address IDs for edit form
  provinceId?: number;
  wardId?: number;

  // Metadata
  role: "admin";
  status: "active" | "inactive";
  joinedDate: string;
  lastLogin: string;

  // Avatar
  avatarUrl?: string;
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM OVERVIEW STATS
// ═══════════════════════════════════════════════════════════════

export interface SystemOverviewStats {
  totalUsers: number;
  totalFarms: number;
  totalSeasons: number;
  activeIncidents: number;
}

// ═══════════════════════════════════════════════════════════════
// RECENT ACTIVITY
// ═══════════════════════════════════════════════════════════════

export interface RecentActivity {
  id: string;
  type: "user" | "farm" | "season" | "incident" | "system";
  date: string;
  description: string;
  icon?: "user" | "farm" | "calendar" | "alert" | "settings";
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION PREFERENCES
// ═══════════════════════════════════════════════════════════════

export interface NotificationPreferences {
  systemAlerts: boolean;
  incidentReports: boolean;
}

// ═══════════════════════════════════════════════════════════════
// EDIT PROFILE FORM
// ═══════════════════════════════════════════════════════════════

const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

export const EditProfileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(255, "Full name is too long"),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long")
    .refine((value) => value === "" || PHONE_REGEX.test(value), {
      message: "Invalid phone number",
    })
    .optional(),
  provinceId: z.number().optional(),
  wardId: z.number().optional(),
});

export type EditProfileFormData = z.infer<typeof EditProfileFormSchema>;
