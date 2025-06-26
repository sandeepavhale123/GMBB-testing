
import React, { useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleAccounts } from "../../hooks/useGoogleAccounts";
import GoogleAuthHandler from "./GoogleAuthHandler";
import { toast } from "@/hooks/use-toast";
import { GoogleAccountHeader } from "./GoogleAccountHeader";
import { GoogleAccountControls } from "./GoogleAccountControls";
import { GoogleAccountContent } from "./GoogleAccountContent";
import { GoogleAccountModals } from "./GoogleAccountModals";

// Transform API data to match component expectations
const transformGoogleAccount = (apiAccount: any) => ({
  ...apiAccount,
  name: apiAccount.name || apiAccount.email.split("@")[0] || "Unknown",
  connectedListings: apiAccount.connectedListings.map(
    (name: string, index: number) => ({
      id: `${apiAccount.id}-${index}`,
      name,
      address: "Address not available",
      status: "connected" as const,
      type: "Restaurant" as const,
    })
  ),
});

export const ManageGoogleAccountPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [showRefreshListingModal, setShowRefreshListingModal] = useState(false);
  const [refreshListingGroups, setRefreshListingGroups] = useState<
    Array<{
      accountId: string;
      name: string;
      status: string;
    }>
  >([]);
  const [currentAccountId, setCurrentAccountId] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check for Google OAuth code in URL
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");
  const hasProcessedCode = useRef(false);

  console.log("Google OAuth code:", code);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    accounts: apiAccounts,
    totalActiveListings,
    totalAccounts,
    pagination,
    loading,
    error,
    refetch,
    deleteAccount,
    isDeleting,
    refreshAccount,
    isRefreshing,
    updateAccount,
    isUpdating,
  } = useGoogleAccounts({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    sortOrder: "asc",
  });

  // Transform API accounts to match component interface
  const accounts = useMemo(
    () => apiAccounts.map(transformGoogleAccount),
    [apiAccounts]
  );

  const handleManageListings = (accountId: string) => {
    navigate(`/settings/listings/${accountId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleRefreshAccount = async (accountId: string) => {
    try {
      const response = await refreshAccount(accountId);
      console.log("handle refresh response", response);

      if (response.data && Array.isArray(response.data)) {
        // Transform the API response data format
        const transformedData = response.data.map((item) => ({
          accountId: item[0] || "",
          name: item[1] || "",
          status: item[2] || "",
        }));

        setRefreshListingGroups(transformedData);
        setCurrentAccountId(accountId);
        setShowRefreshListingModal(true);
      } else {
        toast({
          title: "Account Refreshed",
          description: `${response.message}`,
        });
        refetch(); // Refresh the accounts list
      }
    } catch (error) {
      console.error("Error refreshing account:", error);
      toast({
        title: "Refresh Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to refresh the account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshListingGroupsSubmit = async (selectedGroups: string[]) => {
    if (!currentAccountId) return;

    try {
      const response = await updateAccount(currentAccountId, selectedGroups);
      console.log("update response", response);
      toast({
        title: "Listing Groups Updated",
        description: `${response.message}`,
      });

      setShowRefreshListingModal(false);
      setRefreshListingGroups([]);
      setCurrentAccountId("");
      refetch(); // Refresh the accounts list
    } catch (error: any) {
      console.log("Error updating listing groups:", error);
      
      // Check if it's an Axios error with response property
      const errorMessage = error?.response?.data?.message || 
                           error?.message || 
                           "Failed to update listing groups. Please try again.";
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = (
    accountId: string,
    accountName: string,
    accountEmail: string
  ) => {
    setAccountToDelete({
      id: accountId,
      name: accountName,
      email: accountEmail || "No email available",
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (accountToDelete && !isDeleting) {
      try {
        const response = await deleteAccount(accountToDelete.id);

        toast({
          title: "Account Deleted",
          description: `The Google account "${accountToDelete.name}" has been successfully deleted.`,
        });

        setAccountToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting account:", error);
        toast({
          title: "Delete Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete the account. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // If we have a code and haven't processed it yet, show the auth handler
  if (code && !hasProcessedCode.current) {
    console.log("Rendering GoogleAuthHandler for code processing");
    hasProcessedCode.current = true;
    return <GoogleAuthHandler />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <GoogleAccountHeader />
      
      <GoogleAccountControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalActiveListings={totalActiveListings}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        onAddAccount={() => setShowAddModal(true)}
        loading={loading}
      />

      <GoogleAccountContent
        accounts={accounts}
        loading={loading}
        error={error}
        viewMode={viewMode}
        searchTerm={searchTerm}
        currentPage={currentPage}
        pagination={pagination}
        onManageListings={handleManageListings}
        onDeleteAccount={handleDeleteAccount}
        onRefreshAccount={handleRefreshAccount}
        onPageChange={handlePageChange}
        onAddAccount={() => setShowAddModal(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <GoogleAccountModals
        showAddModal={showAddModal}
        onAddModalChange={setShowAddModal}
        showDeleteModal={showDeleteModal}
        onDeleteModalChange={setShowDeleteModal}
        accountToDelete={accountToDelete}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        showRefreshListingModal={showRefreshListingModal}
        onRefreshModalChange={setShowRefreshListingModal}
        refreshListingGroups={refreshListingGroups}
        onRefreshListingGroupsSubmit={handleRefreshListingGroupsSubmit}
        currentAccountId={currentAccountId}
        isUpdating={isUpdating}
      />
    </div>
  );
};
