import axiosInstance from "./axiosInstance";
import type {
  BusinessInfoRequest,
  BusinessInfoResponse,
  RefreshBusinessInfoRequest,
  RefreshBusinessInfoResponse,
} from "../types/businessInfoTypes";
import type { EditLogRequest, EditLogResponse } from "../types/editLogTypes";

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

    if (result.data && result.data.data) {
      return result.data.data;
    }
    return null;
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

    return result.data.data;
  } catch (error) {
    console.error("Failed to update business details:", error);
    throw error;
  }
};

export const getBusinessInfo = async (
  payload: BusinessInfoRequest
): Promise<BusinessInfoResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-business-info",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    console.error("Failed to fetch business info:", error);
    throw error;
  }
};

export const refreshBusinessInfo = async (
  payload: RefreshBusinessInfoRequest
): Promise<RefreshBusinessInfoResponse> => {
  try {
    const result = await axiosInstance({
      url: "/refresh-business-info",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    console.error("Failed to refresh business info:", error);
    throw error;
  }
};

export const getEditLogs = async (
  payload: EditLogRequest
): Promise<EditLogResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-edit-logs",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    console.error("Failed to fetch edit logs:", error);
    throw error;
  }
};
