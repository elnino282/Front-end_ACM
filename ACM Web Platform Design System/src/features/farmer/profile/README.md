# Farmer Profile Feature

## Overview
This feature provides a comprehensive profile page for farmers in the ACM Web Platform, matching the Figma design specifications.

## Components

### FarmerProfile
Main profile display component showing:
- **Profile Header**: Avatar, name, username, role badge, status badge, and bio
- **User Metadata**: User ID, joined date, and last login information
- **Contact Information**: Email, phone, and address
- **Farm Overview**: Statistics cards showing total farms, area, plots, and active seasons
- **Recent Activity**: Feed of recent farmer actions (tasks, seasons, plots, harvests)
- **Notification Preferences**: Toggles for task reminders and incident alerts

### EditProfileDialog
Modal dialog for editing profile information with:
- Form fields for display name, email, phone, address, and bio
- React Hook Form integration with Zod validation
- Real-time validation feedback
- Success/error toast notifications

## Navigation
Users can access the profile page via:
- Profile dropdown menu (clicking "Profile" item)
- Breadcrumb navigation shows: Home > Profile
- URL pattern: `/farmer/profile` (handled by portal routing)

## Data Structure

### FarmerProfileData
```typescript
interface FarmerProfileData {
  id: number;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  bio?: string;
  role: 'farmer';
  status: 'active' | 'inactive';
  joinedDate: string;
  lastLogin: string;
  avatarUrl?: string;
}
```

### FarmOverviewStats
```typescript
interface FarmOverviewStats {
  totalFarms: number;
  totalArea: number; // hectares
  totalPlots: number;
  activeSeasons: number;
}
```

### NotificationPreferences
```typescript
interface NotificationPreferences {
  taskReminders: boolean;
  incidentAlerts: boolean;
}
```

## Form Validation

### Edit Profile
- Display name: 2-100 characters
- Email: Valid email format
- Phone: 10-20 characters
- Address: 5-200 characters
- Bio: Optional, max 200 characters

## Design System
- Uses ACM green theme color: `#3BA55D` (farmer portal color)
- Follows existing Tailwind CSS patterns
- Integrates with shadcn/ui components (Card, Badge, Avatar, Dialog, Form, Switch)
- Matches Figma design specifications

## Integration Points
- **Auth Context**: Uses `useAuth()` hook for user data
- **Portal Routing**: Integrated into FarmerPortalContent router
- **Navigation**: Connected to ProfileMenu dropdown
- **Toast Notifications**: Uses Sonner for success/error messages

## Future Enhancements
- Connect to actual user API endpoints for data fetching
- Implement profile picture upload functionality
- Add real-time notification preference saving
- Integrate with farm management data for accurate statistics
- Add activity pagination for large activity feeds
