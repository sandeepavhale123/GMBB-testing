import React, { useState, useEffect, memo, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { useBulkPostDetails } from "@/hooks/useBulkPostDetails";
import { useBulkPostSummary } from "@/hooks/useBulkPostSummary";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Memoized Post Preview Component - Stable, doesn't re-render on search
const PostPreview = memo(({ bulkPost }: { bulkPost: any }) => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkPostDetails");

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy • hh:mm a");
    } catch (error) {
      return dateString;
    }
  };

  if (!bulkPost) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Image */}
        {bulkPost?.media?.images && (
          <div className="w-full">
            <img
              src={bulkPost.media.images}
              alt="Post media"
              className="w-full h-48 object-cover rounded-lg border border-border"
            />
          </div>
        )}

        {/* Title */}
        {bulkPost?.title && (
          <h3 className="text-xl font-bold text-foreground">
            {bulkPost.title}
          </h3>
        )}

        {/* Description */}
        {bulkPost?.content && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {bulkPost.content.replace(/<[^>]*>/g, "")}
          </div>
        )}

        {/* CTA Button */}
        {bulkPost?.actionType && bulkPost.actionType.trim() !== "" && (
          <Button
            className="w-full"
            onClick={() =>
              bulkPost?.ctaUrl && window.open(bulkPost.ctaUrl, "_blank")
            }
          >
            {bulkPost.actionType}
          </Button>
        )}

        {/* Date */}
        {bulkPost?.publishDate && (
          <div className="text-sm text-muted-foreground">
            {t("bulkPostDetails.postPreview.postedOn")}{" "}
            {formatDateTime(bulkPost.publishDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PostPreview.displayName = "PostPreview";

// Memoized Table Component
const PostsTable = memo(
  ({
    posts,
    selectedPosts,
    onSelectPost,
    onSelectAll,
    onViewPost,
    onDeleteClick,
  }: {
    posts: any[];
    selectedPosts: Set<string>;
    onSelectPost: (postId: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onViewPost: (post: any) => void;
    onDeleteClick: (postId: string) => void;
  }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkPostDetails");
    const getTranslatedStatus = (status: string) => {
      if (!status) return status;
      // Convert status to lowercase to match JSON keys
      return t(`bulkPostDetails.status.${status.toLowerCase()}`);
    };
    const getStatusVariant = (status: string | null | undefined) => {
      if (!status) return "secondary";
      switch (status.toLowerCase()) {
        case t("bulkPostDetails.status.published"):
        case t("bulkPostDetails.status.live"):
          return "default";
        case t("bulkPostDetails.status.draft"):
          return "secondary";
        case t("bulkPostDetails.status.scheduled"):
          return "outline";
        case t("bulkPostDetails.status.failed"):
          return "destructive";
        default:
          return "secondary";
      }
    };

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      posts.length > 0 && selectedPosts.size === posts.length
                    }
                    onCheckedChange={onSelectAll}
                    aria-label="Select all posts"
                  />
                </TableHead>
                <TableHead>{t("bulkPostDetails.table.listingName")}</TableHead>
                <TableHead>{t("bulkPostDetails.table.zipCode")}</TableHead>
                <TableHead>{t("bulkPostDetails.table.status")}</TableHead>
                <TableHead className="w-32 text-right">
                  {t("bulkPostDetails.table.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("bulkPostDetails.table.noListings")}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPosts.has(post.id)}
                        onCheckedChange={(checked) =>
                          onSelectPost(post.id, checked as boolean)
                        }
                        aria-label={`Select ${
                          post.listingName ||
                          post.business ||
                          t("bulkPostDetails.table.post")
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {post.listingName ||
                          post.business ||
                          t("bulkPostDetails.table.unknown")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {post.zipcode || t("bulkPostDetails.table.na")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(post.status)}>
                        {getTranslatedStatus(post.status)}
                        {/* {post.status} */}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        {post.status?.toLowerCase() ===
                          t("bulkPostDetails.status.live") && (
                          <button
                            onClick={() => onViewPost(post)}
                            className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                            title={t("bulkPostDetails.postPreview.viewPost")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteClick(post.id)}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                          title={t("bulkPostDetails.postPreview.deletePost")}
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
    );
  }
);

PostsTable.displayName = "PostsTable";

// Memoized Table Section - Only re-renders when table data changes
const TableSection = memo(
  ({
    bulkId,
    selectedPosts,
    setSelectedPosts,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deletingPostId,
    setDeletingPostId,
    bulkDeleteDialogOpen,
    setBulkDeleteDialogOpen,
    searchQuery,
    statusFilter,
  }: {
    bulkId: string;
    selectedPosts: Set<string>;
    setSelectedPosts: (posts: Set<string>) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    deletingPostId: string | null;
    setDeletingPostId: (id: string | null) => void;
    bulkDeleteDialogOpen: boolean;
    setBulkDeleteDialogOpen: (open: boolean) => void;
    searchQuery: string;
    statusFilter: string;
  }) => {
    const {
      posts,
      pagination,
      loading: detailsLoading,
      error: detailsError,
      deletePost,
      refresh,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      updateSearchQuery,
      updateStatusFilter,
    } = useBulkPostDetails(bulkId);

    const { t } = useI18nNamespace("MultidashboardPages/bulkPostDetails");

    // Update search and status when props change
    useEffect(() => {
      updateSearchQuery(searchQuery);
    }, [searchQuery, updateSearchQuery]);

    useEffect(() => {
      updateStatusFilter(statusFilter);
    }, [statusFilter, updateStatusFilter]);

    // Reset page when status filter changes
    useEffect(() => {
      setCurrentPage(1);
    }, [statusFilter, setCurrentPage]);

    // Use posts directly since filtering and pagination are handled server-side
    const paginatedPosts = posts;
    const totalPages = pagination?.pages || 1;

    const handleSelectPost = (postId: string, checked: boolean) => {
      const newSelectedPosts = new Set(selectedPosts);
      if (checked) {
        newSelectedPosts.add(postId);
      } else {
        newSelectedPosts.delete(postId);
      }
      setSelectedPosts(newSelectedPosts);
    };

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedPosts(new Set(paginatedPosts.map((post) => post.id)));
      } else {
        setSelectedPosts(new Set());
      }
    };

    const handleBulkDelete = () => {
      if (selectedPosts.size > 0) {
        setBulkDeleteDialogOpen(true);
      }
    };

    const handleBulkDeleteConfirm = async () => {
      try {
        for (const postId of selectedPosts) {
          await deletePost(postId);
        }
        toast({
          title: t("bulkPostDetails.messages.successTitle"),
          description: t("bulkPostDetails.messages.successBulkDelete", {
            count: selectedPosts.size,
          }),
          // `${selectedPosts.size} t("bulkPostDetails.messages.successDelete")`,
        });
        setSelectedPosts(new Set());
        refresh();
      } catch (error) {
        toast({
          title: t("bulkPostDetails.messages.errorTitle"),
          description: t("bulkPostDetails.messages.errorBulkDelete"),
          variant: "destructive",
        });
      }
      setBulkDeleteDialogOpen(false);
    };

    const handleDeleteClick = (postId: string) => {
      setDeletingPostId(postId);
      setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
      if (deletingPostId) {
        try {
          await deletePost(deletingPostId);
          toast({
            title: t("bulkPostDetails.messages.successTitle"),
            description: t("bulkPostDetails.messages.successDelete"),
          });
          refresh();
        } catch (error) {
          toast({
            title: t("bulkPostDetails.messages.errorTitle"),
            description: t("bulkPostDetails.messages.errorDelete"),
            variant: "destructive",
          });
        }
      }
      setDeleteDialogOpen(false);
      setDeletingPostId(null);
    };

    const handleViewPost = (post: any) => {
      if (post.searchUrl) {
        window.open(post.searchUrl, "_blank");
      }
    };

    if (detailsLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      );
    }

    if (detailsError) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t("bulkPostDetails.messages.errorDetails", {
              error: detailsError,
            })}
            {/* Error loading post details: {detailsError} */}
          </p>
          <Button onClick={refresh} className="mt-4">
            {t("bulkPostDetails.messages.tryAgain")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Bulk Actions */}
        {selectedPosts.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedPosts.size > 1
                ? t("bulkPostDetails.bulkActions.selected_plural", {
                    count: selectedPosts.size,
                  })
                : t("bulkPostDetails.bulkActions.selected", {
                    count: selectedPosts.size,
                  })}
              {/* {selectedPosts.size} post{selectedPosts.size > 1 ? "s" : ""}{" "}
              selected */}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="ml-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t("bulkPostDetails.bulkActions.deleteSelected")}
            </Button>
          </div>
        )}

        {/* Posts Table */}
        <PostsTable
          posts={paginatedPosts}
          selectedPosts={selectedPosts}
          onSelectPost={handleSelectPost}
          onSelectAll={handleSelectAll}
          onViewPost={handleViewPost}
          onDeleteClick={handleDeleteClick}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("bulkPostDetails.pagination.showing", {
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                {t("bulkPostDetails.pagination.previous")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("bulkPostDetails.pagination.page", {
                  current: currentPage,
                  totalPages,
                })}
                {/* Page {currentPage} of {totalPages} */}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {t("bulkPostDetails.pagination.next")}
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
              <AlertDialogTitle>
                {t("bulkPostDetails.dialogs.bulkDelete.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("bulkPostDetails.dialogs.bulkDelete.description", {
                  count: selectedPosts.size,
                })}
                {/* Are you sure you want to delete {selectedPosts.size} selected
                post{selectedPosts.size > 1 ? "s" : ""}? This action cannot be
                undone. */}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("bulkPostDetails.dialogs.bulkDelete.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("bulkPostDetails.dialogs.bulkDelete.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("bulkPostDetails.dialogs.deleteSingle.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("bulkPostDetails.dialogs.deleteSingle.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {" "}
                {t("bulkPostDetails.dialogs.deleteSingle.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("bulkPostDetails.dialogs.deleteSingle.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);

TableSection.displayName = "TableSection";

// Memoized Filter Section - Stable, doesn't re-render with table updates
const FilterSection = memo(
  ({
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
  }: {
    searchInput: string;
    setSearchInput: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
  }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkPostDetails");
    return (
      <div className="flex gap-4">
        <Input
          placeholder={t("bulkPostDetails.filter.searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("bulkPostDetails.filter.postStatus")}
            </SelectItem>
            <SelectItem value="live">
              {" "}
              {t("bulkPostDetails.filter.live")}
            </SelectItem>
            <SelectItem value="scheduled">
              {" "}
              {t("bulkPostDetails.filter.scheduled")}
            </SelectItem>
            <SelectItem value="failed">
              {" "}
              {t("bulkPostDetails.filter.failed")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

FilterSection.displayName = "FilterSection";

export const BulkPostDetails: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkPostDetails");
  const { bulkId } = useParams<{ bulkId: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Filter states - managed at parent level to prevent re-renders
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Use the new hook for summary data - stable, doesn't change on search
  const {
    bulkPost,
    loading: summaryLoading,
    error: summaryError,
  } = useBulkPostSummary(bulkId || "");

  if (summaryLoading) {
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

  if (summaryError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {t("bulkPostDetails.messages.errorDetails", { error: summaryError })}
          {/* Error loading post details: {summaryError} */}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          {t("bulkPostDetails.messages.tryAgain")}
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
            {t("bulkPostDetails.header.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("bulkPostDetails.header.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Post Preview - Stable, never re-renders */}
        <div className="lg:col-span-1">
          <PostPreview bulkPost={bulkPost} />
        </div>

        {/* Right Column - Filter Section + Dynamic Table Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Section - Stable, doesn't re-render with table */}
          <FilterSection
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Table Section - Only re-renders when data changes */}
          <TableSection
            bulkId={bulkId || ""}
            selectedPosts={selectedPosts}
            setSelectedPosts={setSelectedPosts}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            deletingPostId={deletingPostId}
            setDeletingPostId={setDeletingPostId}
            bulkDeleteDialogOpen={bulkDeleteDialogOpen}
            setBulkDeleteDialogOpen={setBulkDeleteDialogOpen}
            searchQuery={debouncedSearch}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </div>
  );
};
