import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { useBulkImportDetails } from "@/hooks/useBulkImportDetails";
import { useDebounce } from "@/hooks/useDebounce";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { ListingSidebar } from "./components/ListingSidebar";

const PostPreviewModal = lazy(() =>
  import("@/components/Posts/PostPreviewModal").then((module) => ({
    default: module.PostPreviewModal,
  }))
);

// Helper function to get status variant
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "live":
    case "published":
      return "default";
    case "scheduled":
      return "secondary";
    case "draft":
      return "outline";
    default:
      return "outline";
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString || dateString === "01/01/1970 12:00 AM") {
    return "Not scheduled";
  }
  return dateString;
};

export const BulkImportDetails: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkImportDetails");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPostForPreview, setSelectedPostForPreview] =
    useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Local state for posts search with debouncing
  const [localPostSearch, setLocalPostSearch] = useState("");
  const debouncedPostSearch = useDebounce(localPostSearch, 300);

  const historyId = parseInt(id || "0", 10);

  const {
    listings,
    listingsLoading,
    listingsError,
    noListingsFound,
    posts,
    postsLoading,
    postsError,
    postsPagination,
    selectedListingId,
    setListingSearch,
    setPostSearch,
    setSelectedListingId,
    setPostsPage,
    deletePost,
    isDeletingPost,
  } = useBulkImportDetails(historyId);

  // Sync debounced post search value to hook
  useEffect(() => {
    setPostSearch(debouncedPostSearch);
  }, [debouncedPostSearch, setPostSearch]);

  const handleBack = () => {
    navigate("/main-dashboard/import-post-csv");
  };

  const handleViewPost = (postId: string) => {
    const post = filteredPosts.find((p) => p.id === postId);
    if (post) {
      if (post.search_url) {
        window.open(post.search_url, "_blank");
      } else {
        const transformedData = {
          title:
            post.event_title ||
            post.text?.split(" ").slice(0, 8).join(" ") ||
            "Post Preview",
          description: post.text || "",
          ctaButton: post.action_type || "Learn More",
          ctaUrl: post.url || "#",
          image: post.image || null,
          platforms: post.posttype ? [post.posttype] : [],
        };
        setSelectedPostForPreview(transformedData);
        setIsPreviewModalOpen(true);
      }
    }
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedPostForPreview(null);
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (postToDelete) {
      await deletePost(postToDelete);
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  // Filter posts based on local search for immediate feedback
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.text.toLowerCase().includes(localPostSearch.toLowerCase()) ||
      (post.tags &&
        post.tags.toLowerCase().includes(localPostSearch.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        {t("bulkImportDetails.title")}
      </h1>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="col-span-4 hidden lg:block">
          <ListingSidebar
            listings={listings}
            loading={listingsLoading}
            error={listingsError}
            noListingsFound={noListingsFound}
            selectedListingId={selectedListingId}
            onSearch={setListingSearch}
            onListingSelect={setSelectedListingId}
          />
        </div>

        {/* Mobile Sidebar Summary - Visible only on mobile */}
        <div className="lg:hidden col-span-12 mb-4">
          <ListingSidebar
            listings={listings}
            loading={listingsLoading}
            error={listingsError}
            noListingsFound={noListingsFound}
            selectedListingId={selectedListingId}
            onSearch={setListingSearch}
            onListingSelect={setSelectedListingId}
          />
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {!selectedListingId ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {listingsLoading
                    ? t("bulkImportDetails.loadingListings")
                    : t("bulkImportDetails.selectListingPrompt")}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Search with debouncing */}
              <div>
                <Input
                  placeholder={t("bulkImportDetails.posts.searchPlaceholder")}
                  value={localPostSearch}
                  onChange={(e) => setLocalPostSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Posts Table */}
              <Card>
                <CardContent className="p-0">
                  {postsLoading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <div className="text-muted-foreground">
                        {t("bulkImportDetails.posts.loading")}
                      </div>
                    </div>
                  ) : postsError ? (
                    <div className="p-8 text-center">
                      <div className="text-destructive font-medium mb-2">
                        {t("bulkImportDetails.posts.errorLoading")}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {postsError}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="w-12 text-muted-foreground">
                              #
                            </TableHead>
                            <TableHead className="w-16 text-muted-foreground">
                              {t("bulkImportDetails.posts.image")}
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                              {t("bulkImportDetails.posts.postContent")}
                            </TableHead>
                            <TableHead className="w-20 text-muted-foreground">
                              {t("bulkImportDetails.posts.status")}
                            </TableHead>
                            <TableHead className="w-40 text-muted-foreground">
                              {t("bulkImportDetails.posts.date")}
                            </TableHead>
                            <TableHead className="w-24 text-muted-foreground">
                              {t("bulkImportDetails.posts.action")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPosts.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="h-24 text-center text-muted-foreground"
                              >
                                {t("bulkImportDetails.posts.noPostsFound")}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPosts.map((post, index) => (
                              <TableRow key={post.id} className="border-border">
                                <TableCell className="text-muted-foreground">
                                  {index + 1}
                                </TableCell>
                                <TableCell>
                                  {post.image ? (
                                    <img
                                      src={post.image}
                                      alt="Post"
                                      className="w-12 h-12 rounded-lg object-cover border border-border"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                                      <span className="text-muted-foreground text-xs">
                                        {t("bulkImportDetails.posts.noImage")}
                                      </span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium text-foreground text-sm line-clamp-2">
                                      {post.text || "No content"}
                                    </div>
                                    {post.tags && (
                                      <div className="text-xs text-muted-foreground">
                                        Tags: {post.tags}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusVariant(post.state)}>
                                    {post.state.charAt(0).toUpperCase() +
                                      post.state.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-foreground">
                                  {formatDate(post.publishDate)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {post.search_url && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewPost(post.id)}
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeletePost(post.id)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                      disabled={isDeletingPost}
                                    >
                                      {isDeletingPost ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {postsPagination.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4">
                          <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            {t("bulkImportDetails.pagination.showingPosts", {
                              start:
                                (postsPagination.page - 1) *
                                  postsPagination.limit +
                                1,
                              end: Math.min(
                                postsPagination.page * postsPagination.limit,
                                postsPagination.total
                              ),
                              total: postsPagination.total,
                            })}
                          </p>
                          <div className="flex items-center gap-2 order-1 sm:order-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPostsPage(postsPagination.page - 1)
                              }
                              disabled={!postsPagination.hasPrev}
                              className="flex items-center gap-1"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {t("bulkImportDetails.pagination.previous")}
                              </span>
                            </Button>
                            <span className="text-sm text-muted-foreground px-2">
                              {t("bulkImportDetails.pagination.pageOf", {
                                current: postsPagination.page,
                                totalPages: postsPagination.totalPages,
                              })}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPostsPage(postsPagination.page + 1)
                              }
                              disabled={!postsPagination.hasNext}
                              className="flex items-center gap-1"
                            >
                              <span className="hidden sm:inline">
                                {t("bulkImportDetails.pagination.next")}
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Post Preview Modal */}
      {selectedPostForPreview && (
        <Suspense fallback={<div>Loading...</div>}>
          <PostPreviewModal
            isOpen={isPreviewModalOpen}
            onClose={handleClosePreview}
            data={selectedPostForPreview}
          />
        </Suspense>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("bulkImportDetails.posts.deletePost")}{" "}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("bulkImportDetails.posts.deleteConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isDeletingPost}>
              {t("bulkImportDetails.posts.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePost}
              disabled={isDeletingPost}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeletingPost ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("bulkImportDetails.posts.deleting")}
                </>
              ) : (
                t("bulkImportDetails.posts.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
