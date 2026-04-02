/**
 * Season Display Handlers
 * BR9/BR20/BR24/BR28: Display screen handlers for Season management
 * 
 * As specified in Demo Gen Code.docx Business Rules
 */

import type { Season } from '@/entities/season';

// ═══════════════════════════════════════════════════════════════════════════
// BR9: displaySeasonUpdateScreen()
// Opens the season edit dialog with pre-populated data
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR9: displaySeasonUpdateScreen - Opens the update screen for a season.
 * Called after successfully querying season by ID.
 * 
 * @param season The season to edit
 * @param setSelectedSeason State setter for the selected season
 * @param setEditDialogOpen State setter for edit dialog visibility
 */
export function displaySeasonUpdateScreen(
  season: Season,
  setSelectedSeason: (season: Season | null) => void,
  setEditDialogOpen: (open: boolean) => void
): void {
  setSelectedSeason(season);
  setEditDialogOpen(true);
}

// ═══════════════════════════════════════════════════════════════════════════
// BR20: displayStartSeasonConfirmationScreen()
// Opens the start confirmation dialog
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR20: displayStartSeasonConfirmationScreen - Opens start confirmation.
 * Called after querying season by ID for start operation.
 * 
 * @param season The season to start
 * @param setActionSeason State setter for the action target season
 * @param setStartDialogOpen State setter for start dialog visibility
 */
export function displayStartSeasonConfirmationScreen(
  season: Season,
  setActionSeason: (season: Season | null) => void,
  setStartDialogOpen: (open: boolean) => void
): void {
  setActionSeason(season);
  setStartDialogOpen(true);
}

// ═══════════════════════════════════════════════════════════════════════════
// BR24: displayCompleteSeasonConfirmationScreen()
// Opens the complete confirmation dialog
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR24: displayCompleteSeasonConfirmationScreen - Opens complete confirmation.
 * Called after querying season by ID for complete operation.
 * 
 * @param season The season to complete
 * @param setActionSeason State setter for the action target season
 * @param setCompleteDialogOpen State setter for complete dialog visibility
 */
export function displayCompleteSeasonConfirmationScreen(
  season: Season,
  setActionSeason: (season: Season | null) => void,
  setCompleteDialogOpen: (open: boolean) => void
): void {
  setActionSeason(season);
  setCompleteDialogOpen(true);
}

// ═══════════════════════════════════════════════════════════════════════════
// BR28: displayCancelSeasonConfirmationScreen()
// Opens the cancel confirmation dialog
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR28: displayCancelSeasonConfirmationScreen - Opens cancel confirmation.
 * Called after querying season by ID for cancel operation.
 * 
 * @param season The season to cancel
 * @param setActionSeason State setter for the action target season
 * @param setCancelDialogOpen State setter for cancel dialog visibility
 */
export function displayCancelSeasonConfirmationScreen(
  season: Season,
  setActionSeason: (season: Season | null) => void,
  setCancelDialogOpen: (open: boolean) => void
): void {
  setActionSeason(season);
  setCancelDialogOpen(true);
}

// ═══════════════════════════════════════════════════════════════════════════
// BR13: displayArchiveSeasonConfirmationScreen()
// Opens the archive confirmation dialog
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BR13: displayArchiveSeasonConfirmationScreen - Opens archive confirmation.
 * Called after selecting a completed or cancelled season for archiving.
 * 
 * @param season The season to archive
 * @param setActionSeason State setter for the action target season
 * @param setArchiveDialogOpen State setter for archive dialog visibility
 */
export function displayArchiveSeasonConfirmationScreen(
  season: Season,
  setActionSeason: (season: Season | null) => void,
  setArchiveDialogOpen: (open: boolean) => void
): void {
  setActionSeason(season);
  setArchiveDialogOpen(true);
}



