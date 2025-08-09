import React, { useState } from "react";
import { Calendar, Trash2, Copy, Eye, Loader2, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { PostViewModal } from "./PostViewModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { deletePost, fetchPosts, clearDeleteError } from "../../store/slices/postsSlice";
import { useListingContext } from "../../context/ListingContext";
import { toast } from "@/hooks/use-toast";
import { Post } from "../../types/postTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
interface PostCardProps {
  post: Post;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (postId: string, isSelected: boolean) => void;
  onClonePost?: (post: Post) => void;
}
export const PostCard: React.FC<PostCardProps> = ({
  post,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
  onClonePost
}) => {
  const dispatch = useAppDispatch();
  const {
    selectedListing
  } = useListingContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    deleteLoading,
    deleteError
  } = useAppSelector(state => state.posts);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Debug logging to check post status
  // console.log(
  //   "PostCard - Post ID:",
  //   post.id,
  //   "Status:",
  //   post.status,
  //   "Post:",
  //   post
  // );

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
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  const formatPublishDate = (dateString: string) => {
    if (!dateString) return "No date";

    // If the date is already in a readable format (like "27/06/2025 11:30 AM"), return as is
    if (dateString.includes("/") && (dateString.includes("AM") || dateString.includes("PM"))) {
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
    const listingId = post.listingId || selectedListing?.id || parseInt(window.location.pathname.split("/")[2]);
    if (!listingId) {
      toast({
        title: "Error",
        description: "No business listing selected. Please select a listing first.",
        variant: "destructive"
      });
      return;
    }
    try {
      // Clear any previous errors
      setIsDeleting(true);
      dispatch(clearDeleteError());
      await dispatch(deletePost({
        postId: [parseInt(post.id)],
        listingId: parseInt(listingId.toString())
      })).unwrap();
      toast({
        title: "Post Deleted",
        description: "Post has been successfully deleted."
      });

      // Refresh posts list
      dispatch(fetchPosts({
        listingId: parseInt(listingId.toString()),
        filters: {
          status: "all",
          search: ""
        },
        pagination: {
          page: 1,
          limit: 12
        }
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Failed to Delete Post",
        description: error instanceof Error ? (error as any)?.response?.data?.message || error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
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
        title: "Error",
        description: deleteError,
        variant: "destructive"
      });
    }
  }, [deleteError]);
  return <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow relative">
        {/* Selection Checkbox */}
        {isSelectionMode && <div className="absolute top-2 left-2 z-10">
            <Checkbox checked={isSelected} onCheckedChange={handleCheckboxChange} className="bg-white border-2" />
          </div>}

        {/* Post Image */}
        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden relative">
          {/* External Link Button */}
          {post.searchUrl && <Button variant="ghost" size="sm" onClick={() => window.open(post.searchUrl, "_blank")} title="Open post on Google" className="absolute top-2 right-2 h-8 w-8 p-0 text-white rounded-full z-20 bg-gray-800 hover:bg-gray-700">
              <ArrowUpRight className="w-4 h-4" />
            </Button>}
          {post.media?.images ? <>
              {imageLoading && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>}
              {imageError ? <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500 text-sm font-medium">
                    Image not available
                  </span>
                </div> : <img src={post.media.images} alt="Post" className="w-full h-full object-cover" onLoad={handleImageLoad} onError={handleImageError} style={{
            display: imageLoading ? "none" : "block"
          }} />}
            </> : <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-sm font-medium">
                Image not available
              </span>
            </div>}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {post.title || "Untitled Post"}
              </h3>
              {post.listingName && (
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {post.listingName}
                </p>
              )}
            </div>
            {post.status === "failed" ? <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={getStatusColor(post.status)}>
                    {getStatusText(post.status)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{post.reason}</p>
                </TooltipContent>
              </Tooltip> : <Badge className={getStatusColor(post.status)}>
                {getStatusText(post.status)}
              </Badge>}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && <div className="text-xs text-blue-600 mb-2">{post.tags}</div>}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3 mr-1" />
            {post.status === "scheduled" ? `Scheduled: ${formatPublishDate(post.publishDate)}` : formatPublishDate(post.publishDate)}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsViewModalOpen(true)}>
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClonePost}>
              <Copy className="w-3 h-3" />
            </Button>
            {!isSelectionMode && <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" disabled={deleteLoading}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePost} disabled={isDeleting}>
                      {isDeleting ? <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </div> : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>}
          </div>
        </CardFooter>
      </Card>

      <PostViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} post={post} />
    </>;
};