import React, { useState } from "react";
import {
  Calendar,
  Trash2,
  Copy,
  Eye,
  Loader2,
  ArrowUpRight,
  Pencil,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { PostViewModal } from "./PostViewModal";
import { CreatePostModal } from "./CreatePostModal";
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
import { usePostsDashboardData } from "../../api/dashboardApi";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/postTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import axiosInstance from "../../api/axiosInstance";
interface PostCardProps {
  post: Post;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (postId: string, isSelected: boolean) => void;
  onClonePost?: (post: Post) => void;
}
const PostCardComponent: React.FC<PostCardProps> = ({
  post,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
  onClonePost,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { selectedListing } = useListingContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteLoading, deleteError } = useAppSelector((state) => state.posts);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { t } = useI18nNamespace("Post/postCard");

  // Check if we're on bulk dashboard
  const isBulkDashboard = location.pathname.startsWith("/main-dashboard");

  const getStatusColor = (status: string) => {
    switch (status) {
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
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return t("status.published");
      case "scheduled":
        return t("status.scheduled");
      case "draft":
        return t("status.draft");
      case "failed":
        return t("status.failed");
      default:
        return status;
    }
  };
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  const formatPublishDate = (dateString: string) => {
    if (!dateString) return t("labels.noDate");

    // If the date is already in a readable format (like "27/06/2025 11:30 AM"), return as is
    if (
      dateString.includes("/") &&
      (dateString.includes("AM") || dateString.includes("PM"))
    ) {
      return dateString;
    }

    // Otherwise, try to format it using Date
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };
  const handleCheckboxChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(post.id, checked);
    }
  };
  const handleDeletePost = async () => {
    // Get listingId from post data first, then context or URL
    const listingId =
      post.listingId ||
      selectedListing?.id ||
      parseInt(window.location.pathname.split("/")[2]);
    if (!listingId) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.noListing"),
        variant: "destructive",
      });
      return;
    }

    // Show progress toast
    const progressToast = toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          {t("toast.deleting")}
        </div>
      ),
      description: (
        <div className="space-y-2 w-full">
          <div className="text-sm text-muted-foreground">
            {t("toast.preparing")}
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
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
      setIsDeleting(true);
      dispatch(clearDeleteError());

      // Simulate progress stages
      setTimeout(() => {
        progressToast.update({
          id: progressToast.id,
          description: (
            <div className="space-y-2 w-full">
              <div className="text-sm text-muted-foreground">
                {t("toast.deleting")}
              </div>
              <div className="w-full bg-muted rounded-full h-3 flex-1 min-w-0">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
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
            <div className="space-y-2 w-full">
              <div className="text-sm text-muted-foreground">
                {t("toast.finalizing")}
              </div>
              <div className="w-full bg-muted rounded-full h-3 min-w-0 flex-1">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
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
      queryClient.invalidateQueries({ queryKey: ["posts-dashboard-data"] });

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
            {t("toast.success.title")}
          </div>
        ),
        description: (
          <div className="space-y-2 w-full">
            <div className="text-sm text-green-600">
              {t("toast.success.desc")}
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
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
        title: t("toast.failed.title"),
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("toast.failed.desc"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false); // ✅ reset local loading
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
        title: t("toast.error.title"),
        description: deleteError,
        variant: "destructive",
      });
    }
  }, [deleteError]);
  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow relative flex flex-col h-full">
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="bg-white border-2"
            />
          </div>
        )}

        {/* Post Image */}
        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden relative">
          {/* External Link Button */}
          {post.searchUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(post.searchUrl, "_blank")}
              title={t("buttons.openOnGoogle")}
              className="absolute top-2 right-2 h-8 w-8 p-0 text-white rounded-full z-20 bg-gray-800 hover:bg-gray-700 hover:text-white "
            >
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          )}
          {post.media?.images ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500 text-sm font-medium">
                    {t("labels.imageNotAvailable")}
                  </span>
                </div>
              ) : (
                <img
                  src={post.media.images}
                  alt="Post"
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    display: imageLoading ? "none" : "block",
                  }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-sm font-medium">
                {t("labels.imageNotAvailable")}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {post.title || t("labels.untitledPost")}
              </h3>
              {post.listingName && (
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {post.listingName}
                </p>
              )}
            </div>
            {post.status === "failed" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={getStatusColor(post.status)}>
                    {getStatusText(post.status)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{post.reason}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Badge className={getStatusColor(post.status)}>
                {getStatusText(post.status)}
              </Badge>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && (
            <div className="text-xs text-blue-600 mb-2">{post.tags}</div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3 mr-1" />
            {post.status === "scheduled"
              ? t("labels.scheduledAt", {
                  date: formatPublishDate(post.publishDate),
                })
              : formatPublishDate(post.publishDate)}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsViewModalOpen(true)}
            >
              <Eye className="w-3 h-3" />
            </Button>
            {/* Edit button - only for scheduled posts */}
            {post.status === "scheduled" && !isSelectionMode && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            )}
            {!isSelectionMode && (
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
                    <AlertDialogTitle>
                      {t("modal.delete.title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("modal.delete.description")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t("modal.delete.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("modal.delete.deleting")}
                        </div>
                      ) : (
                        t("modal.delete.confirm")
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardFooter>
      </Card>

      <PostViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={post}
      />

      {/* Edit Post Modal */}
      <CreatePostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isEditing={true}
        editPostId={post.id}
      />
    </>
  );
};

export const PostCard = React.memo(PostCardComponent);
