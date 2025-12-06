import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  useDashboardStats,
  useConnectedAccounts,
} from "../../hooks/useSocialPoster";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/DashboardStatsRow",
  ]);
  const isPositive = change >= 0;

  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatCardSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const DashboardStatsRow: React.FC = () => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/DashboardStatsRow",
  ]);
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: accountsData, isLoading: accountsLoading } =
    useConnectedAccounts();

  const isLoading = statsLoading || accountsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const dashboardStats = statsData?.data;
  const accountsResponse = accountsData?.data;
  const accounts = Array.isArray(accountsResponse)
    ? accountsResponse
    : accountsResponse?.accounts || [];
  const totalAccounts = accounts.length;

  const stats: StatCardProps[] = [
    {
      title: t("stats.totalAccounts"),
      value: dashboardStats?.totalAccounts || totalAccounts,
      change: 0,
      changeLabel: t("stats.labels.connected"),
      icon: Users,
    },
    {
      title: t("stats.totalPosts"),
      value: dashboardStats?.totalPosts || 0,
      change: 0,
      changeLabel: t("stats.labels.allTime"),
      icon: FileText,
    },
    {
      title: t("stats.scheduledPosts"),
      value: dashboardStats?.scheduledPosts || 0,
      change: 0,
      changeLabel: t("stats.labels.upcoming"),
      icon: Clock,
    },
    {
      title: t("stats.successRate"),
      value: `${Math.round(dashboardStats?.successRate || 0)}%`,
      change: 0,
      changeLabel: t("stats.labels.overall"),
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};
