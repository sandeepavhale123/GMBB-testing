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
  comprehensiveCleanup,
} from "../../utils/domUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  const { t } = useI18nNamespace("Settings/deleteAccountModal");

  const handleDelete = () => {
    onConfirmDelete();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Modal is closing - force cleanup with multiple attempts
      comprehensiveCleanup(); // Immediate cleanup
      setTimeout(() => {
        comprehensiveCleanup();
      }, 0);
      setTimeout(() => {
        comprehensiveCleanup();
      }, 50);
      setTimeout(() => {
        comprehensiveCleanup();
      }, 200);
      setTimeout(() => {
        comprehensiveCleanup();
      }, 500);
    }
    onOpenChange(newOpen);
  };

  // Effect to handle modal lifecycle
  useEffect(() => {
    if (open) {
      // Modal is opening - start monitoring
      startBodyStyleObserver();
    } else {
      // Modal is closing - aggressive cleanup with multiple timing attempts
      stopBodyStyleObserver();

      // Immediate cleanup
      comprehensiveCleanup();

      // Multiple cleanup attempts with different timing
      requestAnimationFrame(() => {
        comprehensiveCleanup();
      });

      setTimeout(() => {
        comprehensiveCleanup();
      }, 50);

      setTimeout(() => {
        comprehensiveCleanup();
      }, 200);

      setTimeout(() => {
        comprehensiveCleanup();
      }, 500);
    }

    // Cleanup on unmount or when modal closes
    return () => {
      if (open) {
        stopBodyStyleObserver();
        comprehensiveCleanup();
      }
    };
  }, [open]);

  // Additional cleanup when isDeleting state changes
  useEffect(() => {
    if (!isDeleting && !open) {
      // Deletion completed and modal should be closed - force cleanup
      setTimeout(() => {
        comprehensiveCleanup();
      }, 100);
    }
  }, [isDeleting, open]);

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
              {t("deleteAccountModal.title")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            {t("deleteAccountModal.description1")}
            <span className="font-semibold text-gray-900">
              {t("deleteAccountModal.description2", { accountName })}
            </span>{" "}
            {t("deleteAccountModal.description3")}
            <span className="font-semibold text-gray-900">
              {t("deleteAccountModal.description4", { accountEmail })}
            </span>
            {t("deleteAccountModal.description5")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel className="flex-1" disabled={isDeleting}>
            {t("deleteAccountModal.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("deleteAccountModal.deleting")}
              </>
            ) : (
              t("deleteAccountModal.delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
