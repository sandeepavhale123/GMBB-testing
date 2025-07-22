
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
  const response = await axiosInstance.post("/get-invoice-details", {
    transaction_id: transactionId,
  });
  return response.data.data;
};

export const downloadInvoice = async (transactionId: string): Promise<Blob> => {
  const response = await axiosInstance.post(
    "/download-invoice",
    { transaction_id: transactionId },
    { responseType: "blob" }
  );
  return response.data;
};
