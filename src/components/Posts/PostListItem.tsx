import React, { useState } from "react";
import { Calendar, Edit, Trash2, Copy, Eye, Loader2 } from "lucide-react";
import { formatScheduledDate } from "../../utils/dateUtils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { PostViewModal } from "./PostViewModal";
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
import {
  deletePost,
  fetchPosts,
  clearDeleteError,
} from "../../store/slices/postsSlice";
import { useListingContext } from "../../context/ListingContext";
import { toast } from "@/hooks/use-toast";
import { Post } from "../../types/postTypes";

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
  const { selectedListing } = useListingContext();
  const { deleteLoading, deleteError } = useAppSelector((state) => state.posts);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
        return "Live";
      case "scheduled":
        return "Scheduled";
      case "draft":
        return "Draft";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const handleDeletePost = async () => {
    // Get listingId from context or URL
    // const listingId = selectedListing?.id || parseInt(window.location.pathname.split('/')[2]) || 176832;
    const listingId =
      selectedListing?.id || parseInt(window.location.pathname.split("/")[2]);

    if (!listingId) {
      toast({
        title: "Error",
        description:
          "No business listing selected. Please select a listing first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clear any previous errors
      dispatch(clearDeleteError());

      await dispatch(
        deletePost({
          postId: [parseInt(post.id)],
          listingId: parseInt(listingId.toString()),
        })
      ).unwrap();

      toast({
        title: "Post Deleted",
        description: "Post has been successfully deleted.",
      });

      // Refresh posts list
      dispatch(
        fetchPosts({
          listingId: parseInt(listingId.toString()),
          filters: { status: "all", search: "" },
          pagination: { page: 1, limit: 12 },
        })
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Failed to Delete Post",
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : "An unexpected error occurred. Please try again.",
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
        title: "Error",
        description: deleteError,
        variant: "destructive",
      });
    }
  }, [deleteError]);

  return (
    <>
      <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
        {/* Selection Checkbox */}
        {isSelectionMode && onSelectionChange && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(post.id, !!checked)}
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {post.title || "Untitled Post"}
            </h3>
            <Badge className={getStatusColor(post.status)}>
              {getStatusText(post.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-1 mb-1">
            {post.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatScheduledDate(post.publishDate)}
            </div>
            {post.tags && <span className="text-blue-600">{post.tags}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsViewModalOpen(true)}
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleClonePost}
          >
            <Copy className="w-3 h-3" />
          </Button>
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
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePost}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <PostViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={post}
      />
    </>
  );
};
