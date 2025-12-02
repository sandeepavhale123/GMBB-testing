import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsListView } from "../components/posts/PostsListView";
import { PostsGridView } from "../components/posts/PostsGridView";
import { PostsFilters } from "../components/posts/PostsFilters";
import { usePosts } from "../hooks/useSocialPoster";
import type { GetPostsRequest, PostStatus, PlatformType } from "../types";

export const SocialPosterPosts: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<GetPostsRequest>({
    page: 1,
    limit: 9,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = usePosts(filters);

  const handleFilterChange = (key: keyof GetPostsRequest, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Posts</h1>
          <p className="text-muted-foreground">View and manage all your social media posts</p>
        </div>
        <Button onClick={() => navigate("/social-poster/posts/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <PostsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* View Content */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsContent value="list" className="mt-6">
          <PostsListView 
            posts={data?.data.posts || []} 
            isLoading={isLoading}
            pagination={data?.data.pagination}
            onPageChange={handlePageChange}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-6">
          <PostsGridView 
            posts={data?.data.posts || []} 
            isLoading={isLoading}
            pagination={data?.data.pagination}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
