import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvailableGroupListingSelector } from "./AvailableGroupListingSelector";
import { useUpdateGroupListingsMutation } from "@/api/listingsGroupsApi";
import { toast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AddListingToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  groupName: string;
  onSuccess: () => void;
}

export const AddListingToGroupModal: React.FC<AddListingToGroupModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  onSuccess,
}) => {
  const { t } = useI18nNamespace("Groups/addListingToGroup");
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [updateGroupListings, { isLoading }] = useUpdateGroupListingsMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedListings.length === 0) {
      toast.error({
        title: t("noListingsTitle"),
        description: t("noListingsDescription"),
      });
      return;
    }

    try {
      const response = await updateGroupListings({
        groupId,
        google_locid: selectedListings,
      }).unwrap();

      if (response.code === 200) {
        toast.success({
          title: t("successTitle"),
          description: t("successDescription", {
            count: selectedListings.length,
            plural: selectedListings.length !== 1 ? "s" : "",
            groupName,
            total: response.data.totalListings,
          }),

          //   `Successfully added ${selectedListings.length} listing${
          //     selectedListings.length !== 1 ? "s" : ""
          //   } to ${groupName}. Total listings: ${response.data.totalListings}`,
        });
        onSuccess();
        onClose();
        setSelectedListings([]);
      } else {
        throw new Error(response.message || t("errorDescription"));
      }
    } catch (error: any) {
      // console.error("Error adding listings to group:", error);
      toast.error({
        title: t("errorTitle"),
        description:
          error.data?.message || error.message || t("errorDescription"),
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedListings([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-background border shadow-xl z-50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle> {t("title", { groupName })}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvailableGroupListingSelector
            groupId={groupId}
            selectedListings={selectedListings}
            onListingsChange={setSelectedListings}
          />

          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedListings.length === 0}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {t("adding")}
                </>
              ) : (
                t("addListings", {
                  count: selectedListings.length,
                  plural: selectedListings.length !== 1 ? "s" : "",
                })
                // `Add ${selectedListings.length} Listing${
                //   selectedListings.length !== 1 ? "s" : ""
                // }`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
