import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface DeleteSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteSeasonDialog({ open, onOpenChange, onConfirm, isDeleting }: DeleteSeasonDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="acm-rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Season</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this season? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="acm-rounded-sm" disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-white acm-rounded-sm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Season'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



