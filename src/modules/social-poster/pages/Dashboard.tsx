import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardStatsRow } from "../components/dashboard/DashboardStatsRow";
import { PostingActivityChart } from "../components/dashboard/PostingActivityChart";
import { PostPerformanceChart } from "../components/dashboard/PostPerformanceChart";
import { UpcomingPostsRedesigned } from "../components/dashboard/UpcomingPostsRedesigned";
import { ConnectedAccountsSummary } from "../components/dashboard/ConnectedAccountsSummary";
export const SocialPosterDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your social media presence across all platforms
          </p>
        </div>
        <Button onClick={() => navigate("/social-poster/posts/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Stats Row - 4 Cards */}
      <DashboardStatsRow />

      {/* Charts Row - 2 Columns */}
      <div className="grid gap-6 md:grid-cols-2">
        <PostingActivityChart />
        <PostPerformanceChart />
      </div>

      {/* Bottom Row - Upcoming Posts + Connected Accounts */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <UpcomingPostsRedesigned />
        </div>
        <div className="lg:col-span-5">
          <ConnectedAccountsSummary />
        </div>
      </div>
    </div>
  );
};
