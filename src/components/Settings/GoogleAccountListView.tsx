import React from "react";
import { MoreVertical, Edit, Trash2, RefreshCw, BookKey } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { GoogleAccountAvatar } from "./GoogleAccountAvatar";
import { TableCell, TableRow } from "../ui/table";
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

interface GoogleAccountListViewProps {
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

export const GoogleAccountListView: React.FC<GoogleAccountListViewProps> = ({
  account,
  onManageListings,
  onReauth,
  onDeleteAccount,
  onRefreshAccount,
  isRefreshing,
}) => {
  const { t } = useI18nNamespace("Settings/googleAccountListView");
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteAccount?.(account.id, account.name, account.email);
  };

  return (
    <TableRow
      className="hover:bg-gray-50 cursor-pointer"
      onClick={handleCardClick}
    >
      <TableCell>
        <div className="flex items-center space-x-3">
          <GoogleAccountAvatar name={account.name} avatar={account.avatar} />
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {account.name}
            </h3>
            <p className="text-gray-500 text-xs truncate">{account.email}</p>
          </div>
          {account.isDisabled ? (
            <div className="bg-red-200 rounded-xl font-medium text-red-500 px-2 py-1 text-[9px] flex-shrink-0">
              {t("googleAccountListView.status.reauthorization")}
            </div>
          ) : (
            ""
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <span className="font-medium text-gray-900">{account.listings}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="font-medium text-gray-900">
          {account.activeListings}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onManageListings?.(account.id)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("googleAccountListView.actions.manageListings")}
              </DropdownMenuItem>
              {account.isDisabled ? (
                <DropdownMenuItem onClick={handleReauth}>
                  <BookKey className="h-4 w-4 mr-2" />
                  {t("googleAccountListView.actions.reauthorization")}
                </DropdownMenuItem>
              ) : (
                ""
              )}

              <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {t("googleAccountListView.actions.refresh")}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("googleAccountListView.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
