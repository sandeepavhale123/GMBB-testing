import axiosInstance from "./axiosInstance";
import { PaymentHistoryResponse, InvoiceDetails } from "@/types/paymentTypes";

export const getPaymentHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<PaymentHistoryResponse> => {
  const response = await axiosInstance.post("/get-payment-history", {
    page,
    limit,
  });
  return response.data;
};

export const downloadInvoice = async (transactionId: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.post(
      "/download-invoice",
      { transaction_id: transactionId },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    // console.error("Download invoice API error:", error);

    // For development, create a mock PDF blob
    if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      console.warn("Cannot download invoice due to network error");
      // Create a simple text blob as a placeholder
      const mockPdfContent = `Invoice for Transaction: ${transactionId}\nThis is a mock invoice for development purposes.`;
      return new Blob([mockPdfContent], { type: "application/pdf" });
    }

    throw error;
  }
};
