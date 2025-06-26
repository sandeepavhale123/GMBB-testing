import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface RefreshListingGroup {
  accountId: string;
  name: string;
  status: string;
}

interface SelectRefreshListingGroupsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingGroups: RefreshListingGroup[];
  onSubmit: (selectedGroups: string[]) => void;
  accountId: string;
  isUpdating?: boolean;
}

export const RefreshAccountModal: React.FC<
  SelectRefreshListingGroupsModalProps
> = ({
  open,
  onOpenChange,
  listingGroups,
  onSubmit,
  accountId,
  isUpdating,
}) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleGroupToggle = (groupAccountId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupAccountId)
        ? prev.filter((id) => id !== groupAccountId)
        : [...prev, groupAccountId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGroups(listingGroups.map((group) => group.accountId));
    } else {
      setSelectedGroups([]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedGroups);
    setSelectedGroups([]);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedGroups([]);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "update":
        return "default";
      case "new":
        return "secondary";
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isSelectAllIndeterminate =
    selectedGroups.length > 0 && selectedGroups.length < listingGroups.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col bg-white rounded-xl shadow-2xl border-0">
        <DialogHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex flex-col space-y-1">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Select Listing Groups
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Choose the listing groups you want to refresh
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden py-4">
          <div className="space-y-4">
            {/* Select All Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="select-all"
                  checked={selectedGroups.length === listingGroups.length}
                  onCheckedChange={handleSelectAll}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor="select-all"
                  className="font-semibold text-gray-900 cursor-pointer"
                >
                  Select All Listing Groups
                </label>
                <div className="flex items-center space-x-2 ml-auto">
                  <span className="text-sm text-gray-600">
                    {selectedGroups.length} of {listingGroups.length} selected
                  </span>
                </div>
              </div>
            </div>

            {/* Groups List */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Available Groups:
              </h4>
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                {listingGroups.map((group, index) => (
                  <div
                    key={`${group.accountId}-${index}`}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                      selectedGroups.includes(group.accountId)
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Checkbox
                      id={`group-${group.accountId}-${index}`}
                      checked={selectedGroups.includes(group.accountId)}
                      onCheckedChange={() => handleGroupToggle(group.accountId)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label
                      htmlFor={`group-${group.accountId}-${index}`}
                      className="flex-1 text-gray-800 font-medium cursor-pointer"
                    >
                      {group.name}
                    </label>
                    <Badge
                      variant={getStatusBadgeVariant(group.status)}
                      className="text-xs font-medium"
                    >
                      {group.status}
                    </Badge>
                  </div>
                ))}

                {listingGroups.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No listing groups available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {selectedGroups.length > 0 && (
              <span>
                {selectedGroups.length} group
                {selectedGroups.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUpdating || selectedGroups.length === 0}
              className="px-6 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isUpdating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                `Submit (${selectedGroups.length})`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
