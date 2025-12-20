import axiosInstance from "@/api/axiosInstance";

// Types
export interface SmtpPayload {
  fromName: string;
  rpyEmail: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
}

// Subdomain APIs
export const updateSubdomain = async (data: { subDomain: string }) => {
  const response = await axiosInstance.post("/update-subdomain", data);
  return response.data;
};

export const getSubdomainStatus = async () => {
  const response = await axiosInstance.post("/get-subdomain-status");
  return response.data;
};

export const deleteSubdomainDetails = async () => {
  const response = await axiosInstance.post("/delete-subdomain", {
    isDelete: "delete",
  });
  return response.data;
};

// SMTP APIs
export const getSmtpDetails = async (data: { listingId: number }) => {
  const response = await axiosInstance.post("/get-smtp-details", data);
  return response.data;
};

export const updateSmtpDetails = async (data: SmtpPayload) => {
  const response = await axiosInstance.post("/update-smtp-details", data);
  return response.data;
};

export const testSmtpDetails = async (data: SmtpPayload) => {
  const response = await axiosInstance.post("/test-smtp-details", data);
  return response.data;
};

export const deleteSmtpDetails = async () => {
  const response = await axiosInstance.post("/delete-smtp-details", {
    isDelete: "delete",
  });
  return response.data;
};

// Map API Key APIs
export const getMapApiKey = async () => {
  const response = await axiosInstance.post("/get-mapapi-key");
  return response.data;
};

export const updateMapApiKey = async (data: { apiKey: string }) => {
  const response = await axiosInstance.post("/update-apikey", data);
  return response.data;
};

export const deleteMapApiKey = async () => {
  const response = await axiosInstance.post("/delete-mapapi-key", {
    isDelete: "delete",
  });
  return response.data;
};

// Notification Settings APIs
export interface NotificationSettingsResponse {
  code: number;
  message: string;
  data: {
    notification: {
      gmbPostType: string;
      gmbReviewType: string;
      geoRankingType: string;
      gmbPostSetting?: string[];
      gmbReviewSetting?: string[];
    };
  };
}

export const getNotificationSettings = async () => {
  const response = await axiosInstance.post("/get-notification-setting");
  return response.data as NotificationSettingsResponse;
};

export interface UpdateNotificationSettingsPayload {
  gmbPostType: number;
  gmbReviewType: number;
  geoRankingType: number;
  gmbPostSetting?: string[];
  gmbReviewSetting?: string[];
}

export interface UpdateNotificationSettingsResponse {
  code: number;
  message: string;
  data: [];
}

export const updateNotificationSettings = async (data: UpdateNotificationSettingsPayload) => {
  const response = await axiosInstance.post("/update-notification-setting", data);
  return response.data as UpdateNotificationSettingsResponse;
};

// Custom Email Notification APIs
export interface CustomEmailSettingPayload {
  locationIds: number[];
  email: string;
}

export interface CustomEmailSettingResponse {
  code: number;
  message: string;
  data: [];
}

export interface GetCustomEmailSettingsPayload {
  page: number;
  limit: number;
  search: string;
}

export interface CustomEmailNotification {
  id: string;
  locationName: string;
  cc_email: string;
}

export interface GetCustomEmailSettingsResponse {
  code: number;
  message: string;
  data: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    results: CustomEmailNotification[];
  };
}

export const getCustomEmailSettings = async (data: GetCustomEmailSettingsPayload) => {
  const response = await axiosInstance.post("/get-custom-email-setting", data);
  return response.data as GetCustomEmailSettingsResponse;
};

export const updateCustomEmailSetting = async (data: CustomEmailSettingPayload) => {
  const response = await axiosInstance.post("/update-custom-email-setting", data);
  return response.data as CustomEmailSettingResponse;
};

// Delete Custom Email Notification APIs
export interface DeleteCustomEmailSettingPayload {
  listingIds: number[];
}

export interface DeleteCustomEmailSettingResponse {
  code: number;
  message: string;
  data: [];
}

export const deleteCustomEmailSetting = async (data: DeleteCustomEmailSettingPayload) => {
  const response = await axiosInstance.post("/delete-custom-email-setting", data);
  return response.data as DeleteCustomEmailSettingResponse;
};
