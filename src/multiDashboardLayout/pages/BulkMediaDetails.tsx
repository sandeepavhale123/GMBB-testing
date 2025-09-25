import React, { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBulkMediaDetails } from "@/hooks/useBulkMediaDetails";
import { useBulkMediaSummary } from "@/hooks/useBulkMediaSummary";
import { useDebounce } from "@/hooks/useDebounce";
import { BulkMediaPreviewSection } from "@/components/BulkMedia/BulkMediaPreviewSection";
import { BulkMediaTableSection } from "@/components/BulkMedia/BulkMediaTableSection";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Memoized Filter Section - Stable, doesn't re-render with table updates
const MediaFilterSection = memo(
  ({
    searchInput,
    setSearchInput,
    status,
    setStatus,
  }: {
    searchInput: string;
    setSearchInput: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
  }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkMediaDetails");
    return (
      <div className="flex gap-4">
        <Input
          placeholder={t("filter.searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("filter.statusPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.statusAll")}</SelectItem>
            <SelectItem value="live">{t("filter.statusLive")}</SelectItem>
            <SelectItem value="scheduled">
              {t("filter.statusScheduled")}
            </SelectItem>
            <SelectItem value="failed">{t("filter.statusFailed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

MediaFilterSection.displayName = "MediaFilterSection";

// Memoized Media Table Section - Only re-renders when media data changes
const MediaTableSection = memo(
  ({
    bulkId,
    debouncedSearch,
    status,
  }: {
    bulkId: string;
    debouncedSearch: string;
    status: string;
  }) => {
    const {
      medias,
      pagination,
      loading,
      error,
      deleteMedia,
      refresh,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setSearch,
      setStatus,
    } = useBulkMediaDetails(bulkId);

    const { t } = useI18nNamespace("MultidashboardPages/bulkMediaDetails");

    // Update search and status when props change
    useEffect(() => {
      setSearch(debouncedSearch);
      setCurrentPage(1); // Reset to first page when searching
    }, [debouncedSearch, setSearch, setCurrentPage]);

    useEffect(() => {
      setStatus(status);
      setCurrentPage(1);
    }, [status, setStatus, setCurrentPage]);

    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t("error.preview", { error })}
            {/* Error loading media details: {error} */}
          </p>
          <Button onClick={refresh} className="mt-4">
            {t("error.retry")}
          </Button>
        </div>
      );
    }

    return (
      <BulkMediaTableSection
        medias={medias}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        search={debouncedSearch}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        deleteMedia={deleteMedia}
        refresh={refresh}
        searchInput=""
        setSearchInput={() => {}}
      />
    );
  }
);

MediaTableSection.displayName = "MediaTableSection";

export const BulkMediaDetails: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkMediaDetails");
  const { bulkId } = useParams<{ bulkId: string }>();
  const navigate = useNavigate();

  // Filter states - managed at parent level to prevent re-renders
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Get bulk media data for preview (stable, doesn't change with search)
  const {
    bulkMedia: summaryBulkMedia,
    loading: previewLoading,
    error: previewError,
  } = useBulkMediaSummary(bulkId || "");

  // Use empty hook call for the table data to avoid duplicate API calls
  const {} = useBulkMediaDetails(bulkId || "");

  const handleBack = () => {
    navigate("/main-dashboard/bulk-media");
  };

  if (previewLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-muted rounded"></div>
          <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (previewError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {t("error.preview", { error: previewError })}
          {/* Error loading media details: {previewError} */}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          {t("error.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Page Header - Minimal spacing */}
      <div className="mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("page.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("page.subtitle")}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Media Preview (Static, never re-renders) */}
        <BulkMediaPreviewSection bulkMedia={summaryBulkMedia} />

        {/* Right Column - Filter Section + Dynamic Table Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Section - Stable, doesn't re-render with table */}
          <MediaFilterSection
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            status={status}
            setStatus={setStatus}
          />

          {/* Table Section - Only re-renders when data changes */}
          <MediaTableSection
            bulkId={bulkId || ""}
            debouncedSearch={debouncedSearch}
            status={status}
          />
        </div>
      </div>
    </div>
  );
};
