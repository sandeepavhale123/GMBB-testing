import React, { Suspense, useMemo, useState } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Copy,
  Eye,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { formatScheduledDate } from "../../utils/dateUtils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
// ✅ Lazy load PostViewModal (big performance win)
const PostViewModal = React.lazy(() =>
  import("./PostViewModal").then((module) => ({
    default: module.PostViewModal,
  }))
);
// import { PostViewModal } from "./PostViewModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { deletePost, clearDeleteError } from "../../store/slices/postsSlice";
import { useListingContext } from "../../context/ListingContext";
import { toast } from "@/hooks/use-toast";
import { Post } from "../../types/postTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import axiosInstance from "../../api/axiosInstance";
interface PostListItemProps {
  post: Post;
  onClonePost?: (post: Post) => void;
  isSelected?: boolean;
  onSelectionChange?: (postId: string, selected: boolean) => void;
  isSelectionMode?: boolean;
}
export const PostListItem: React.FC<PostListItemProps> = ({
  post,
  onClonePost,
  isSelected = false,
  onSelectionChange,
  isSelectionMode = false,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { selectedListing } = useListingContext();
  const { deleteLoading, deleteError } = useAppSelector((state) => state.posts);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { t } = useI18nNamespace("Post/postListItem");

  // Check if we're on bulk dashboard
  const isBulkDashboard = location.pathname.startsWith("/main-dashboard");

  //  ------------------------------
  // 🔥 useMemo for expensive repeated calculations
  // ------------------------------

  const statusColor = useMemo(() => {
    switch (post.status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, [post.status]);

  const statusText = useMemo(() => {
    switch (post.status) {
      case "published":
        return t("status.published");
      case "scheduled":
        return t("status.scheduled");
      case "draft":
        return t("status.draft");
      case "failed":
        return t("status.failed");
      default:
        return post.status;
    }
  }, [post.status, t]);

  const handleDeletePost = async () => {
    // Get listingId from post data first, then context or URL
    const listingId =
      post.listingId ||
      selectedListing?.id ||
      parseInt(window.location.pathname.split("/")[2]);
    if (!listingId) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.noListingSelected"),
        variant: "destructive",
      });
      return;
    }

    // Show progress toast
    const progressToast = toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          {t("toast.deletingPost")}
        </div>
      ),
      description: (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {t("toast.preparingDeletion")}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: "10%",
              }}
            />
          </div>
        </div>
      ),
      duration: Infinity, // Keep open until we dismiss it
    });
    try {
      // Clear any previous errors
      dispatch(clearDeleteError());

      // Simulate progress stages
      setTimeout(() => {
        progressToast.update({
          id: progressToast.id,
          description: (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {t("toast.deletingPost")}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: "60%",
                  }}
                />
              </div>
            </div>
          ),
        });
      }, 300);
      setTimeout(() => {
        progressToast.update({
          id: progressToast.id,
          description: (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {t("toast.finalizing")}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: "90%",
                  }}
                />
              </div>
            </div>
          ),
        });
      }, 600);
      await dispatch(
        deletePost({
          postId: [parseInt(post.id)],
          listingId: parseInt(listingId.toString()),
        })
      ).unwrap();

      // Invalidate React Query cache to refresh data without page reload
      queryClient.invalidateQueries({
        queryKey: ["posts-dashboard-data"],
      });

      // Complete progress and show success
      progressToast.update({
        id: progressToast.id,
        title: (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="h-2 w-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {t("toast.successTitle")}
          </div>
        ),
        description: (
          <div className="space-y-2">
            <div className="text-sm text-green-600">
              {t("toast.successDescription")}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: "100%",
                }}
              />
            </div>
          </div>
        ),
      });

      // Auto-dismiss success toast after 2 seconds
      setTimeout(() => {
        progressToast.dismiss();
      }, 2000);

      // Post will be automatically removed from UI by Redux store
    } catch (error) {
      // console.error("Error deleting post:", error);

      // Dismiss progress toast and show error
      progressToast.dismiss();
      toast({
        title: t("toast.failedTitle"),
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("toast.unexpectedError"),
        variant: "destructive",
      });
    }
  };
  const handleClonePost = () => {
    if (onClonePost) {
      onClonePost(post);
    }
  };

  // Show error toast if there's a delete error
  React.useEffect(() => {
    if (deleteError) {
      toast({
        title: t("toast.errorTitle"),
        description: deleteError,
        variant: "destructive",
      });
    }
  }, [deleteError]);
  return (
    <>
      <div className="relative border border-border rounded-lg bg-card p-4 shadow-md transition-all duration-200 hover:border-primary/20 mb-4">
        {/* Date positioned at top right, avoiding action buttons */}
        <div className="absolute bottom-1 left-1 sm:top-1 sm:right-1 sm:bottom-auto sm:left-auto flex items-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
          <Calendar className="w-3 h-3 mr-1" />
          {formatScheduledDate(post.publishDate)}
        </div>

        <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Selection Checkbox */}
            {isSelectionMode && onSelectionChange && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelectionChange(post.id, !!checked)
                }
                className="flex-shrink-0"
              />
            )}

            {/* Thumbnail */}
            <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
              {post.media?.images ? (
                <img
                  src={post.media.images}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-medium">IMG</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 sm:pr-20">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate">
                  {post.title || t("ui.untitled")}
                </h3>
                {/* <Badge className={getStatusColor(post.status)}>
                  {getStatusText(post.status)}
                </Badge> */}
                <Badge className={statusColor}>{statusText}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 mb-1">
                {post.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {post.tags && <span className="text-primary">{post.tags}</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0 justify-end sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsViewModalOpen(true)}
            >
              <Eye className="w-3 h-3" />
            </Button>
            {post.searchUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(post.searchUrl, "_blank");
                }}
                title={t("ui.openOnGoogle")}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  disabled={deleteLoading}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("dialog.deleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialog.deleteDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeletePost}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? t("dialog.deleting") : t("dialog.delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* Lazy-loaded Modal */}
      {isViewModalOpen && (
        <Suspense fallback={<div />}>
          <PostViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            post={post}
          />
        </Suspense>
      )}
    </>
  );
};
