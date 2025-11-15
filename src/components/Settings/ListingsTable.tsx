import React from "react";
import { Eye, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface Listing {
  id: string;
  name: string;
  store_code: string;
  group_name: string;
  state: string;
  status: "verified" | "pending" | "suspended";
  isActive: boolean;
  profile_image?: string;
  address: string;
  zipcode: string;
}

interface ListingsTableProps {
  listings: Listing[];
  onViewListing?: (listingId: string) => void;
  onToggleListing?: (listingId: string, isActive: boolean) => Promise<void>;
  loadingStates?: Record<string, boolean>;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({
  listings,
  onViewListing,
  onToggleListing,
  loadingStates = {},
}) => {
  const { t } = useI18nNamespace("Settings/listingsTable");
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateAddress = (address: string, maxLength = 30) => {
    return address.length > maxLength
      ? `${address.substring(0, maxLength)}...`
      : address;
  };

  const handleToggle = async (listingId: string, checked: boolean) => {
    if (onToggleListing) {
      try {
        await onToggleListing(listingId, checked);
      } catch (error) {
        // Error is already handled in the hook, no need to do anything here
        // console.error("Toggle failed:", error);
      }
    }
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">{t("listingsTable.noListings")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">
              {t("listingsTable.headers.business")}
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              {t("listingsTable.headers.storeCode")}
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              {t("listingsTable.headers.category")}
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              {t("listingsTable.headers.location")}
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              {t("listingsTable.headers.status")}
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              {t("listingsTable.headers.state")}
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center">
              <div className="flex items-center justify-center gap-1.5">
                {t("listingsTable.headers.actions")}
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center"
                      >
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="center"
                      className="max-w-[200px] text-center"
                    >
                      <p>{t("listingsTable.tootltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => {
            const isLoading = loadingStates[listing.id];

            return (
              <TableRow key={listing.id} className="hover:bg-gray-50">
                <TableCell>
                  <div 
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => onViewListing?.(listing.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={listing.profile_image} alt="listing-profile" />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                        {getInitials(listing.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      {listing.name &&
                        truncateAddress(listing.name) &&
                        truncateAddress(listing.name) !== "null" &&
                        !truncateAddress(listing.name).includes("null") && (
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                            {truncateAddress(listing.name)}
                          </p>
                        )}

                      {listing.address &&
                        truncateAddress(listing.address) &&
                        truncateAddress(listing.address) !== "null" &&
                        !truncateAddress(listing.address).includes("null") && (
                          <p className="text-sm text-gray-500 group-hover:text-blue-600 truncate transition-colors">
                            {truncateAddress(listing.address)}
                          </p>
                        )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-gray-900">
                    {listing.store_code || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {listing.group_name || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {listing.zipcode || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(
                      listing.status
                    )} border-0 font-medium min-w-max`}
                  >
                    {t(`listingsTable.status.${listing.status}`)}
                    {/* {listing.status.charAt(0).toUpperCase() +
                      listing.status.slice(1)} */}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {listing.state || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <Skeleton className="h-6 w-11 rounded-full" />
                    ) : (
                      <Switch
                        checked={listing.isActive}
                        onCheckedChange={(checked) =>
                          handleToggle(listing.id, checked)
                        }
                        disabled={isLoading}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
