import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MediaFilters } from "./MediaFilters";
import { EnhancedMediaCard } from "./EnhancedMediaCard";
import { MediaPagination } from "./MediaPagination";
import { MediaTabs } from "./MediaTabs";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: "image" | "video";
  url: string;
  uploadDate: string;
  size: string;
  status: "Live" | "Schedule" | "Failed";
  category: string;
  isScheduled: boolean;
  reason?: string;
}

interface MediaLibraryCardProps {
  mediaTypeTab: string;
  onMediaTypeTabChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
  isLoading: boolean;
  mediaItems: MediaItem[];
  onViewImage: (item: MediaItem) => void;
  onEditMedia: (id: string) => void;
  onDeleteImage: (id: string) => void;
  onDownloadMedia: (item: MediaItem) => void;
  onSetAsCover: (id: string) => void;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const MediaLibraryCard: React.FC<MediaLibraryCardProps> = ({
  mediaTypeTab,
  onMediaTypeTabChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  isLoading,
  mediaItems,
  onViewImage,
  onEditMedia,
  onDeleteImage,
  onDownloadMedia,
  onSetAsCover,
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const { t } = useI18nNamespace("Media/mediaLibraryCard");
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-gray-700">
            {t("mediaLibraryCard.title")}
          </CardTitle>
          <MediaTabs
            activeTab={mediaTypeTab}
            onTabChange={onMediaTypeTabChange}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <MediaFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          category={categoryFilter}
          onCategoryChange={onCategoryChange}
          status={statusFilter}
          onStatusChange={onStatusChange}
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          sortOrder={sortOrder}
          onSortOrderChange={onSortOrderChange}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">{t("mediaLibraryCard.loading")}</div>
          </div>
        ) : (
          <>
            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">
              {mediaItems.map((item) => (
                <EnhancedMediaCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  url={item.url}
                  type={item.type}
                  size={item.size}
                  uploadDate={item.uploadDate}
                  status={item.status}
                  views={item.views}
                  isScheduled={item.isScheduled}
                  reason={item.reason}
                  onView={() => onViewImage(item)}
                  onEdit={() => onEditMedia(item.id)}
                  onDelete={() => onDeleteImage(item.id)}
                  onDownload={() => onDownloadMedia(item)}
                  onSetAsCover={() => onSetAsCover(item.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {mediaItems.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>{t("mediaLibraryCard.empty")}</p>
              </div>
            )}

            {/* Pagination */}
            <MediaPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPageChange={onPageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
