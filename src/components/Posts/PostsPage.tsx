import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import {
  fetchPosts,
  setFilter,
  setSearchQuery,
} from "../../store/slices/postsSlice";
import { useListingContext } from "../../context/ListingContext";
import { useMediaContext } from "../../context/MediaContext";
import { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import { CreatePostModal } from "./CreatePostModal";
import { PostsHeader } from "./PostsHeader";
import { PostsControls } from "./PostsControls";
import { PostsLoadingState } from "./PostsLoadingState";
import { PostsEmptyState } from "./PostsEmptyState";
import { PostsContent } from "./PostsContent";
import {
  transformPostForCloning,
  CreatePostFormData,
} from "../../utils/postCloneUtils";
import { Post } from "../../types/postTypes";
import { formatDateForBackend } from "../../utils/dateUtils";

export const PostsPage = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { selectedMedia, shouldOpenCreatePost, clearSelection } = useMediaContext();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cloneData, setCloneData] = useState<CreatePostFormData | null>(null);
  const [isCloning, setIsCloning] = useState(false);

  const { posts, loading, error, filter, searchQuery, pagination } =
    useAppSelector((state) => state.posts);

  // Get listingId from URL or context
  // const listingId = selectedListing?.id || parseInt(window.location.pathname.split('/')[2]) || 176832;
  const listingId =
    selectedListing?.id || parseInt(window.location.pathname.split("/")[2]);

  // Fetch posts when component mounts or dependencies change
  useEffect(() => {
    if (listingId) {
      dispatch(
        fetchPosts({
          listingId: parseInt(listingId.toString()),
          filters: {
            status: filter === "all" ? "all" : filter,
            search: searchQuery,
            dateRange: {
              startDate: dateRange?.from
                ? formatDateForBackend(dateRange.from)
                : "",
              endDate: dateRange?.to
                ? formatDateForBackend(dateRange.to)
                : "",
            },
          },
          pagination: {
            page: pagination.currentPage,
            limit: 12,
          },
        })
      );
    }
  }, [
    dispatch,
    listingId,
    filter,
    searchQuery,
    dateRange,
    pagination.currentPage,
  ]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  // Handle media context - open modal when image is selected from gallery
  useEffect(() => {
    if (shouldOpenCreatePost && selectedMedia) {
      setIsCreateModalOpen(true);
    }
  }, [shouldOpenCreatePost, selectedMedia]);

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
  };

  const resetAllFilters = () => {
    dispatch(setFilter("all"));
    setLocalSearchQuery("");
    dispatch(setSearchQuery(""));
    setDateRange(undefined);
  };

  const hasActiveFilters =
    filter !== "all" ||
    searchQuery !== "" ||
    !!dateRange?.from ||
    !!dateRange?.to;

  const handlePageChange = (page: number) => {
    dispatch(
      fetchPosts({
        listingId: parseInt(listingId.toString()),
        filters: {
          status: filter === "all" ? "all" : filter,
          search: searchQuery,
          dateRange: {
            startDate: dateRange?.from
              ? formatDateForBackend(dateRange.from)
              : "",
            endDate: dateRange?.to
              ? formatDateForBackend(dateRange.to)
              : "",
          },
        },
        pagination: {
          page,
          limit: 12,
        },
      })
    );
  };

  const handleCreatePost = () => {
    setCloneData(null);
    setIsCloning(false);
    setIsCreateModalOpen(true);
  };

  const handleClonePost = (post: Post) => {
    const clonedData = transformPostForCloning(post);
    setCloneData(clonedData);
    setIsCloning(true);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    clearSelection();
    setIsCreateModalOpen(false);
    setCloneData(null);
    setIsCloning(false);
  };

  return (
    <div className="space-y-6">
      <PostsHeader onCreatePost={handleCreatePost} />

      <PostsControls
        loading={loading}
        totalPosts={pagination.totalPosts}
        hasActiveFilters={hasActiveFilters}
        localSearchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        filter={filter}
        onFilterChange={handleFilterChange}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetAllFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {loading && <PostsLoadingState />}

      {!loading && (
        <>
          {posts.length === 0 ? (
            <PostsEmptyState
              hasActiveFilters={hasActiveFilters}
              onCreatePost={handleCreatePost}
            />
          ) : (
            <PostsContent
              posts={posts}
              viewMode={viewMode}
              pagination={pagination}
              hasActiveFilters={hasActiveFilters}
              onPageChange={handlePageChange}
              onClonePost={handleClonePost}
            />
          )}
        </>
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        initialData={cloneData}
        isCloning={isCloning}
      />
    </div>
  );
};
