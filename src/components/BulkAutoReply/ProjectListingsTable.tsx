import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Trash2, X, Loader2 } from "lucide-react";
import {
  useDeleteListingFromProjectMutation,
  useAddListingsToProjectMutation,
} from "@/api/bulkAutoReplyApi";
import { toast } from "@/hooks/use-toast";
import { BulkReplyListingSelector } from "./BulkReplyListingSelector";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface Location {
  id: string;
  locationName: string;
  zipCode: string;
  google_account_id: string;
  name: string;
  setting: string;
  setting_type: string;
}

interface ProjectListingsTableProps {
  listingDetails?: Location[];
  projectId?: string;
  onListingDeleted?: () => void;
}

export const ProjectListingsTable: React.FC<ProjectListingsTableProps> = ({
  listingDetails = [],
  projectId,
  onListingDeleted,
}) => {
  const { t } = useI18nNamespace("BulkAutoReply/projectListings");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [deleteListingFromProject] = useDeleteListingFromProjectMutation();
  const [addListingsToProject, { isLoading: isAddingListings }] =
    useAddListingsToProjectMutation();

  const filteredLocations = listingDetails.filter((location) =>
    location.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, endIndex);

  const handleDeleteLocation = async (locationId: string) => {
    if (!projectId) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorProjectId"),
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteListingFromProject({
        projectId: parseInt(projectId),
        listingIds: [parseInt(locationId)],
      }).unwrap();

      toast({
        title: t("toast.successTitle"),
        description: t("toast.successDelete"),
        variant: "default",
      });

      onListingDeleted?.();
    } catch (error) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorDelete"),
        variant: "destructive",
      });
    }
  };

  const handleAddListings = async () => {
    if (!projectId || selectedListings.length === 0) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorAdd"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await addListingsToProject({
        projectId: parseInt(projectId),
        listingIds: selectedListings.map((id) => parseInt(id)),
      }).unwrap();

      toast({
        title: t("toast.successTitle"),
        description:
          response.message ||
          t("toast.successAdd", { count: selectedListings.length }),
        // `${selectedListings.length} listing(s) added to project successfully`,
        variant: "default",
      });

      setSelectedListings([]);
      setShowAddModal(false);
      onListingDeleted?.();
    } catch (error) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorAddFailed"),
        variant: "destructive",
      });
    }
  };

  const handleCancelAdd = () => {
    setSelectedListings([]);
    setShowAddModal(false);
  };

  return (
    <>
      <Card>
        <CardContent className="mt-[20px]">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("addLocationButton")}
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.locationName")}</TableHead>
                  <TableHead>{t("table.zipCode")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.action")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLocations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("table.noLocations")}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.locationName}
                      </TableCell>
                      <TableCell>{location.zipCode || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("removeLocation.title")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("removeLocation.description", {
                                  locationName: location.locationName,
                                })}
                                {/* Are you sure you want to remove "
                                {location.locationName}" from this project? This
                                action cannot be undone. */}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("removeLocation.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteLocation(location.id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t("removeLocation.remove")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Listings Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("addListingsModal.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <BulkReplyListingSelector
              selectedListings={selectedListings}
              onListingsChange={setSelectedListings}
              projectId={projectId}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCancelAdd}>
                {t("addListingsModal.cancel")}
              </Button>
              <Button
                onClick={handleAddListings}
                disabled={selectedListings.length === 0 || isAddingListings}
              >
                {isAddingListings ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("addListingsModal.adding")}
                  </>
                ) : (
                  t("addListingsModal.addSelected", {
                    count: selectedListings.length,
                  })
                  // `Add Selected (${selectedListings.length})`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
