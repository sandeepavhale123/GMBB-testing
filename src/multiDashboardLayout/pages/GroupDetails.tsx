import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LocationGroup } from "@/api/listingsGroupsApi";
import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { toast } from "@/hooks/use-toast";
import { AddListingToGroupModal } from "@/components/Groups/AddListingToGroupModal";
import axiosInstance from "@/api/axiosInstance";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface GroupDetailsData {
  groupName: string;
  listings: LocationGroup[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const GroupDetails: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/groupDetails");
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] =
    useState<LocationGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupDetailsData, setGroupDetailsData] =
    useState<GroupDetailsData | null>(null);
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);

  const limit = 10;

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId, page, search]);

  const fetchGroupDetails = async () => {
    if (!groupId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/get-group-details", {
        groupId: Number(groupId),
        page,
        limit,
        search,
      });

      if (response.data.code === 200) {
        setGroupDetailsData(response.data.data);
      } else {
        setError("Failed to load group details");
      }
    } catch (err) {
      setError("Failed to load group details");
      console.error("Error fetching group details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleDeleteLocation = (location: LocationGroup) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLocation = async () => {
    if (locationToDelete && groupId) {
      try {
        const response = await axiosInstance.post(
          "/remove-listing-from-group",
          {
            groupId: Number(groupId),
            listingIds: [Number(locationToDelete.id)],
          }
        );

        if (response.data.code === 200) {
          toast({
            title: t("toast.successTitle"),
            description: t("toast.removeSuccess", {
              locationName: locationToDelete.locationName,
            }),
            // `${locationToDelete.locationName} has been removed from the group.`,
          });
          setDeleteDialogOpen(false);
          setLocationToDelete(null);
          fetchGroupDetails();
        } else {
          throw new Error(response.data.message || "Failed to remove location");
        }
      } catch (error: any) {
        toast({
          title: t("toast.errorTitle"),
          description:
            error?.response?.data?.message ||
            error?.message ||
            t("toast.removeError"),
          variant: "destructive",
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchGroupDetails}>{t("retry")}</Button>
      </div>
    );
  }

  const groupName = groupDetailsData?.groupName || "Group Details";
  const locations = groupDetailsData?.listings || [];
  const pagination = groupDetailsData?.pagination;

  return (
    <div className="space-y-6 py-4 px-6">
      {/* Header with back button and title */}
      <div className=" space-x-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 flex-1">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/main-dashboard/settings/manage-groups")}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 "
            >
              <span>{t("back")}</span>
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">
              {groupName}
            </h1>
          </div>
          <Button
            onClick={() => setIsAddListingModalOpen(true)}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{t("addListing")}</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {/* Locations Table */}
      <Card>
        <CardContent className="p-0">
          {locations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search ? t("noSearchResults") : t("noLocations")}
            </div>
          ) : (
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>{t("table.locationName")}</TableHead>
                    <TableHead>{t("table.zipCode")}</TableHead>
                    <TableHead>{t("table.email")}</TableHead>
                    <TableHead className="w-[100px]">
                      {t("table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.locationName}
                      </TableCell>
                      <TableCell>{location.zipCode}</TableCell>
                      <TableCell>
                        {location.email || t("table.notAvailable")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLocation(location)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("pagination.showing", {
                      from: (page - 1) * limit + 1,
                      to: Math.min(page * limit, pagination.total),
                      total: pagination.total,
                    })}
                    {/* Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, pagination.total)} of{" "}
                    {pagination.total} locations */}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      {t("pagination.previous")}
                    </Button>
                    <span className="text-sm">
                      {t("pagination.page", {
                        current: page,
                        pages: pagination.pages,
                      })}
                      {/* Page {page} of {pagination.pages} */}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= pagination.pages}
                    >
                      {t("pagination.next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", {
                locationName: locationToDelete?.locationName,
              })}
              {/* Are you sure you want to remove "{locationToDelete?.locationName}"
              from this group? This action cannot be undone. */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLocation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Listing Modal */}
      <AddListingToGroupModal
        isOpen={isAddListingModalOpen}
        onClose={() => setIsAddListingModalOpen(false)}
        groupId={parseInt(groupId || "0")}
        groupName={groupName || ""}
        onSuccess={fetchGroupDetails}
      />
    </div>
  );
};
