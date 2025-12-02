import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlatformData {
  name: string;
  posts: number;
  color: string;
}

const platformData: PlatformData[] = [
  { name: "Facebook", posts: 18, color: "hsl(221, 75%, 55%)" },
  { name: "Instagram", posts: 15, color: "hsl(330, 75%, 50%)" },
  { name: "LinkedIn", posts: 12, color: "hsl(201, 100%, 35%)" },
  { name: "Twitter", posts: 8, color: "hsl(0, 0%, 20%)" },
  { name: "Threads", posts: 3, color: "hsl(0, 0%, 40%)" },
];

const totalPosts = platformData.reduce((sum, p) => sum + p.posts, 0);

export const PostingActivityChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState("last_month");

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Posting Activity by Platform</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_week">Last week</SelectItem>
              <SelectItem value="last_month">Last month</SelectItem>
              <SelectItem value="last_6_months">Last 6 months</SelectItem>
              <SelectItem value="last_12_months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold">{totalPosts}</span>
          <span className="text-lg text-muted-foreground">Posts</span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostingActivityChartSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-48" />
    </CardHeader>
    <CardContent>
      <div className="mb-4 flex items-baseline gap-2">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);
