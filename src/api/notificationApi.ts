// src/api/notificationApi.ts
import axiosInstance from "./axiosInstance";

interface GetNotificationsRequest {
  page: number;
  limit: number;
}

export const getNotifications = async ({
  page,
  limit,
}: GetNotificationsRequest) => {
  try {
    console.log("🚀 Making notification API call with:", { page, limit });
    const response = await axiosInstance.post("/get-beamer-notification", {
      page,
      limit,
    });
    console.log("✅ Notification API response:", response);
    // Adjust depending on actual API response shape
    return response.data;
  } catch (error) {
    console.error("❌ Notification API error:", error);
    throw error;
  }
};
