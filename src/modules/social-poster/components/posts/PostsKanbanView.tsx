import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPosts, getPostsByStatus } from "../../data/mockData";
import { PostStatus } from "../../types";
import { format } from "date-fns";

const columns: Array<{ id: PostStatus; title: string }> = [
  { id: "draft", title: "Draft" },
  { id: "scheduled", title: "Scheduled" },
  { id: "publishing", title: "Publishing" },
  { id: "published", title: "Published" },
  { id: "failed", title: "Failed" },
];

export const PostsKanbanView: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {columns.map((column) => {
        const posts = getPostsByStatus(column.id);
        
        return (
          <Card key={column.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {column.title} ({posts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {posts.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No posts
                  </div>
                ) : (
                  posts.map((post) => {
                    const totalCount = parseInt(post.targetCounts?.total || '0');
                    const publishedCount = parseInt(post.targetCounts?.published || '0');
                    const failedCount = parseInt(post.targetCounts?.failed || '0');
                    
                    return (
                      <div
                        key={post.id}
                        className="rounded-lg border bg-card p-3 space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        {post.media && post.media.length > 0 && (
                          <img
                            src={post.media[0].mediaUrl}
                            alt="Post preview"
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        <p className="text-xs line-clamp-3">{post.content}</p>
                        {post.scheduledFor && (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(post.scheduledFor), "MMM d, h:mm a")}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {totalCount} accounts
                          </span>
                          <div className="flex gap-1">
                            {publishedCount > 0 && (
                              <Badge variant="outline" className="text-chart-2 border-chart-2">
                                {publishedCount} ✓
                              </Badge>
                            )}
                            {failedCount > 0 && (
                              <Badge variant="outline" className="text-destructive border-destructive">
                                {failedCount} ✗
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
