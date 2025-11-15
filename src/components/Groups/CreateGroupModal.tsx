import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupListingSelector } from "./GroupListingSelector";
import {
  GroupsList,
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "@/api/listingsGroupsApi";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { X } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingGroup?: GroupsList | null;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingGroup,
}) => {
  const { t } = useI18nNamespace("Groups/createGroupModal");

  const createGroupSchema = z.object({
    groupName: z
      .string()
      .min(2, t("form.validation.groupNameMin"))
      .max(50, t("form.validation.groupNameMax")),
    selectedListings: z
      .array(z.string())
      .min(1, t("form.validation.selectListing")),
  });

  const [groupName, setGroupName] = useState("");
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();

  const { validate, getFieldError, hasFieldError, clearErrors } =
    useFormValidation(createGroupSchema);

  useEffect(() => {
    if (editingGroup) {
      setGroupName(editingGroup.groupName);
      // TODO: Load existing group's listings
      setSelectedListings([]);
    } else {
      setGroupName("");
      setSelectedListings([]);
    }
    clearErrors();
  }, [editingGroup, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      groupName,
      selectedListings,
    };

    const validation = validate(formData);
    if (!validation.isValid) {
      return;
    }

    try {
      if (editingGroup) {
        // Update existing group
        await updateGroup({
          groupId: editingGroup.id,
          groupName,
          google_locid: selectedListings.map((id) => parseInt(id, 10)),
        }).unwrap();
        toast({
          title: t("toast.success"),
          description: t("toast.groupUpdated"),
        });
      } else {
        // Create new group
        await createGroup({
          groupName,
          google_locid: selectedListings.map((id) => parseInt(id, 10)),
        }).unwrap();
        toast({
          title: t("toast.success"),
          description: t("toast.groupCreated"),
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description:
          error?.data?.message ||
          `Failed to ${
            editingGroup ? t("toast.failedUpdate") : t("toast.failedCreate")
          } group`,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSelectedListings([]);
    clearErrors();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {editingGroup ? t("dialog.editTitle") : t("dialog.createTitle")}
            </DialogTitle>
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
          {/* Group Name Field */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium">
              {t("form.groupNameLabel")}
            </Label>
            <Input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              placeholder={t("form.groupNamePlaceholder")}
              className={hasFieldError("groupName") ? "border-destructive" : ""}
              autoComplete="off"
            />
            {hasFieldError("groupName") && (
              <p className="text-xs text-destructive font-medium">
                {getFieldError("groupName")}
              </p>
            )}
          </div>

          {/* Listing Selector */}
          <div className="space-y-2">
            <GroupListingSelector
              selectedListings={selectedListings}
              onListingsChange={setSelectedListings}
              error={getFieldError("selectedListings")}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating || isUpdating}
            >
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? editingGroup
                  ? t("actions.updating")
                  : t("actions.creating")
                : editingGroup
                ? t("actions.update")
                : t("actions.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
