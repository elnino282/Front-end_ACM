/**
 * Expense Display Handlers
 * BR9: Display screen handlers for Expense management
 * 
 * As specified in Demo Gen Code.docx Business Rules
 */

import type { Expense } from '@/entities/expense';

// ═══════════════════════════════════════════════════════════════════════════
// BR9: displayExpenseUpdateScreen()
// Opens the expense edit dialog with pre-populated data
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR9: displayExpenseUpdateScreen - Opens the update screen for an expense.
 * Called after successfully querying expense by ID.
 * 
 * @param expense The expense to edit
 * @param setSelectedExpense State setter for the selected expense
 * @param setEditDialogOpen State setter for edit dialog visibility
 */
export function displayExpenseUpdateScreen(
  expense: Expense,
  setSelectedExpense: (expense: Expense | null) => void,
  setEditDialogOpen: (open: boolean) => void
): void {
  setSelectedExpense(expense);
  setEditDialogOpen(true);
}

// ═══════════════════════════════════════════════════════════════════════════
// BR13: displayDeleteExpenseConfirmationScreen()
// Opens the delete confirmation dialog
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR13: displayDeleteExpenseConfirmationScreen - Opens delete confirmation.
 * Called when user initiates expense deletion.
 * 
 * @param expense The expense to delete
 * @param setActionExpense State setter for the action target expense
 * @param setDeleteDialogOpen State setter for delete dialog visibility
 */
export function displayDeleteExpenseConfirmationScreen(
  expense: Expense,
  setActionExpense: (expense: Expense | null) => void,
  setDeleteDialogOpen: (open: boolean) => void
): void {
  setActionExpense(expense);
  setDeleteDialogOpen(true);
}



