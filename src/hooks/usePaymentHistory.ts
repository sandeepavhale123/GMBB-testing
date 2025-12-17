import { useState, useEffect } from "react";
import {
  PaymentHistoryItem,
  PaymentHistoryResponse,
} from "@/types/paymentTypes";
import { getPaymentHistory } from "@/api/paymentHistoryApi";
import { toast } from "@/hooks/use-toast";

export const usePaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage] = useState(10);

  const transformPaymentData = (apiData: any[]): PaymentHistoryItem[] => {
    return apiData.map((item, index) => ({
      id: item.id || `payment-${index}`,
      transaction_id: item.txn_id || item.transaction_id || "",
      amount:
        typeof item.Total === "string"
          ? parseFloat(item.Total) * 100
          : (item.Total || 0) * 100, // Convert to cents
      currency: item.currancy || item.currency || "usd",
      date: item.CreateTime || item.date || new Date().toISOString(),
      status: (item.Payment_state || item.status || "pending").toLowerCase() as
        | "paid"
        | "failed"
        | "pending",
      invoice_url: item.invoice_url,
      plan_name: item.plan_name || item.planName || "Unknown Plan",
      email: item.PayerMail,
      fullName: item.fullName,
      city: item.city,
      state: item.state,
    }));
  };

  const fetchPaymentHistory = async (page: number = 1) => {
    try {
      setIsLoading(true);

      const response: any = await getPaymentHistory(page, perPage);

      // Validate response structure
      if (!response) {
        throw new Error("No response received from payment history API");
      }

      // Handle the actual API structure - data.history contains the payment array
      let paymentData: any[] = [];
      if (
        response.data &&
        response.data.history &&
        Array.isArray(response.data.history)
      ) {
        paymentData = response.data.history;
      } else if (Array.isArray(response.data)) {
        paymentData = response.data;
      }

      // Transform the API data to match our interface
      const transformedData = transformPaymentData(paymentData);
      setPaymentHistory(transformedData);

      // Handle pagination - calculate from data since API doesn't provide pagination object
      const totalItems = paymentData.length;
      const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / perPage));

      setCurrentPage(page);
      setTotalPages(calculatedTotalPages);
      setTotalRecords(totalItems);
    } catch (error) {
      console.error("Payment history fetch error:", error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Check if it's a network error or API not implemented
      const errorMessage = (() => {
        if (error instanceof Error) {
          // Check if it's an Axios error with response property
          if (
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            error.response !== null
          ) {
            const response = error.response as any;
            if (response.data?.message) {
              return response.data.message;
            }
          }
          return error.message;
        }
        return "Unknown error";
      })();

      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        toast({
          title: "Feature Not Available",
          description:
            "Payment history feature is not yet implemented on the server.",
          variant: "destructive",
        });
      } else if (
        errorMessage.includes("Network Error") ||
        errorMessage.includes("ERR_NETWORK")
      ) {
        toast({
          title: "Connection Error",
          description:
            "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load payment history. Please try again.",
          variant: "destructive",
        });
      }

      // Reset to safe defaults
      setPaymentHistory([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchPaymentHistory(page);
    }
  };

  const refreshHistory = () => {
    fetchPaymentHistory(currentPage);
  };

  useEffect(() => {
    fetchPaymentHistory(1);
  }, []);

  return {
    paymentHistory,
    isLoading,
    currentPage,
    totalPages,
    totalRecords,
    perPage,
    loadPage,
    refreshHistory,
  };
};
