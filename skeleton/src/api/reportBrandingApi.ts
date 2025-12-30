import axiosInstance from "@/api/axiosInstance";

// Types
export interface ReportBrandingData {
  company_name: string;
  company_email: string;
  company_website: string;
  company_phone: string;
  company_address: string;
  company_logo?: string; // URL for existing logo
}

export interface UpdateReportBrandingPayload {
  company_name: string;
  company_email: string;
  company_website: string;
  company_phone: string;
  company_address: string;
  company_logo?: File;
}

// Get Report Branding
export const getReportBranding = async () => {
  const response = await axiosInstance.post("/get-report-branding");
  return response.data;
};

// Update Report Branding
export const updateReportBranding = async (
  data: UpdateReportBrandingPayload
) => {
  const formData = new FormData();

  formData.append("company_name", data.company_name);
  formData.append("company_email", data.company_email);
  formData.append("company_website", data.company_website);
  formData.append("company_phone", data.company_phone);
  formData.append("company_address", data.company_address);

  if (data.company_logo) {
    formData.append("company_logo", data.company_logo);
  }

  const response = await axiosInstance.post(
    "/update-report-branding",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Delete Report Branding
export const deleteReportBranding = async () => {
  const response = await axiosInstance.post("/delete-report-branding", {
    isDelete: "delete",
  });
  return response.data;
};
