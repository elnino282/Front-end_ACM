/**
 * Season Validation Handlers
 * BR7/BR11/BR22/BR26/BR30: ValidateDataFormat and ValidateStatusConstraints
 * 
 * As specified in Demo Gen Code.docx Business Rules
 */

import type { SeasonStatus } from '@/entities/season';

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE CODES (from BR specification)
// ═══════════════════════════════════════════════════════════════════════════

export const MSG = {
  MSG_1: 'Please enter mandatory data.',
  MSG_4: 'Invalid data format. Please enter again.',
  MSG_7: 'Save data successful.',
  MSG_9: 'Your action is failed due to constraints in the system.',
  MSG_10: 'Season not found.',
  MSG_11: 'Are you sure you want to archive this season?',
  // Legacy aliases for backward compatibility
  MSG1: 'Please enter mandatory data.',
  MSG4: 'Invalid data format. Please enter again.',
  MSG7: 'Save data successful.',
  MSG9: 'Your action is failed due to constraints in the system.',
  MSG10: 'Season not found.',
  MSG11: 'Are you sure you want to archive this season?',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SeasonFormData {
  seasonName?: string;
  startDate?: string;
  endDate?: string;  // BR102/BR106: Made mandatory in validation
  plotId?: number;
  cropId?: number;
  initialPlantCount?: number;
  description?: string;  // BR102/BR106: Added description field
}

// ═══════════════════════════════════════════════════════════════════════════
// BR7/BR11: ValidateDataFormat()
// Validates form input for Season Create/Update
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR7/BR11: ValidateDataFormat - Validates season form data.
 * Checks:
 * - Mandatory fields: seasonName, startDate, plotId, cropId
 * - Format: seasonName must not contain special characters
 * - Date range: startDate must be before or equal to endDate
 * - Plant count: must be positive if provided
 * 
 * @param formData The season form data to validate
 * @returns ValidationResult with error messages if invalid
 */
export function ValidateDataFormat(formData: SeasonFormData): ValidationResult {
  const errors: string[] = [];

  // Check mandatory fields (MSG1)
  if (!formData.seasonName?.trim()) {
    errors.push(`${MSG.MSG1} - Season Name is required.`);
  }
  if (!formData.startDate) {
    errors.push(`${MSG.MSG1} - Start Date is required.`);
  }
  if (!formData.plotId) {
    errors.push(`${MSG.MSG1} - Plot is required.`);
  }
  if (!formData.cropId) {
    errors.push(`${MSG.MSG_1} - Crop is required.`);
  }
  // BR102/BR106: endDate is now mandatory
  if (!formData.endDate) {
    errors.push(`${MSG.MSG_1} - End Date is required.`);
  }

  // Check format constraints (MSG4)
  if (formData.seasonName) {
    // Season name: alphanumeric, spaces, hyphens, underscores only
    const validNamePattern = /^[a-zA-Z0-9\s\-_\u00C0-\u017F]+$/;
    if (!validNamePattern.test(formData.seasonName)) {
      errors.push(`${MSG.MSG4} - Season name contains invalid characters.`);
    }
    // Max length check
    if (formData.seasonName.length > 100) {
      errors.push(`${MSG.MSG4} - Season name must be 100 characters or less.`);
    }
  }

  // Check date range validity (MSG4)
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      errors.push(`${MSG.MSG4} - Start date must be before or equal to end date.`);
    }
  }

  // Check plant count is positive
  if (formData.initialPlantCount !== undefined && formData.initialPlantCount <= 0) {
    errors.push(`${MSG.MSG4} - Initial plant count must be greater than 0.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BR22/BR26/BR30: ValidateStatusConstraints()
// Validates status transitions for Season Start/Complete/Cancel
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valid status transitions as per BR specification:
 * - PLANNED → ACTIVE, CANCELLED
 * - ACTIVE → COMPLETED, CANCELLED, ARCHIVED
 * - COMPLETED → ARCHIVED
 * - CANCELLED → ARCHIVED
 * - ARCHIVED → (none)
 */
const VALID_TRANSITIONS: Record<SeasonStatus, SeasonStatus[]> = {
  PLANNED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['ARCHIVED'],
  CANCELLED: ['ARCHIVED'],
  ARCHIVED: [],
};

/**
 * BR22/BR26/BR30: ValidateStatusConstraints - Check if status transition is valid.
 * 
 * @param currentStatus The current season status
 * @param targetStatus The target season status
 * @returns true if transition is valid, false otherwise
 */
export function ValidateStatusConstraints(
  currentStatus: SeasonStatus,
  targetStatus: SeasonStatus
): boolean {
  const validTargets = VALID_TRANSITIONS[currentStatus] ?? [];
  return validTargets.includes(targetStatus);
}

/**
 * Get validation error message for invalid status transition.
 */
export function getStatusTransitionError(
  currentStatus: SeasonStatus,
  _targetStatus: SeasonStatus
): string {
  const validTargets = VALID_TRANSITIONS[currentStatus] ?? [];
  if (validTargets.length === 0) {
    return `${MSG.MSG9} - ${currentStatus} seasons cannot be updated.`;
  }
  return `${MSG.MSG9} - ${currentStatus} season can only transition to: ${validTargets.join(', ')}.`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BR17: Text_change()
// Search handler for season list filtering
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR17: Text_change - Event handler for search input changes.
 * Triggers season filtering based on keyword.
 * 
 * @param e The input change event
 * @param setSearchQuery State setter for the search query
 */
export function Text_change(
  e: React.ChangeEvent<HTMLInputElement>,
  setSearchQuery: (query: string) => void
): void {
  const value = e.target.value;
  setSearchQuery(value);
}

// ═══════════════════════════════════════════════════════════════════════════
// BR8/BR14: Close()
// Dialog close handler
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR8/BR14: Close - Closes a dialog/modal.
 * Used for Cancel button in confirmation dialogs.
 * 
 * @param setDialogOpen State setter for dialog visibility
 */
export function Close(setDialogOpen: (open: boolean) => void): void {
  setDialogOpen(false);
}



