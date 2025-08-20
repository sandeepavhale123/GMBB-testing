import React, { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { 
  forceBodyStylesReset, 
  startBodyStyleObserver, 
  stopBodyStyleObserver,
  comprehensiveCleanup 
} from "../../utils/domUtils";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountName: string;
  accountEmail: string;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  open,
  onOpenChange,
  accountName,
  accountEmail,
  onConfirmDelete,
  isDeleting = false,
}) => {
  const handleDelete = () => {
    onConfirmDelete();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Modal is closing - force cleanup
      setTimeout(() => {
        comprehensiveCleanup();
      }, 50);
    }
    onOpenChange(newOpen);
  };

  // Effect to handle modal lifecycle
  useEffect(() => {
    if (open) {
      // Modal is opening - start monitoring
      startBodyStyleObserver();
    } else {
      // Modal is closing - cleanup
      stopBodyStyleObserver();
      // Force cleanup with multiple attempts to ensure it works
      requestAnimationFrame(() => {
        forceBodyStylesReset();
        // Additional cleanup after a short delay
        setTimeout(() => {
          forceBodyStylesReset();
        }, 100);
      });
    }

    // Cleanup on unmount or when modal closes
    return () => {
      if (open) {
        stopBodyStyleObserver();
        forceBodyStylesReset();
      }
    };
  }, [open]);

  // Emergency cleanup on component unmount
  useEffect(() => {
    return () => {
      stopBodyStyleObserver();
      comprehensiveCleanup();
    };
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle className="text-red-900">
              Delete Account
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to delete the account{" "}
            <span className="font-semibold text-gray-900">"{accountName}"</span>{" "}
            with this email{" "}
            <span className="font-semibold text-gray-900">
              "{accountEmail}"
            </span>
            ? This action cannot be undone and will remove all associated
            listings and data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel className="flex-1" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
