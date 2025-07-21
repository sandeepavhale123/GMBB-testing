import React, { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTeam } from "../../hooks/useTeam";
import { useToast } from "../../hooks/use-toast";
import {
  forceBodyStylesReset,
  comprehensiveCleanup,
  startGlobalCleanupMonitor,
  stopGlobalCleanupMonitor,
  startBodyStyleObserver,
  stopBodyStyleObserver,
  addWindowFocusCleanup,
  removeWindowFocusCleanup,
} from "../../utils/domUtils";

interface DeleteTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
  onSuccess?: () => void;
}

export const DeleteTeamMemberModal: React.FC<DeleteTeamMemberModalProps> = ({
  open,
  onOpenChange,
  member,
  onSuccess,
}) => {
  const { deleteTeamMember, isDeleting, deleteError, clearTeamDeleteError } =
    useTeam();
  const { toast } = useToast();

  // Initialize global cleanup monitors when component mounts
  useEffect(() => {
    startGlobalCleanupMonitor();
    startBodyStyleObserver();
    addWindowFocusCleanup();

    return () => {
      stopGlobalCleanupMonitor();
      stopBodyStyleObserver();
      removeWindowFocusCleanup();
      // Final cleanup on unmount
      comprehensiveCleanup();
    };
  }, []);

  // Enhanced onOpenChange handler with aggressive cleanup
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        console.log("Modal closing, starting aggressive cleanup");

        // Immediate cleanup
        forceBodyStylesReset();

        // Use requestAnimationFrame for reliable DOM update
        requestAnimationFrame(() => {
          forceBodyStylesReset();

          // Another frame to ensure it's applied
          requestAnimationFrame(() => {
            forceBodyStylesReset();
          });
        });
      }

      onOpenChange(newOpen);
    },
    [onOpenChange]
  );

  const handleDelete = async () => {
    if (!member) return;

    try {
      clearTeamDeleteError();

      console.log("Starting delete operation");
      const result = await deleteTeamMember({
        id: parseInt(member.id),
        isDelete: "delete",
      });

      if (result.meta.requestStatus === "fulfilled") {
        console.log("Delete successful, starting cleanup and close sequence");

        // Immediate cleanup before any other operations
        forceBodyStylesReset();

        // Close modal first
        handleOpenChange(false);

        // Use requestAnimationFrame to ensure modal is closed before showing toast
        requestAnimationFrame(() => {
          forceBodyStylesReset();

          // Another frame for toast to ensure no interference
          requestAnimationFrame(() => {
            toast({
              title: "Success",
              description: "Team member deleted successfully",
            });

            // Final cleanup after toast
            setTimeout(() => {
              forceBodyStylesReset();
              onSuccess?.();
            }, 100);
          });
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);

      // Ensure cleanup happens even on error
      forceBodyStylesReset();

      // Show error toast with cleanup
      requestAnimationFrame(() => {
        toast({
          title: "Error",
          description: deleteError || "Failed to delete team member",
          variant: "destructive",
        });

        // Cleanup after error toast
        setTimeout(() => {
          forceBodyStylesReset();
        }, 100);
      });
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Team Member</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {member.firstName} {member.lastName}
            </span>
            ? This will permanently remove their account and revoke all access
            to the system.
          </p>

          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-900 text-sm mb-1">
              This will also remove:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Access to {member.listingsCount} listings</li>
              <li>• All assigned permissions</li>
              <li>• Account credentials and settings</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Member"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
