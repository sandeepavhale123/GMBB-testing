import React from "react";
import { Trash2, RefreshCw, Eye, BookKey } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { GoogleAccountAvatar } from "./GoogleAccountAvatar";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ConnectedListing {
  id: string;
  name: string;
  address: string;
  status: "connected" | "disconnected" | "pending";
  type: "Restaurant" | "Retail" | "Service" | "Healthcare";
}

interface GoogleAccount {
  isDisabled: boolean;
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

interface GoogleAccountGridViewProps {
  account: GoogleAccount;
  onManageListings?: (accountId: string) => void;
  onReauth?: (e) => void;
  onDeleteAccount?: (
    accountId: string,
    accountName: string,
    accountEmail: string
  ) => void;
  onRefreshAccount?: (accountId: string) => void;
  isRefreshing?: boolean;
}

export const GoogleAccountGridView: React.FC<GoogleAccountGridViewProps> = ({
  account,
  onManageListings,
  onReauth,
  onDeleteAccount,
  onRefreshAccount,
  isRefreshing,
}) => {
  const { t } = useI18nNamespace("Settings/googleAccountGridView");
  const handleCardClick = () => {
    onManageListings?.(account.id);
  };
  const handleReauth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReauth(e);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();

    onRefreshAccount?.(account.id);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onManageListings?.(account.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    onDeleteAccount?.(account.id, account.name, account.email);
  };

  return (
    <Card
      className="transition-all duration-200 hover:shadow-md border border-gray-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Row 1: Account Profile (left) + Action Buttons (right) */}
        <div className="flex items-center justify-between mb-3">
          <GoogleAccountAvatar
            name={account.name}
            avatar={account.avatar}
            size="lg"
          />
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-green-600"
              onClick={handleView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {account.isDisabled ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                onClick={handleReauth}
              >
                <BookKey className="h-4 w-4" />
              </Button>
            ) : (
              ""
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Row 2: User Name & Email */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            {account.name}
          </h3>
          <p className="text-sm text-gray-500">{account.email}</p>
        </div>

        {/* Row 3: Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {account.listings}
            </div>
            <div className="text-xs text-gray-500">
              {t("googleAccountGridView.summary.totalListings")}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {account.activeListings}
            </div>
            <div className="text-xs text-gray-500">
              {" "}
              {t("googleAccountGridView.summary.connected")}
            </div>
          </div>
        </div>

        {/* Row 4: Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">
              {" "}
              {t("googleAccountGridView.progress.label")}
            </span>
            <span className="text-xs text-gray-700 font-medium">
              {account.listings > 0
                ? Math.round((account.activeListings / account.listings) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width:
                  account.listings > 0
                    ? `${(account.activeListings / account.listings) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
