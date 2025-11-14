import axiosInstance from "./axiosInstance";

export interface Goal {
  id: string;
  title: string;
  description: string;
}

export interface GoalListResponse {
  code: number;
  message: string;
  data: {
    goalList: Goal[];
    activeList: number[] | null;
  };
}

export interface UpdateGoalListPayload {
  listIds: number[] | null;
}

export interface UpdateGoalListResponse {
  listIds: number[] | null;
}

// Get goals list
export const getGoalList = async (): Promise<GoalListResponse> => {
  try {
    const response = await axiosInstance.get("/get-goal-list");
    return response.data;
  } catch (error) {
    // console.error("Error fetching goal list:", error);
    throw error;
  }
};

// Update selected goals
export const updateGoalList = async (
  payload: UpdateGoalListPayload
): Promise<UpdateGoalListResponse> => {
  try {
    const response = await axiosInstance.post("/update-goal-list", payload);
    return response.data;
  } catch (error) {
    // console.error("Error updating goal list:", error);
    throw error;
  }
};
