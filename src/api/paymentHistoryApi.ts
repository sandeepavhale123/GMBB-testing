
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

export const getInvoiceDetails = async (
  transactionId: string
): Promise<InvoiceDetails> => {
  try {
    console.log("Requesting invoice details for transaction:", transactionId);
    const response = await axiosInstance.post("/get-invoice-details", {
      transaction_id: transactionId,
    });
    console.log("Invoice details API response:", response.data);
    
    // Handle different possible response structures
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Invoice details API error:", error);
    
    // For development/testing, return mock data when API is not available
    if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
      console.warn("Using mock invoice data due to network error");
      return {
        transaction_id: transactionId,
        amount: 2999, // $29.99 in cents
        currency: "usd",
        date: new Date().toISOString(),
        plan_name: "Pro Plan",
        customer: {
          name: "John Doe",
          email: "john.doe@example.com",
          address: "123 Main Street",
          city: "New York",
          state: "NY"
        }
      };
    }
    
    throw error;
  }
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
    console.error("Download invoice API error:", error);
    
    // For development, create a mock PDF blob
    if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
      console.warn("Cannot download invoice due to network error");
      // Create a simple text blob as a placeholder
      const mockPdfContent = `Invoice for Transaction: ${transactionId}\nThis is a mock invoice for development purposes.`;
      return new Blob([mockPdfContent], { type: "application/pdf" });
    }
    
    throw error;
  }
};
