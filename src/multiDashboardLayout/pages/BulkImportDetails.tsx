import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { BulkListing } from "@/api/csvApi";
import { PostPreviewModal } from "@/components/Posts/PostPreviewModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { current } from "@reduxjs/toolkit";

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

  // Return the date string as-is without formatting
  return dateString;
};

export const BulkImportDetails: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/bulkImportDetails");
  const ListingSidebar = ({
    listings,
    loading,
    error,
    noListingsFound,
    selectedListingId,
    onSearch,
    onListingSelect,
  }: {
    listings: BulkListing[];
    loading: boolean;
    error: string | null;
    noListingsFound: boolean;
    selectedListingId: string | null;
    onSearch: (query: string) => void;
    onListingSelect: (id: string) => void;
  }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      onSearch(value);
    };

    if (error) {
      return (
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-destructive">
              {t("bulkImportDetails.listingSidebar.errorLoading")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">
            {t("bulkImportDetails.listingSidebar.selectedCount", {
              count: listings.length,
            })}
            {/* {listings.length} Selected listings */}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t(
                "bulkImportDetails.listingSidebar.searchPlaceholder"
              )}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {noListingsFound ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                {t("bulkImportDetails.listingSidebar.noListingsFound")}
              </div>
            ) : (
              <>
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => onListingSelect(listing.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedListingId === listing.id
                        ? "bg-success/10 border-success text-success"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium text-sm break-words">
                      {listing.listing_name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("bulkImportDetails.listingSidebar.zipCode", {
                        zip: listing.zipcode,
                      })}
                      {/* Zip code: {listing.zipcode} */}
                    </div>
                  </div>
                ))}
                {listings.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    {t("bulkImportDetails.listingSidebar.noListings")}
                  </div>
                )}
                {loading && (
                  <div className="text-center py-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("bulkImportDetails.listingSidebar.loading")}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPostForPreview, setSelectedPostForPreview] =
    useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

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
    postSearch,
    setListingSearch,
    setPostSearch,
    setSelectedListingId,
    setPostsPage,
    deletePost,
    isDeletingPost,
  } = useBulkImportDetails(historyId);

  const handleBack = () => {
    navigate("/main-dashboard/import-post-csv");
  };

  const handleViewPost = (postId: string) => {
    const post = filteredPosts.find((p) => p.id === postId);
    if (post) {
      // If search_url exists, open in new tab
      if (post.search_url) {
        window.open(post.search_url, "_blank");
      } else {
        // Otherwise show modal preview
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

  // Filter posts based on search only (no status filter)
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.text.toLowerCase().includes(postSearch.toLowerCase()) ||
      (post.tags && post.tags.toLowerCase().includes(postSearch.toLowerCase()));
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
              {/* Search */}
              <div>
                <Input
                  placeholder={t("bulkImportDetails.posts.searchPlaceholder")}
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
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
                            {/* Showing{" "}
                            {(postsPagination.page - 1) *
                              postsPagination.limit +
                              1}{" "}
                            to{" "}
                            {Math.min(
                              postsPagination.page * postsPagination.limit,
                              postsPagination.total
                            )}{" "}
                            of {postsPagination.total} posts */}
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
                              {/* Page {postsPagination.page} of{" "}
                              {postsPagination.totalPages} */}
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
        <PostPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreview}
          data={selectedPostForPreview}
        />
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
