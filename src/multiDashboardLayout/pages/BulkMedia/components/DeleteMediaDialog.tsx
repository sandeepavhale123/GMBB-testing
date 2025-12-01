import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface DeleteMediaDialogProps {
  open: boolean;
  itemTitle: string | undefined;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteMediaDialog: React.FC<DeleteMediaDialogProps> = React.memo(
  ({ open, itemTitle, onOpenChange, onConfirm }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkMedia");

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { title: itemTitle })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

DeleteMediaDialog.displayName = "DeleteMediaDialog";
