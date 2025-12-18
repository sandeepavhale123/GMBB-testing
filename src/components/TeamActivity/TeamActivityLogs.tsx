import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useTeamMembersList } from "@/hooks/useTeamMembersList";
import { ActivityLogCard } from "./ActivityLogCard";
import { ActivityLogCardSkeleton } from "./ActivityLogCardSkeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface TeamActivityLogsProps {
  subUserId?: string;
  showMemberFilter?: boolean;
  className?: string;
}

export const TeamActivityLogs: React.FC<TeamActivityLogsProps> = ({
  subUserId = "",
  showMemberFilter = false,
  className = "",
}) => {
  const {
    activities,
    pagination,
    isLoading,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    setPage,
    limit,
    setLimit,
    selectedMemberId,
    setSelectedMemberId,
  } = useActivityLogs({ subUserId });

    const { t } = useI18nNamespace("TeamActivity/TeamActivityLogs");
  const { members, isLoading: isMembersLoading } = useTeamMembersList(showMemberFilter);

  const hasFilters = search || dateFrom || dateTo || selectedMemberId;

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSelectedMemberId("");
  };

  const { total, totalPages } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("activityLogs.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Team Member Filter - Only shown on Settings Activity page */}
        {showMemberFilter && (
          <Select
            value={selectedMemberId}
            onValueChange={setSelectedMemberId}
            disabled={isMembersLoading}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("activityLogs.allMembers")}</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date From */}
        <Input
          type="date"
          placeholder={t("activityLogs.fromDate")}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full sm:w-40"
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder={t("activityLogs.toDate")}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full sm:w-40"
        />

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <ActivityLogCardSkeleton />
            <ActivityLogCardSkeleton />
            <ActivityLogCardSkeleton />
          </>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t("activityLogs.noLogs")}</p>
            {hasFilters && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                {t("activityLogs.clearFilters")}
              </Button>
            )}
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityLogCard key={activity.activity_id} activity={activity} />
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && activities.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {t("activityLogs.showing")} {startItem}-{endItem} {t("activityLogs.of")} {total}
          </div>

          <div className="flex items-center gap-4">
            {/* Page Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("activityLogs.perPage")}:</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("activityLogs.page")} {page} {t("activityLogs.of")} {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
