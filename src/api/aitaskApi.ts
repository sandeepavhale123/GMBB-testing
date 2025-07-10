import axiosInstance from "./axiosInstance";

// Types for task details
export interface AiTask {
  id: string | number;
  task_key: string;
  task_name: string;
  task_description: string;
  frequency: string;
  url: string;
  target: string;
  sort_order: number;
  status?: "pending" | "in-progress" | "completed" | "due";
  priority?: "low" | "medium" | "high";
  category?: "seo" | "content" | "reviews" | "insights" | "listings";
  type?: "one-time" | "recurring";
  estimatedTime?: string;
}

// Task statistics from backend
export interface TaskStats {
  due: number;
  completed: number;
  "one-time": number;
  recurring: number;
}

// Full API response
export interface AiTasksResponse {
  taskDetails: AiTask[];
  taskStats: TaskStats;
  success?: boolean;
  message?: string;
}

// Request payload
export interface AiTasksRequest {
  listingId: number;
}

// API service
export const aitaskApi = {
  /**
   * Fetch AI tasks for a specific listing
   */
  getAiTasks: async (listingId: number): Promise<AiTasksResponse> => {
    const response = await axiosInstance.post("/view-aitask-list", {
      listingId,
      domainUrl: `${window.location.origin}/`,
    });

    const data = response.data?.data || {};
    const taskDetails = data.taskDetails || [];
    const taskStats = data.taskStats || {
      due: 0,
      completed: 0,
      "one-time": 0,
      recurring: 0,
    };

    return {
      taskDetails,
      taskStats,
      success: response.data?.code === 200,
      message: response.data?.message,
    };
  },

  markTaskCompleted: async ({
    taskId,
    listingId,
  }: {
    taskId: string | number;
    listingId: number;
  }) => {
    const response = await axiosInstance.post("/update-aitask", {
      taskId,
      listingId,
      status: "completed",
    });

    return response.data;
  },
  markTaskPending: async ({
    taskId,
    listingId,
  }: {
    taskId: string | number;
    listingId: number;
  }) => {
    const response = await axiosInstance.post("/update-aitask", {
      taskId,
      listingId,
      status: "due",
    });

    return response.data;
  },
};
