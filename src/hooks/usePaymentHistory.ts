
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
      const response: PaymentHistoryResponse = await getPaymentHistory(page, perPage);
      setPaymentHistory(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
      setTotalRecords(response.pagination.total_records);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      toast({
        title: "Error",
        description: "Failed to load payment history. Please try again.",
        variant: "destructive",
      });
      setPaymentHistory([]);
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
