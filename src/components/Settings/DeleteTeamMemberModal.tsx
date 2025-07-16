import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
}

export const DeleteTeamMemberModal: React.FC<DeleteTeamMemberModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
  const handleDelete = () => {
    console.log("Deleting team member:", member);
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            </span>? This will permanently remove their account and revoke all access to the system.
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
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1"
          >
            Delete Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};