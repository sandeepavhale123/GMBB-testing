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

// Twilio Types
export interface TwilioConnectPayload {
  account_sid: string;
  auth_token: string;
  config_name: string;
}

export interface TwilioSender {
  id: string;
  user_id: string;
  twilio_config_id: string;
  channel: "sms" | "whatsapp";
  sender_id: string;
  phone_number_sid: string;
  capabilities: string;
  display_name: string;
  country_code: string;
  status: string;
  is_default: string;
}

export interface TwilioConfig {
  id: string;
  user_id: string;
  config_name: string;
  account_sid: string;
  friendly_name: string;
  account_status: string;
  is_active: string;
  is_default: string;
  last_tested_at: string;
  test_status: string;
  test_error: string | null;
  webhook_url: string;
  auth_token_masked: string;
}

export interface TwilioStatusResponse {
  code: number;
  message: string;
  data: {
    config: TwilioConfig;
    senders: TwilioSender[];
  } | [] | null;
}

export interface TwilioConnectResponse {
  code: number;
  message: string;
  data: {
    config: TwilioConfig;
    account_info: {
      friendly_name: string;
      status: string;
      type: string;
      date_created: string;
    };
    webhook_url: string;
    sync_results: {
      senders: { sms: number; whatsapp: number };
      templates: { synced: number; skipped: number; errors: string[] };
    };
  };
}

// Twilio APIs
export const connectTwilio = async (data: TwilioConnectPayload) => {
  const response = await axiosInstance.post("/reputation/twilio/connect", data);
  return response.data as TwilioConnectResponse;
};

export const getTwilioStatus = async (): Promise<TwilioStatusResponse> => {
  const response = await axiosInstance.get("/reputation/twilio/status");
  return response.data;
};

export const disconnectTwilio = async (configId: string) => {
  const response = await axiosInstance.delete(`/reputation/twilio/configs/${configId}/delete`);
  return response.data;
};