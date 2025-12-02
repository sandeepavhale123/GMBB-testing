import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Edit, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Calendar as CalendarIcon,
  Loader2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MessageSquare
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { PlatformType, PostStatus, Post } from "../../types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from "date-fns";
import { useDeletePost, useRetryPost } from "../../hooks/useSocialPoster";
import { useProfile } from "@/hooks/useProfile";
import { formatUTCDateInUserTimezone, convertUTCToUserTimezone } from "@/utils/dateUtils";

const platformIcons: Record<PlatformType, React.ElementType> = {
  facebook: FaFacebookF,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  linkedin_individual: Linkedin,
  linkedin_organisation: Linkedin,
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

interface PostsCalendarViewProps {
  posts: Post[];
  isLoading: boolean;
}

export const PostsCalendarView: React.FC<PostsCalendarViewProps> = ({ posts, isLoading }) => {
  const navigate = useNavigate();
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPostBreakdown, setSelectedPostBreakdown] = useState<string | null>(null);
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

  const selectedPost = selectedPostBreakdown 
    ? posts.find(p => p.id === selectedPostBreakdown)
    : null;

  // Get calendar days for current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group posts by date in user timezone
  const postsByDate = posts.reduce((acc, post) => {
    if (!post.scheduledFor) return acc;
    const zonedDate = convertUTCToUserTimezone(post.scheduledFor, userTimezone);
    const dateKey = format(zonedDate, "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  // Get posts for selected date
  const postsForSelectedDate = selectedDate
    ? posts.filter((post) => {
        if (!post.scheduledFor) return false;
        const zonedDate = convertUTCToUserTimezone(post.scheduledFor, userTimezone);
        return isSameDay(zonedDate, selectedDate);
      }).sort((a, b) => {
        if (!a.scheduledFor || !b.scheduledFor) return 0;
        return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
      })
    : [];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section - 7 columns */}
        <div className="col-span-7">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  {format(currentMonth, "MMMM yyyy")}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const dayPosts = postsByDate[dateKey] || [];
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isCurrentDay = isToday(day);
                  const hasPosts = dayPosts.length > 0;

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative min-h-[80px] p-2 rounded-lg border transition-all
                        ${isSelected 
                          ? "border-primary bg-primary/10 shadow-sm" 
                          : hasPosts
                          ? "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }
                        ${!isSameMonth(day, currentMonth) ? "opacity-40" : ""}
                      `}
                    >
                      <div className="flex flex-col items-start h-full">
                        <span className={`
                          text-sm font-medium mb-1
                          ${isCurrentDay ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center" : ""}
                        `}>
                          {format(day, "d")}
                        </span>
                        {dayPosts.length > 0 && (
                          <div className="flex flex-col gap-1 w-full">
                            {dayPosts.slice(0, 2).map((post) => (
                              <div
                                key={post.id}
                                className="w-full h-1.5 rounded-full"
                                style={{ backgroundColor: statusColors[post.status] }}
                                title={post.content.slice(0, 50)}
                              />
                            ))}
                            {dayPosts.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{dayPosts.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section - 5 columns */}
        <div className="col-span-5">
          {selectedDate ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {postsForSelectedDate.length} {postsForSelectedDate.length === 1 ? 'post' : 'posts'} scheduled
                    </p>
                  </div>
                  {postsForSelectedDate.length > 0 && (
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {postsForSelectedDate.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {postsForSelectedDate.length > 0 ? (
                    <div className="space-y-4 pr-4">
                      {postsForSelectedDate.map((post) => {
                        const platformGroups = post.targets.reduce((acc, target) => {
                          if (!acc[target.platform]) acc[target.platform] = [];
                          acc[target.platform].push(target);
                          return acc;
                        }, {} as Record<PlatformType, typeof post.targets>);

                        const publishedCount = parseInt(post.targetCounts?.published || '0');
                        const failedCount = parseInt(post.targetCounts?.failed || '0');
                        const pendingCount = parseInt(post.targetCounts?.pending || '0');

                        return (
                          <Card key={post.id} className="border-l-4" style={{ borderLeftColor: statusColors[post.status] }}>
                            <CardContent className="p-6">
                              <div className="flex gap-4">
                                {post.media && post.media.length > 0 && (
                                  <div className="relative flex-shrink-0">
                                    {post.media[0].mediaType === 'video' ? (
                                      post.media[0].thumbnailUrl ? (
                                        <img
                                          src={post.media[0].thumbnailUrl}
                                          alt="Video thumbnail"
                                          className="h-32 w-32 rounded-lg object-cover"
                                        />
                                      ) : (
                                        <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                                          <FileText className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                      )
                                    ) : (
                                      <img
                                        src={post.media[0].mediaUrl}
                                        alt="Post media"
                                        className="h-32 w-32 rounded-lg object-cover"
                                      />
                                    )}
                                    {post.media.length > 1 && (
                                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        +{post.media.length - 1}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <p className="text-sm mb-2">{post.content}</p>
                                      <div className="flex items-center gap-3 flex-wrap">
                                        <Badge
                                          variant="outline"
                                          style={{
                                            borderColor: statusColors[post.status],
                                            color: statusColors[post.status],
                                          }}
                                        >
                                          {statusLabels[post.status]}
                                        </Badge>
                                        {post.scheduledFor && (
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatUTCDateInUserTimezone(post.scheduledFor, userTimezone, "h:mm a")}
                                          </div>
                                        )}
                                        <div className="flex items-center -space-x-2">
                                          {Object.keys(platformGroups).slice(0, 4).map((platform, idx) => {
                                            const Icon = platformIcons[platform as PlatformType] || FileText;
                                            const color = platformBgColors[platform as PlatformType] || "hsl(0, 0%, 50%)";
                                            return (
                                              <div
                                                key={platform}
                                                className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card"
                                                style={{ backgroundColor: color, zIndex: 4 - idx }}
                                              >
                                                <Icon className="h-2.5 w-2.5 text-white" />
                                              </div>
                                            );
                                          })}
                                          {Object.keys(platformGroups).length > 4 && (
                                            <div
                                              className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium"
                                              style={{ zIndex: 0 }}
                                            >
                                              +{Object.keys(platformGroups).length - 4}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {(post.status === "draft" || post.status === "scheduled") && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleEdit(post.id)}
                                          title="Edit post"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                      )}
                                      {post.status === "failed" && (
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          onClick={() => handleRetry(post.id)}
                                          disabled={retryPostMutation.isPending}
                                          title="Retry failed posts"
                                        >
                                          {retryPostMutation.isPending ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          ) : (
                                            <RefreshCw className="h-3 w-3" />
                                          )}
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleDelete(post.id)}
                                        disabled={deletePostMutation.isPending}
                                        title="Delete post"
                                      >
                                        {deletePostMutation.isPending ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground">
                                      <span className="text-green-600 font-medium">{publishedCount} ✓</span>
                                      {failedCount > 0 && (
                                        <span className="text-red-600 font-medium ml-3">{failedCount} ✗</span>
                                      )}
                                      {pendingCount > 0 && (
                                        <span className="text-yellow-600 font-medium ml-3">{pendingCount} ⏳</span>
                                      )}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedPostBreakdown(post.id)}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No Posts Scheduled</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        No posts are scheduled for this date
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => navigate("/social-poster/posts/create")}
                      >
                        Create Post
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Select a Date</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Click on a date in the calendar to view scheduled posts
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Platform Breakdown Modal */}
      <Dialog open={!!selectedPostBreakdown} onOpenChange={() => setSelectedPostBreakdown(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Platform Breakdown</DialogTitle>
            <DialogDescription>
              Detailed status for each platform
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Post Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedPost.content}</p>
                  </CardContent>
                </Card>

                {Object.entries(
                  selectedPost.targets.reduce((acc, target) => {
                    if (!acc[target.platform]) acc[target.platform] = [];
                    acc[target.platform].push(target);
                    return acc;
                  }, {} as Record<PlatformType, typeof selectedPost.targets>)
                ).map(([platform, targets]) => {
                  const Icon = platformIcons[platform as PlatformType] || FileText;
                  const failedTargets = targets.filter(t => t.status === "failed");
                  const successTargets = targets.filter(t => t.status === "published");
                  const pendingTargets = targets.filter(t => t.status === "scheduled" || t.status === "publishing");
                  const hasFailed = failedTargets.length > 0;
                  
                  return (
                    <Card key={platform}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full"
                              style={{ backgroundColor: platformBgColors[platform as PlatformType] || "hsl(0, 0%, 50%)" }}
                            >
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-semibold capitalize">{platform}</span>
                          </div>
                          {hasFailed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetry(selectedPost.id, failedTargets.map(t => t.id))}
                              disabled={retryPostMutation.isPending}
                            >
                              {retryPostMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Retry Failed
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{successTargets.length}</div>
                            <div className="text-xs text-muted-foreground">Success</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-600">{failedTargets.length}</div>
                            <div className="text-xs text-muted-foreground">Failed</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-yellow-600">{pendingTargets.length}</div>
                            <div className="text-xs text-muted-foreground">Pending</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {targets.map((target) => (
                            <div key={target.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm">{target.accountName}</span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  style={{
                                    borderColor: statusColors[target.status],
                                    color: statusColors[target.status],
                                  }}
                                >
                                  {statusLabels[target.status]}
                                </Badge>
                                {target.status === "published" && target.publishedUrl && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    asChild
                                  >
                                    <a
                                      href={target.publishedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="View published post"
                                    >
                                      <ExternalLink className="h-4 w-4 text-primary" />
                                    </a>
                                  </Button>
                                )}
                                {target.status === "failed" && target.error && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    title={typeof target.error === 'string' ? target.error : JSON.stringify(target.error)}
                                  >
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {hasFailed && (
                          <div className="space-y-2">
                            {failedTargets.map((target) => (
                              target.error && (
                                <div key={target.id} className="flex gap-2 p-3 bg-destructive/10 rounded-md">
                                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-destructive">{target.accountName}</p>
                                    <p className="text-sm text-muted-foreground">
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

                {selectedPost.status === "failed" && (
                  <Button
                    className="w-full"
                    onClick={() => handleRetry(selectedPost.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry All Platforms
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Instagram Deletion Warning Modal */}
      <Dialog open={!!instagramWarningPost} onOpenChange={() => setInstagramWarningPost(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Instagram Post Published</DialogTitle>
                <DialogDescription className="mt-2">
                  This post has been published to Instagram. Due to Instagram API limitations, 
                  published posts cannot be deleted automatically.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">
              Please delete the post manually from Instagram if needed. The post will be removed 
              from this system, but will remain on Instagram.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setInstagramWarningPost(null)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmInstagramDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete from System
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
