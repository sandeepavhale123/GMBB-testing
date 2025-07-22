
import { useState, useEffect } from "react";
import { PaymentHistoryItem, PaymentHistoryResponse } from "@/types/paymentTypes";
import { getPaymentHistory } from "@/api/paymentHistoryApi";
import { toast } from "@/hooks/use-toast";

export const usePaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage] = useState(10);

  const fetchPaymentHistory = async (page: number = 1) => {
    try {
      setIsLoading(true);
      console.log("Fetching payment history for page:", page);
      
      const response: PaymentHistoryResponse = await getPaymentHistory(page, perPage);
      
      // Log the full response to debug API structure
      console.log("Payment history API response:", response);
      
      // Validate response structure
      if (!response) {
        throw new Error("No response received from payment history API");
      }
      
      // Handle case where response.data might be undefined or not an array
      const paymentData = Array.isArray(response.data) ? response.data : [];
      setPaymentHistory(paymentData);
      
      // Safely handle pagination object with defaults
      if (response.pagination) {
        setCurrentPage(response.pagination.current_page || 1);
        setTotalPages(response.pagination.total_pages || 1);
        setTotalRecords(response.pagination.total_records || 0);
      } else {
        console.warn("Pagination object missing from API response");
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRecords(paymentData.length);
      }
      
      console.log("Payment history loaded successfully:", {
        dataCount: paymentData.length,
        currentPage: response.pagination?.current_page || 1,
        totalPages: response.pagination?.total_pages || 1,
        totalRecords: response.pagination?.total_records || 0
      });
      
    } catch (error) {
      console.error("Payment history fetch error:", error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Check if it's a network error or API not implemented
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        toast({
          title: "Feature Not Available",
          description: "Payment history feature is not yet implemented on the server.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Network Error") || errorMessage.includes("ERR_NETWORK")) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your connection.",
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
    console.log("Refreshing payment history...");
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
