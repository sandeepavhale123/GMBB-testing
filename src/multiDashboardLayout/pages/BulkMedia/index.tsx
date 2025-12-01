import React, { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBulkMediaOverview } from "@/hooks/useBulkMediaOverview";
import { MediaUploadModal } from "@/components/Media/MediaUploadModal";
import { deleteBulkMedia } from "@/api/mediaApi";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

import { BulkMediaSkeleton } from "./components/BulkMediaSkeleton";
import { BulkMediaEmptyState } from "./components/BulkMediaEmptyState";
import { BulkMediaCard } from "./components/BulkMediaCard";
import { BulkMediaPagination } from "./components/BulkMediaPagination";
import { DeleteMediaDialog } from "./components/DeleteMediaDialog";

export const BulkMedia: React.FC = React.memo(() => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkMedia");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    bulkMedia,
    loading,
    error,
    pagination,
    refresh,
    goToPage,
    nextPage,
    prevPage,
  } = useBulkMediaOverview();

  const handleUploadSuccess = useCallback(() => {
    refresh();
    setShowUploadModal(false);
  }, [refresh]);

  const handleDeleteClick = useCallback(
    (item: { id: string; category: string }) => {
      setItemToDelete({
        id: item.id,
        title: item.category || "Untitled",
      });
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete.id);
    try {
      const response = await deleteBulkMedia({
        bulkId: parseInt(itemToDelete.id),
      });
      if (response.code === 200) {
        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });
        refresh();
      } else {
        throw new Error(response.message || "Failed to delete media");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.description"),
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, refresh, t]);

  const handleOpenUploadModal = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("header.title")}
          </h1>
          <p className="text-muted-foreground">{t("header.subtitle")}</p>
        </div>
        <Button
          onClick={handleOpenUploadModal}
          className="self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 mr-1" />
          {t("buttons.upload")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 text-sm">
                {t("messages.errorLoading", { error })}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                className="mt-2"
              >
                {t("buttons.tryAgain")}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <BulkMediaSkeleton count={3} />
            ) : bulkMedia.length === 0 ? (
              <BulkMediaEmptyState onUploadClick={handleOpenUploadModal} />
            ) : (
              bulkMedia.map((media) => (
                <BulkMediaCard
                  key={media.id}
                  media={media}
                  deletingId={deletingId}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            )}
          </div>

          {!loading && !error && pagination && (
            <BulkMediaPagination
              pagination={pagination}
              onGoToPage={goToPage}
              onPrevPage={prevPage}
              onNextPage={nextPage}
            />
          )}
        </div>
      </div>

      <MediaUploadModal
        isOpen={showUploadModal}
        onClose={handleCloseUploadModal}
        onUpload={handleUploadSuccess}
        isBulkUpload={true}
        enableMultiSelect={false}
        maxSelectionLimit={1}
      />

      <DeleteMediaDialog
        open={deleteDialogOpen}
        itemTitle={itemToDelete?.title}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
});

BulkMedia.displayName = "BulkMedia";
