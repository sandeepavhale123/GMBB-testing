import axiosInstance from "./axiosInstance";

export interface EnableDisableListingsPayload {
  listingIds: number[];
  accountId: number;
  isActive: number;
}

export interface EnableDisableListingsResponse {
  code: number;
  message: string;
  data: {
    activeListings: number;
    allowedListings: string;
  };
}

export const enableDisableListings = async (
  payload: EnableDisableListingsPayload
): Promise<EnableDisableListingsResponse> => {
  const response = await axiosInstance.post("/change-listing-status", payload);
  // console.log("listing status response", response.data);
  return response.data;
};
