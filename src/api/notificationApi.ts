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
  const response = await axiosInstance.post("/get-beamer-notification", {
    page,
    limit,
  });
  console.log("response of notification", response);
  // Adjust depending on actual API response shape
  return response.data;
};
