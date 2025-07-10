import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aitaskApi, AiTask, TaskStats } from "../api/aitaskApi";

interface UseAiTasksOptions {
  listingId?: number;
  enabled?: boolean;
}

// Fetch AI Tasks
export const useAiTasks = ({
  listingId,
  enabled = true,
}: UseAiTasksOptions) => {
  return useQuery({
    queryKey: ["aiTasks", listingId],
    queryFn: () => {
      if (!listingId) {
        throw new Error("Listing ID is required");
      }
      return aitaskApi.getAiTasks(listingId);
    },
    enabled: enabled && !!listingId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Transform task data and stats
export const useTransformedAiTasks = ({
  listingId,
  enabled = true,
}: UseAiTasksOptions) => {
  const { data, isLoading, error, refetch } = useAiTasks({
    listingId,
    enabled,
  });

  const transformedTasks: AiTask[] =
    data?.taskDetails
      ?.map((task) => ({
        ...task,
        status: task.status || "pending",
        priority: task.priority || "medium",
        category: task.category || "seo",
        type:
          task.type ||
          (task.frequency === "recurring" ? "recurring" : "one-time"),
        estimatedTime: task.estimatedTime || "15 min",
      }))
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  const taskStats: TaskStats = data?.taskStats || {
    due: 0,
    completed: 0,
    "one-time": 0,
    recurring: 0,
  };

  return {
    tasks: transformedTasks,
    stats: taskStats,
    isLoading,
    error,
    refetch,
  };
};

// Mutation hook to complete a task
export const useCompleteAiTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aitaskApi.markTaskCompleted,
    onSuccess: (_, variables) => {
      // Invalidate and refetch task list for this listing
      queryClient.invalidateQueries({
        queryKey: ["aiTasks", variables.listingId],
      });
    },
  });
};

// Mutation hook to pending task
export const usePendingAiTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aitaskApi.markTaskPending,
    onSuccess: (_, variables) => {
      // Invalidate and refetch task list for this listing
      queryClient.invalidateQueries({
        queryKey: ["aiTasks", variables.listingId],
      });
    },
  });
};
