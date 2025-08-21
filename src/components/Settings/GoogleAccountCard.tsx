import React from "react";
import { GoogleAccountListView } from "./GoogleAccountListView";
import { GoogleAccountGridView } from "./GoogleAccountGridView";

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
  isDisabled: boolean;
  visibilityScore: number;
  reviewResponseRate: number;
  keywordsTracked: number;
  qaResponseHealth: number;
  connectedListings: ConnectedListing[];
}

interface GoogleAccountCardProps {
  account: GoogleAccount;
  viewMode: "grid" | "list";
  onManageListings?: (accountId: string) => void;
  onReauth: (e: React.MouseEvent) => void;
  onDeleteAccount?: (
    accountId: string,
    accountName: string,
    accountEmail: string
  ) => void;
  onRefreshAccount?: (accountId: string) => void;
  isRefreshing?: boolean;
}

export const GoogleAccountCard: React.FC<GoogleAccountCardProps> = ({
  account,
  viewMode,
  onManageListings,
  onReauth,
  onDeleteAccount,
  onRefreshAccount,
  isRefreshing,
}) => {
  if (viewMode === "list") {
    return (
      <GoogleAccountListView
        account={account}
        onManageListings={onManageListings}
        onReauth={onReauth}
        onDeleteAccount={onDeleteAccount}
        onRefreshAccount={onRefreshAccount}
        isRefreshing={isRefreshing}
      />
    );
  }

  return (
    <GoogleAccountGridView
      account={account}
      onManageListings={onManageListings}
      onReauth={onReauth}
      onDeleteAccount={onDeleteAccount}
      onRefreshAccount={onRefreshAccount}
      isRefreshing={isRefreshing}
    />
  );
};
