import React, { useState } from "react";
import { Calendar, Edit, Trash2, Copy, Eye, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { formatScheduledDate } from "../../utils/dateUtils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { PostViewModal } from "./PostViewModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { deletePost, clearDeleteError } from "../../store/slices/postsSlice";
import { useListingContext } from "../../context/ListingContext";
import { toast } from "@/hooks/use-toast";
import { Post } from "../../types/postTypes";
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
  isSelectionMode = false
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const {
    selectedListing
  } = useListingContext();
  const {
    deleteLoading,
    deleteError
  } = useAppSelector(state => state.posts);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Check if we're on bulk dashboard
  const isBulkDashboard = location.pathname.startsWith('/main-dashboard');
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
    // Get listingId from post data first, then context or URL
    const listingId = post.listingId || selectedListing?.id || parseInt(window.location.pathname.split("/")[2]);
    if (!listingId) {
      toast({
        title: "Error",
        description: "No business listing selected. Please select a listing first.",
        variant: "destructive"
      });
      return;
    }

    // Show progress toast
    const progressToast = toast({
      title: <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          Deleting post...
        </div>,
      description: <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Preparing deletion...</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
            width: '10%'
          }} />
          </div>
        </div>,
      duration: Infinity // Keep open until we dismiss it
    });
    try {
      // Clear any previous errors
      dispatch(clearDeleteError());

      // Simulate progress stages
      setTimeout(() => {
        progressToast.update({
          id: progressToast.id,
          description: <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Deleting post...</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
                width: '60%'
              }} />
              </div>
            </div>
        });
      }, 300);
      setTimeout(() => {
        progressToast.update({
          id: progressToast.id,
          description: <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Finalizing...</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
                width: '90%'
              }} />
              </div>
            </div>
        });
      }, 600);
      await dispatch(deletePost({
        postId: [parseInt(post.id)],
        listingId: parseInt(listingId.toString())
      })).unwrap();

      // If on bulk dashboard, refresh the dashboard data
      if (isBulkDashboard) {
        try {
          await axiosInstance.post('/get-posts-dashboard', {
            page: 1,
            // Current page - you may want to get this from your state
            limit: 10,
            // Adjust based on your pagination
            search: "",
            category: "",
            city: "",
            dateRange: {
              startDate: "",
              endDate: ""
            },
            postStatus: ""
          });
        } catch (dashboardError) {
          console.error("Error refreshing dashboard:", dashboardError);
        }
      }

      // Complete progress and show success
      progressToast.update({
        id: progressToast.id,
        title: <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            Post deleted successfully
          </div>,
        description: <div className="space-y-2">
            <div className="text-sm text-green-600">Deletion completed</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{
              width: '100%'
            }} />
            </div>
          </div>
      });

      // Auto-dismiss success toast after 2 seconds
      setTimeout(() => {
        progressToast.dismiss();
      }, 2000);

      // Post will be automatically removed from UI by Redux store
    } catch (error) {
      console.error("Error deleting post:", error);

      // Dismiss progress toast and show error
      progressToast.dismiss();
      toast({
        title: "Failed to Delete Post",
        description: error instanceof Error ? (error as any)?.response?.data?.message || error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
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
        variant: "destructive"
      });
    }
  }, [deleteError]);
  return <>
      <div className="relative border border-border rounded-lg bg-card p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
        {/* Date positioned at top right, avoiding action buttons */}
        <div className="absolute top-1 right-1 flex items-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
          <Calendar className="w-3 h-3 mr-1" />
          {formatScheduledDate(post.publishDate)}
        </div>

        <div className="flex items-center gap-4">
          {/* Selection Checkbox */}
          {isSelectionMode && onSelectionChange && <Checkbox checked={isSelected} onCheckedChange={checked => onSelectionChange(post.id, !!checked)} className="flex-shrink-0" />}

          {/* Thumbnail */}
          <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            {post.media?.images ? <img src={post.media.images} alt="Post" className="w-full h-full object-cover" /> : <span className="text-white text-xs font-medium">IMG</span>}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-20">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate">
                {post.title || "Untitled Post"}
              </h3>
              <Badge className={getStatusColor(post.status)}>
                {getStatusText(post.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
              {post.content}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {post.tags && <span className="text-primary">{post.tags}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsViewModalOpen(true)}>
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClonePost}>
              <Copy className="w-3 h-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" disabled={deleteLoading}>
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
                  <AlertDialogAction onClick={handleDeletePost} disabled={deleteLoading}>
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <PostViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} post={post} />
    </>;
};