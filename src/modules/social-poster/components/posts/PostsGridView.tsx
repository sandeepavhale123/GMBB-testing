import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Instagram, Twitter, Edit, Trash2, AlertCircle, RefreshCw, FileText, Calendar, Loader2, ExternalLink, MoreVertical, Eye, MessageSquare, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { PlatformType, PostStatus, Post } from "../../types";
import { useDeletePost, useRetryPost } from "../../hooks/useSocialPoster";
import { useProfile } from "@/hooks/useProfile";
import { formatUTCDateInUserTimezone } from "@/utils/dateUtils";

const platformIcons: Record<PlatformType, React.ElementType> = {
  facebook: FaFacebookF,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: FaLinkedinIn,
  linkedin_individual: FaLinkedinIn,
  linkedin_organisation: FaLinkedinIn,
  threads: MessageSquare,
  pinterest: FileText,
  youtube: FileText,
};

const platformBgColors: Record<PlatformType, string> = {
  facebook: "hsl(221, 75%, 55%)",
  instagram: "hsl(330, 75%, 50%)",
  twitter: "hsl(0, 0%, 0%)",
  linkedin: "hsl(201, 100%, 35%)",
  linkedin_individual: "hsl(201, 100%, 35%)",
  linkedin_organisation: "hsl(201, 100%, 35%)",
  threads: "hsl(0, 0%, 0%)",
  pinterest: "hsl(0, 78%, 52%)",
  youtube: "hsl(0, 100%, 50%)",
};

const statusColors: Record<PostStatus, string> = {
  draft: "hsl(var(--muted-foreground))",
  scheduled: "hsl(var(--chart-3))",
  publishing: "hsl(var(--chart-4))",
  published: "hsl(var(--chart-2))",
  failed: "hsl(var(--destructive))",
};

const statusLabels: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  publishing: "Publishing",
  published: "Published",
  failed: "Failed",
};

// Helper function to get platform icon component
const getPlatformIcon = (platform: PlatformType) => {
  const Icon = platformIcons[platform];
  const bgColor = platformBgColors[platform];
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <Icon className="h-4 w-4 text-white" />
    </div>
  );
};

// Helper function to get badge variant based on status
const getStatusVariant = (status: PostStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "published":
      return "default";
    case "failed":
      return "destructive";
    case "draft":
      return "secondary";
    default:
      return "outline";
  }
};

