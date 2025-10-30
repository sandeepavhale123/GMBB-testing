import React, { memo, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface Media {
  id: string;
  listingName: string;
  business: string;
  status: string;
  zipcode: string;
  searchUrl: string;
  image: string;
  reason?: string;
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
interface BulkMediaTableSectionProps {
  medias: Media[];
  pagination: Pagination | undefined;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  search: string;
  setSearch: (search: string) => void;
  status: string;
  setStatus: (status: string) => void;
  deleteMedia: (mediaId: string) => Promise<any>;
  refresh: () => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
}
const getStatusVariant = (status: string | null | undefined) => {
  if (!status) return "secondary";
  switch (status.toLowerCase()) {
    case "published":
    case "live":
      return "default";
    case "draft":
      return "secondary";
    case "scheduled":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
};

export const BulkMediaTableSection = memo<BulkMediaTableSectionProps>(
  ({
    medias,
    pagination,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    search,
    setSearch,
    status,
    setStatus,
    deleteMedia,
    refresh,
    searchInput,
    setSearchInput,
  }) => {
    const { t } = useI18nNamespace("BulkMedia/bulkMediaTable");

    const getTranslatedStatus = (status: string) => {
      if (!status) return status;
      // Convert status to lowercase to match JSON keys
      return t(`status.${status.toLowerCase()}`) || status;
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
    const [selectedMedias, setSelectedMedias] = useState<Set<string>>(
      new Set()
    );
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const paginatedMedias = medias;
    const totalPages = pagination?.pages || 1;
    const handleSelectMedia = (mediaId: string, checked: boolean) => {
      const newSelectedMedias = new Set(selectedMedias);
      if (checked) {
        newSelectedMedias.add(mediaId);
      } else {
        newSelectedMedias.delete(mediaId);
      }
      setSelectedMedias(newSelectedMedias);
    };
    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedMedias(new Set(paginatedMedias.map((media) => media.id)));
      } else {
        setSelectedMedias(new Set());
      }
    };
    const handleBulkDelete = () => {
      if (selectedMedias.size > 0) {
        setBulkDeleteDialogOpen(true);
      }
    };
    const handleBulkDeleteConfirm = async () => {
      try {
        for (const mediaId of selectedMedias) {
          await deleteMedia(mediaId);
        }
        toast({
          title: t("toast.successTitle"),
          description: t("toast.successBulkDelete", {
            count: selectedMedias.size,
          }),
          // `${selectedMedias.size} media items deleted successfully`,
        });
        setSelectedMedias(new Set());
        refresh();
      } catch (error) {
        toast({
          title: t("toast.errorTitle"),
          description: t("toast.errorBulkDelete"),
          variant: "destructive",
        });
      }
      setBulkDeleteDialogOpen(false);
    };
    const handleDeleteClick = (mediaId: string) => {
      setDeletingMediaId(mediaId);
      setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = async () => {
      if (deletingMediaId) {
        try {
          await deleteMedia(deletingMediaId);
          toast({
            title: t("toast.successTitle"),
            description: t("toast.successDelete"),
          });
          refresh();
        } catch (error) {
          toast({
            title: t("toast.errorTitle"),
            description: t("toast.errorDelete"),
            variant: "destructive",
          });
        }
      }
      setDeleteDialogOpen(false);
      setDeletingMediaId(null);
    };
    return (
      <div className="space-y-4">
        {/* Bulk Actions */}
        {selectedMedias.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedMedias.size > 1
                ? t("bulkActions.selected_plural", {
                    count: selectedMedias.size,
                  })
                : t("bulkActions.selected", { count: selectedMedias.size })}
              {/* {selectedMedias.size} media{selectedMedias.size > 1 ? "s" : ""}{" "}
              selected */}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="ml-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t("bulkActions.deleteSelected")}
            </Button>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        paginatedMedias.length > 0 &&
                        selectedMedias.size === paginatedMedias.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label={t("table.selectAll")}
                    />
                  </TableHead>
                  <TableHead>{t("table.listingName")}</TableHead>
                  <TableHead>{t("table.zipCode")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead className="w-32 text-right">
                    {t("table.action")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMedias.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("table.noListings")}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMedias.map((media) => (
                    <TableRow key={media.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMedias.has(media.id)}
                          onCheckedChange={(checked) =>
                            handleSelectMedia(media.id, checked as boolean)
                          }
                          aria-label={`Select ${
                            media.listingName || media.business || "media"
                          }`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {media.listingName ||
                            media.business ||
                            t("table.unknown")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {media.zipcode || t("table.na")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {media.status?.toLowerCase() === "failed" && media.reason ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  variant={getStatusVariant(media.status)} 
                                  className="cursor-help"
                                >
                                  {getTranslatedStatus(media.status)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-xs">
                                <p className="text-xs">{media.reason}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Badge variant={getStatusVariant(media.status)}>
                            {getTranslatedStatus(media.status)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="flex justify-end ">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteClick(media.id)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                            title={t("deleteDialog.deleteTitle")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("pagination.showing", {
                from: (currentPage - 1) * itemsPerPage + 1,
                to: Math.min(
                  currentPage * itemsPerPage,
                  pagination?.total || 0
                ),
                total: pagination?.total || 0,
              })}
              {/* Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, pagination?.total || 0)} of{" "}
              {pagination?.total || 0} entries */}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                {t("pagination.previous")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("pagination.page", {
                  current: currentPage,
                  total: totalPages,
                })}
                {/* Page {currentPage} of {totalPages} */}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {t("pagination.next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("bulkDeleteDialog.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedMedias.size > 1
                  ? t("bulkDeleteDialog.description_plural", {
                      count: selectedMedias.size,
                    })
                  : t("bulkDeleteDialog.description", {
                      count: selectedMedias.size,
                    })}
                {/* Are you sure you want to delete {selectedMedias.size} selected
                media{selectedMedias.size > 1 ? "s" : ""}? This action cannot be
                undone. */}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("bulkDeleteDialog.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("bulkDeleteDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("deleteDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);
BulkMediaTableSection.displayName = "BulkMediaTableSection";
