import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs, GetActivityLogsRequest } from "@/api/teamApi";
import { useDebounce } from "@/hooks/useDebounce";

interface UseActivityLogsProps {
  subUserId?: string;
  initialPage?: number;
  initialLimit?: number;
}

export const useActivityLogs = ({
  subUserId = "",
  initialPage = 1,
  initialLimit = 20,
}: UseActivityLogsProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  // Use subUserId prop if provided (Edit Team Member page), otherwise use selectedMemberId (Settings Activity page)
  // Handle "all" value as empty string for API
  const effectiveSubUserId = subUserId || (selectedMemberId === "all" ? "" : selectedMemberId);

  const queryParams: GetActivityLogsRequest = {
    page,
    limit,
    filters: {
      search: debouncedSearch,
      sub_user_id: effectiveSubUserId,
      date_from: dateFrom,
      date_to: dateTo,
    },
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["activity-logs", page, limit, debouncedSearch, effectiveSubUserId, dateFrom, dateTo],
    queryFn: () => getActivityLogs(queryParams),
    staleTime: 2 * 60 * 1000,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateFrom, dateTo, selectedMemberId]);

  return {
    activities: data?.data?.data || [],
    pagination: {
      page: data?.data?.page || 1,
      limit: data?.data?.limit || 20,
      total: data?.data?.total || 0,
      totalPages: data?.data?.total_pages || 1,
    },
    isLoading,
    error: error?.message || null,
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
    refetch,
  };
};