interface PostsGridViewProps {
  posts: Post[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export const PostsGridView: React.FC<PostsGridViewProps> = ({ posts, isLoading, pagination, onPageChange }) => {
  const navigate = useNavigate();
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";
  const [selectedPostBreakdown, setSelectedPostBreakdown] = useState<Post | null>(null);
  const [instagramWarningPost, setInstagramWarningPost] = useState<string | null>(null);
  const deletePostMutation = useDeletePost();
  const retryPostMutation = useRetryPost();

  const handleDelete = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const hasPublishedInstagram = post?.targets.some(
      t => t.platform === 'instagram' && t.status === 'published'
    );

    if (hasPublishedInstagram) {
      setInstagramWarningPost(postId);
    } else {
      if (window.confirm('Are you sure you want to delete this post?')) {
        await deletePostMutation.mutateAsync(postId);
      }
    }
  };

  const confirmInstagramDelete = async () => {
    if (instagramWarningPost) {
      await deletePostMutation.mutateAsync(instagramWarningPost);
      setInstagramWarningPost(null);
    }
  };

  const handleRetry = async (postId: string, targetIds?: string[]) => {
    await retryPostMutation.mutateAsync({ postId, targetIds });
  };

  const handleEdit = (postId: string) => {
    navigate(`/social-poster/posts/${postId}/edit`);
  };

  const handleView = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPostBreakdown(post);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Posts Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first post to see it here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => {
          const platformGroups = post.targets.reduce((acc, target) => {
            if (!acc[target.platform]) acc[target.platform] = [];
            acc[target.platform].push(target);
            return acc;
          }, {} as Record<PlatformType, typeof post.targets>);

          const publishedCount = parseInt(post.targetCounts?.published || '0');
          const failedCount = parseInt(post.targetCounts?.failed || '0');
          const pendingCount = parseInt(post.targetCounts?.pending || '0');

          return (
            <Card key={post.id} className="overflow-hidden">
              {/* Clickable Image Area */}
              <div 
                className="relative aspect-video bg-muted cursor-pointer"
                onClick={() => handleView(post.id)}
              >
                {post.media && post.media.length > 0 ? (
                  <img
                    src={post.media[0].mediaType === 'video' && post.media[0].thumbnailUrl 
                      ? post.media[0].thumbnailUrl 
                      : post.media[0].mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                {/* Status Badge on Image */}
                <Badge
                  className="absolute top-2 left-2"
                  variant="outline"
                  style={{
                    borderColor: statusColors[post.status],
                    color: statusColors[post.status],
                    backgroundColor: 'hsl(var(--background) / 0.9)',
                  }}
                >
                  {statusLabels[post.status]}
                </Badge>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Clickable Content */}
                <p 
                  className="text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleView(post.id)}
                >
                  {post.content}
                </p>

                {/* Date */}
                {post.scheduledFor && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatUTCDateInUserTimezone(post.scheduledFor, userTimezone)}
                  </div>
                )}

                {/* Bottom Row: Platforms, Stats, Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Platform Icons */}
                    <div className="flex items-center -space-x-2">
                      {Object.keys(platformGroups).slice(0, 3).map((platform, idx) => {
                        const Icon = platformIcons[platform as PlatformType] || FileText;
                        const color = platformBgColors[platform as PlatformType] || "hsl(0, 0%, 50%)";
                        return (
                          <div
                            key={platform}
                            className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card"
                            style={{ backgroundColor: color, zIndex: 3 - idx }}
                          >
                            <Icon className="h-2.5 w-2.5 text-white" />
                          </div>
                        );
                      })}
                      {Object.keys(platformGroups).length > 3 && (
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium"
                          style={{ zIndex: 0 }}
                        >
                          +{Object.keys(platformGroups).length - 3}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">{publishedCount}✓</span>
                      {failedCount > 0 && (
                        <span className="text-red-600 ml-1">{failedCount}✗</span>
                      )}
                      {pendingCount > 0 && (
                        <span className="text-yellow-600 ml-1">{pendingCount}⏳</span>
                      )}
                    </div>
                  </div>

                  {/* More Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => handleView(post.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      {(post.status === "draft" || post.status === "scheduled") && (
                        <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {post.status === "failed" && (
                        <DropdownMenuItem 
                          onClick={() => handleRetry(post.id)}
                          disabled={retryPostMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(post.id)}
                        disabled={deletePostMutation.isPending}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
          <div className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} posts
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              ))}
              {pagination.totalPages > 4 && (
                <span className="text-sm text-muted-foreground px-2">...</span>
              )}
              {pagination.totalPages > 3 && (
                <Button
                  variant={pagination.page === pagination.totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pagination.totalPages)}
                  className="w-8 h-8 p-0"
                >
                  {pagination.totalPages}
                </Button>
              )}
            </div>

            {/* Mobile page indicator */}
            <div className="md:hidden text-sm text-muted-foreground px-3">
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Platform Breakdown Modal */}
      <Dialog open={!!selectedPostBreakdown} onOpenChange={() => setSelectedPostBreakdown(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {selectedPostBreakdown && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {selectedPostBreakdown.targets.map((target) => {
                  const hasFailed = target.status === "failed";
                  const failedTargets = hasFailed ? [target] : [];

                  return (
                    <Card key={target.id} className="overflow-hidden border">
                      <CardContent className="p-4">
                        {/* Platform Header */}
                        <div className="flex items-center gap-3 mb-3">
                          {getPlatformIcon(target.platform)}
                          <div className="flex-1">
                            <div className="font-medium">{target.accountName}</div>
                            <div className="text-xs text-muted-foreground">{target.platform}</div>
                          </div>
                          <Badge variant={getStatusVariant(target.status)}>
                            {target.status}
                          </Badge>
                        </div>

                        {/* Published URL */}
                        {target.status === "published" && target.publishedUrl && (
                          <div className="mb-3">
                            <a
                              href={target.publishedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Published Post
                            </a>
                          </div>
                        )}

                        {/* Show failure reasons if any */}
                        {hasFailed && (
                          <div className="space-y-2">
                            {failedTargets.map((target) => (
                              target.error && (
                                <div key={target.id} className="flex gap-2 p-3 bg-destructive/10 rounded-md">
                                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-destructive">{target.accountName}</p>
                                    <p className="text-xs text-destructive/80">
                                      {typeof target.error === 'string' ? target.error : JSON.stringify(target.error)}
                                    </p>
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Instagram Delete Warning Modal */}
      <Dialog open={!!instagramWarningPost} onOpenChange={() => setInstagramWarningPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Instagram Post Cannot Be Deleted Remotely
            </DialogTitle>
            <DialogDescription className="pt-2">
              Instagram's API does not support deleting posts remotely. If you proceed, the post 
              will be removed from our system, but you'll need to manually delete it from Instagram.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setInstagramWarningPost(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmInstagramDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete from System"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
