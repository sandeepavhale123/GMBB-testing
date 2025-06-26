
import React from "react";
import { AddAccountModal } from "./AddAccountModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { RefreshAccountModal } from "./RefreshAccountModal";

interface GoogleAccountModalsProps {
  showAddModal: boolean;
  onAddModalChange: (open: boolean) => void;
  showDeleteModal: boolean;
  onDeleteModalChange: (open: boolean) => void;
  accountToDelete: {
    id: string;
    name: string;
    email: string;
  } | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  showRefreshListingModal: boolean;
  onRefreshModalChange: (open: boolean) => void;
  refreshListingGroups: Array<{
    accountId: string;
    name: string;
    status: string;
  }>;
  onRefreshListingGroupsSubmit: (selectedGroups: string[]) => void;
  currentAccountId: string;
  isUpdating: boolean;
}

export const GoogleAccountModals: React.FC<GoogleAccountModalsProps> = ({
  showAddModal,
  onAddModalChange,
  showDeleteModal,
  onDeleteModalChange,
  accountToDelete,
  onConfirmDelete,
  isDeleting,
  showRefreshListingModal,
  onRefreshModalChange,
  refreshListingGroups,
  onRefreshListingGroupsSubmit,
  currentAccountId,
  isUpdating,
}) => {
  return (
    <>
      {/* Add Account Modal */}
      <AddAccountModal open={showAddModal} onOpenChange={onAddModalChange} />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        open={showDeleteModal}
        onOpenChange={onDeleteModalChange}
        accountName={accountToDelete?.name || ""}
        accountEmail={accountToDelete?.email || ""}
        onConfirmDelete={onConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Refresh Account Modal */}
      <RefreshAccountModal
        open={showRefreshListingModal}
        onOpenChange={onRefreshModalChange}
        listingGroups={refreshListingGroups}
        onSubmit={onRefreshListingGroupsSubmit}
        accountId={currentAccountId}
        isUpdating={isUpdating}
      />
    </>
  );
};
