import axiosInstance from "./axiosInstance";

export interface BusinessDetails {
  companyName: string;
  website: string;
  email: string;
  timezone: string;
  agencyType: string;
  manageListing: string;
}

export interface UpdateBusinessDetailsPayload {
  company_name: string;
  timezone: string;
  website: string;
  email: string;
  agencyType: string;
  manageListing: number;
}

export const getBusinessDetails = async (): Promise<BusinessDetails | null> => {
  try {
    const result = await axiosInstance({
      url: "/get-business-details",
      method: "GET",
    });

    console.log("Business API response:", result.data.data);

    if (result.data && result.data.data) {
      return result.data.data;
    }
    return null; // No business details found (first-time user)
  } catch (error) {
    console.error("Failed to fetch business details:", error);
    throw error;
  }
};

export const updateBusinessDetails = async (
  payload: UpdateBusinessDetailsPayload
): Promise<BusinessDetails> => {
  try {
    const result = await axiosInstance({
      url: "/update-business-details",
      method: "POST",
      data: payload,
    });

    console.log("Update business details response:", result.data.data);
    return result.data.data;
  } catch (error) {
    console.error("Failed to update business details:", error);
    throw error;
  }
};
