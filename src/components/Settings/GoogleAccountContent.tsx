
import React from "react";
import { Zap, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { GoogleAccountCard } from "./GoogleAccountCard";
import { GoogleAccountListView } from "./GoogleAccountListView";
import { GoogleAccountPagination } from "./GoogleAccountPagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

interface ConnectedListing {
  id: string;
  name: string;
  address: string;
  status: "connected" | "disconnected" | "pending";
  type: "Restaurant" | "Retail" | "Service" | "Healthcare";
}

interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  listings: number;
  activeListings: number;
  lastSynced: string;
  isEnabled: boolean;
  visibilityScore: number;
  reviewResponseRate: number;
  keywordsTracked: number;
  qaResponseHealth: number;
  connectedListings: ConnectedListing[];
}

interface GoogleAccountContentProps {
  accounts: GoogleAccount[];
  loading: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  searchTerm: string;
  currentPage: number;
  pagination: any;
  onManageListings: (accountId: string) => void;
  onDeleteAccount: (accountId: string, accountName: string, accountEmail: string) => void;
  onRefreshAccount: (accountId: string) => void;
  onPageChange: (page: number) => void;
  onAddAccount: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const GoogleAccountContent: React.FC<GoogleAccountContentProps> = ({
  accounts,
  loading,
  error,
  viewMode,
  searchTerm,
  currentPage,
  pagination,
  onManageListings,
  onDeleteAccount,
  onRefreshAccount,
  onPageChange,
  onAddAccount,
  onRefresh,
  isRefreshing,
}) => {
  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-red-800 text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading && accounts.length === 0) {
    return (
      <div className="space-y-4">
        {viewMode === "list" ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Account</TableHead>
                  <TableHead className="text-center">Total Listings</TableHead>
                  <TableHead className="text-center">Connected Listings</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
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
    );
  }

  // Content with accounts
  if (accounts.length > 0) {
    return (
      <>
        {/* Account Cards Grid/List */}
        {viewMode === "list" ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    Account
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Total Listings
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Connected Listings
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <GoogleAccountListView
                    key={account.id}
                    account={account}
                    onManageListings={onManageListings}
                    onDeleteAccount={onDeleteAccount}
                    onRefreshAccount={onRefreshAccount}
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
                onManageListings={onManageListings}
                onDeleteAccount={onDeleteAccount}
                onRefreshAccount={onRefreshAccount}
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
              onPageChange={onPageChange}
            />
          )}
      </>
    );
  }

  // Empty State
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? "No accounts found" : "No accounts connected"}
      </h3>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        {searchTerm
          ? `No accounts match "${searchTerm}". Try a different search term.`
          : "Click 'Add New Account' to sync your Google Business Profile."}
      </p>
      {!searchTerm && (
        <Button
          onClick={onAddAccount}
          className="flex items-center gap-2 mx-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Account
        </Button>
      )}
    </div>
  );
};
