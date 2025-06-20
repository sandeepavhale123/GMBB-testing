import axiosInstance from "./axiosInstance";

export interface EnableDisableListingsPayload {
  listingIds: number[];
  accountId: number;
  isActive: number;
}

export interface EnableDisableListingsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const enableDisableListings = async (
  payload: EnableDisableListingsPayload
): Promise<EnableDisableListingsResponse> => {
  const response = await axiosInstance.post("/change-listing-status", payload);
  return response.data;
};
