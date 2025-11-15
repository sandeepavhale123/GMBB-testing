import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Grid3X3, List, Zap, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { GoogleAccountCard } from "./GoogleAccountCard";
import { GoogleAccountListView } from "./GoogleAccountListView";
import { GoogleAccountPagination } from "./GoogleAccountPagination";
import { AddAccountModal } from "./AddAccountModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { useGoogleAccounts } from "../../hooks/useGoogleAccounts";
import GoogleAuthHandler from "./GoogleAuthHandler";
import { toast } from "@/hooks/use-toast";
import { RefreshAccountModal } from "./RefreshAccountModal";
import { comprehensiveCleanup } from "../../utils/domUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  const { t } = useI18nNamespace("Settings/manageGoogleAccountPage");
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
    allowedListing,
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
    if (location.pathname.startsWith("/main-dashboard")) {
      navigate(`/main-dashboard/settings/listings/${accountId}`);
    } else {
      navigate(`/settings/listings/${accountId}`);
    }
  };
  const handleReAuth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const localdomain = window.location.host;
    const isMultiDashboard =
      window.location.pathname.startsWith("/main-dashboard");

    // Save state in localStorage
    // Save state in localStorage
    localStorage.setItem("oauth_origin", isMultiDashboard ? "multi" : "single");
    const state = localStorage.getItem("oauth_origin");
    if (state == "multi") {
      const authUrl = `${
        import.meta.env.VITE_BASE_URL
      }/google-auth?domain=${localdomain}/main-dashboard/settings`;

      window.location.href = authUrl; // Redirect to backend OAuth start
    } else {
      const authUrl = `${
        import.meta.env.VITE_BASE_URL
      }/google-auth?domain=${localdomain}/settings`;

      window.location.href = authUrl; // Redirect to backend OAuth start
    }
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
          title: t("manageGoogleAccountPage.modals.refreshAccount.title"),
          description: `${response.message}`,
        });
        refetch(); // Refresh the accounts list
      }
    } catch (error) {
      // console.error("Error refreshing account:", error);
      toast({
        title: t("manageGoogleAccountPage.modals.refreshAccount.refreshTitle"),
        description:
          error instanceof Error
            ? error.message
            : t("manageGoogleAccountPage.modals.refreshAccount.refreshFailed"),
        variant: "destructive",
      });
    }
  };
  const handleRefreshListingGroupsSubmit = async (
    selectedGroups: [string, string][]
  ) => {
    if (!currentAccountId) return;
    try {
      const response = await updateAccount(currentAccountId, selectedGroups);

      toast({
        title: t("manageGoogleAccountPage.modals.refreshAccount.updateSuccess"),
        description: `${response.message}`,
      });
      setShowRefreshListingModal(false);
      setRefreshListingGroups([]);
      setCurrentAccountId("");
      refetch(); // Refresh the accounts list
    } catch (error: any) {
      toast({
        title: t("manageGoogleAccountPage.modals.refreshAccount.updateTitle"),
        description:
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data
            ? error.response.data.message
            : error instanceof Error
            ? error.message
            : t("manageGoogleAccountPage.modals.refreshAccount.updateFailed"),
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
          title: t(
            "manageGoogleAccountPage.modals.deleteAccount.deleteSuccess"
          ),
          description: t(
            "manageGoogleAccountPage.modals.deleteAccount.successDesc",
            { name: accountToDelete.name }
          ),
        });
        setAccountToDelete(null);
        setShowDeleteModal(false);

        // Force cleanup after successful delete to remove pointer-events: none
        setTimeout(() => {
          comprehensiveCleanup();
        }, 100);
      } catch (error) {
        console.error("Error deleting account:", error);
        toast({
          title: t("manageGoogleAccountPage.modals.deleteAccount.deleteTitle"),
          description:
            error instanceof Error
              ? error.message
              : t("manageGoogleAccountPage.modals.deleteAccount.deleteFailed"),
          variant: "destructive",
        });
      }
    }
  };

  // Monitor showDeleteModal state changes for cleanup
  useEffect(() => {
    if (!showDeleteModal) {
      // Modal closed - force cleanup with multiple attempts
      setTimeout(() => {
        comprehensiveCleanup();
      }, 0);
      setTimeout(() => {
        comprehensiveCleanup();
      }, 200);
      setTimeout(() => {
        comprehensiveCleanup();
      }, 500);
    }
  }, [showDeleteModal]);

  // If we have a code and haven't processed it yet, show the auth handler
  if (code && !hasProcessedCode.current) {
    hasProcessedCode.current = true;
    return <GoogleAuthHandler />;
  }
  return (
    <div className="p-4 sm:p-6 pb-[100px] sm:pb-[100px] max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl  font-bold text-gray-900 mb-2">
          {t("manageGoogleAccountPage.pageTitle")}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {t("manageGoogleAccountPage.pageDescription")}
        </p>
      </div>

      {/* Top Controls Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("manageGoogleAccountPage.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Active Listings Badge */}
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit"
            >
              {t("manageGoogleAccountPage.activeListingsBadge", {
                active: totalActiveListings,
                allowed: allowedListing,
              })}
              {/* Active Listings: {totalActiveListings}/{allowedListing} */}
            </Badge>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
            {/* View Switcher */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Add New Account Button */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("manageGoogleAccountPage.addNewAccount.full")}
              </span>
              <span className="sm:hidden">
                {t("manageGoogleAccountPage.addNewAccount.short")}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              {t("manageGoogleAccountPage.errorState.tryAgain")}
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && accounts.length === 0 ? (
        <div className="space-y-4">
          {viewMode === "list" ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>
                      {t("manageGoogleAccountPage.tableHeaders.account")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("manageGoogleAccountPage.tableHeaders.totalListings")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t(
                        "manageGoogleAccountPage.tableHeaders.connectedListings"
                      )}
                    </TableHead>
                    <TableHead className="text-center">
                      {" "}
                      {t("manageGoogleAccountPage.tableHeaders.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Skeleton className="h-8 w-8 mx-auto" />
                      </td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : accounts.length > 0 ? (
        <>
          {/* Account Cards Grid/List */}
          {viewMode === "list" ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      {t("manageGoogleAccountPage.tableHeaders.account")}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      {t("manageGoogleAccountPage.tableHeaders.totalListings")}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      {t(
                        "manageGoogleAccountPage.tableHeaders.connectedListings"
                      )}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      {t("manageGoogleAccountPage.tableHeaders.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <GoogleAccountListView
                      key={account.id}
                      account={account}
                      onManageListings={handleManageListings}
                      onReauth={handleReAuth}
                      onDeleteAccount={handleDeleteAccount}
                      onRefreshAccount={handleRefreshAccount}
                      isRefreshing={isRefreshing}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-6">
              {accounts.map((account) => (
                <GoogleAccountCard
                  key={account.id}
                  account={account}
                  viewMode={viewMode}
                  onManageListings={handleManageListings}
                  onReauth={handleReAuth}
                  onDeleteAccount={handleDeleteAccount}
                  onRefreshAccount={handleRefreshAccount}
                  isRefreshing={isRefreshing}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination &&
            pagination.total_pages &&
            pagination.total_pages > 1 && (
              <GoogleAccountPagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                hasNext={pagination.has_next || false}
                hasPrev={pagination.has_prev || false}
                onPageChange={handlePageChange}
              />
            )}
        </> /* Empty State */
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? t("manageGoogleAccountPage.emptyState.noAccountsFound")
              : t("manageGoogleAccountPage.emptyState.noAccountsConnected")}
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {searchTerm
              ? t("manageGoogleAccountPage.emptyState.searchNoMatch", {
                  searchTerm,
                })
              : // `No accounts match "${searchTerm}". Try a different search term.`
                t("manageGoogleAccountPage.emptyState.addAccountCTA")}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              {t("manageGoogleAccountPage.addNewAccount.full")}
            </Button>
          )}
        </div>
      )}

      {/* Add Account Modal */}
      <AddAccountModal open={showAddModal} onOpenChange={setShowAddModal} />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        accountName={accountToDelete?.name || ""}
        accountEmail={accountToDelete?.email || ""}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Refresh Account Modal */}
      <RefreshAccountModal
        open={showRefreshListingModal}
        onOpenChange={setShowRefreshListingModal}
        listingGroups={refreshListingGroups}
        onSubmit={handleRefreshListingGroupsSubmit}
        accountId={currentAccountId}
        isUpdating={isUpdating}
      />
    </div>
  );
};
