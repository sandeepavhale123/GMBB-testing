// src/api/citation/createCitationReport.ts
import axiosInstance from "./axiosInstance";

export interface CreateCitationReportPayload {
  listingId: string | number;
  businessName: string;
  phone: string;
  address: string;
}

export const createCitationReport = async (
  data: CreateCitationReportPayload
) => {
  const response = await axiosInstance.post("/create-citation-report", data);
  return response.data;
};

export const getPossibleCitationList = async (listingId: number) => {
  const response = await axiosInstance.post("/get-possible-citation-list", {
    listingId,
  });
  return response.data;
};

export interface GetCitationReportPayload {
  listingId: string | number;
}

export const getCitationReport = async (data: GetCitationReportPayload) => {
  const response = await axiosInstance.post("/get-citation-report", data);
  return response.data;
};

export interface RefreshCitationReportPayload {
  listingId: string | number;
  isRefresh: "refresh";
}

export const refreshCitationReport = async (
  data: RefreshCitationReportPayload
) => {
  const response = await axiosInstance.post("/refresh-citation-report", data);
  return response.data;
};

// Place Order Setting Types
export interface PlaceOrderSettingResponse {
  place_status: 0 | 1;
  order_url: string;
  order_btn: string;
}

export interface UpdatePlaceOrderSettingPayload {
  order_url: string;
  order_btn: string;
}

export interface UpdatePlaceOrderStatusPayload {
  place_status: 0 | 1;
}

// Place Order Setting API Functions
export const getPlaceOrderSetting = async () => {
  const response = await axiosInstance.post("/get-placeorder-setting");
  return response.data;
};

export const updatePlaceOrderSetting = async (
  data: UpdatePlaceOrderSettingPayload
) => {
  const response = await axiosInstance.post("/update-placeorder-setting", data);
  return response.data;
};

export const updatePlaceOrderStatus = async (
  data: UpdatePlaceOrderStatusPayload
) => {
  const response = await axiosInstance.post("/update-placeorder-status", data);
  return response.data;
};
