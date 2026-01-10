/**
 * Expense Validation Handlers
 * BR7/BR11: ValidateDataFormat for Expense Create/Update
 * 
 * As specified in Demo Gen Code.docx Business Rules
 */

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE CODES (from BR specification)
// ═══════════════════════════════════════════════════════════════════════════

export const MSG = {
  MSG1: 'Please enter mandatory data.',
  MSG4: 'Invalid format. Please enter again.',
  MSG7: 'Save data successful.',
  MSG9: 'Your action is failed due to constraints in the system.',
  MSG10: 'Data not found.',
  MSG11: 'Are you sure you want to proceed with this action?',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ExpenseFormData {
  itemName?: string;
  unitPrice?: number;
  quantity?: number;
  amount?: number;
  expenseDate?: string;
  seasonId?: number;
  taskId?: number;
  category?: string;
  note?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// BR7/BR11: ValidateDataFormat()
// Validates form input for Expense Create/Update
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR7/BR11: ValidateDataFormat - Validates expense form data.
 * Checks:
 * - Mandatory fields: itemName, expenseDate, seasonId
 * - Amount: must be greater than 0 (either direct amount or unitPrice * quantity)
 * - Date format: valid date
 * 
 * @param formData The expense form data to validate
 * @returns ValidationResult with error messages if invalid
 */
export function ValidateDataFormat(formData: ExpenseFormData): ValidationResult {
  const errors: string[] = [];

  // Check mandatory fields (MSG1)
  if (!formData.itemName?.trim()) {
    errors.push(`${MSG.MSG1} - Item Name is required.`);
  }
  if (!formData.expenseDate) {
    errors.push(`${MSG.MSG1} - Expense Date is required.`);
  }
  if (!formData.seasonId) {
    errors.push(`${MSG.MSG1} - Season is required.`);
  }

  // Check amount > 0 (MSG4)
  let effectiveAmount = 0;
  if (formData.amount !== undefined && formData.amount !== null) {
    effectiveAmount = formData.amount;
  } else if (formData.unitPrice !== undefined && formData.quantity !== undefined) {
    effectiveAmount = formData.unitPrice * formData.quantity;
  }

  if (effectiveAmount <= 0) {
    errors.push(`${MSG.MSG4} - Amount must be greater than 0.`);
  }

  // Check unit price is valid if provided
  if (formData.unitPrice !== undefined && formData.unitPrice < 0) {
    errors.push(`${MSG.MSG4} - Unit price cannot be negative.`);
  }

  // Check quantity is valid if provided
  if (formData.quantity !== undefined && formData.quantity <= 0) {
    errors.push(`${MSG.MSG4} - Quantity must be greater than 0.`);
  }

  // Check item name length
  if (formData.itemName && formData.itemName.length > 200) {
    errors.push(`${MSG.MSG4} - Item name must be 200 characters or less.`);
  }

  // Check note length
  if (formData.note && formData.note.length > 1000) {
    errors.push(`${MSG.MSG4} - Note must be 1000 characters or less.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BR14: Close()
// Dialog close handler
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR14: Close - Closes a dialog/modal.
 * Used for Cancel button in confirmation and form dialogs.
 * 
 * @param setDialogOpen State setter for dialog visibility
 */
export function Close(setDialogOpen: (open: boolean) => void): void {
  setDialogOpen(false);
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Calculate effective amount
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate the effective amount for an expense.
 * Uses direct amount if set, otherwise calculates from unitPrice * quantity.
 */
export function calculateEffectiveAmount(formData: ExpenseFormData): number {
  if (formData.amount !== undefined && formData.amount !== null && formData.amount > 0) {
    return formData.amount;
  }
  if (formData.unitPrice !== undefined && formData.quantity !== undefined) {
    return formData.unitPrice * formData.quantity;
  }
  return 0;
}



