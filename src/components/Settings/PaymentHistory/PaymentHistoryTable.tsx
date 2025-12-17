import React, { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { InvoiceModal } from "./InvoiceModal";
import { PaymentHistoryItem } from "@/types/paymentTypes";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PaymentHistoryTable: React.FC = () => {
  const {
    paymentHistory,
    isLoading,
    currentPage,
    totalPages,
    totalRecords,
    loadPage,
    refreshHistory,
  } = usePaymentHistory();

  const { t } = useI18nNamespace("PaymentHistory/paymentHistoryTable");

  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleViewInvoice = (payment: PaymentHistoryItem) => {
    setSelectedPayment(payment);
    setIsInvoiceModalOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedTransactionId(null);
  };

  const formatDateTime = (
    dateString: string
  ): { date: string; time: string } => {
    // Fix AM/PM spacing if necessary
    const normalized = dateString.replace(/(am|pm)$/i, " $1");

    const parsedDate = new Date(normalized);
    if (isNaN(parsedDate.getTime())) {
      return { date: "Invalid Date", time: "" };
    }

    const date = parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const time = parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date, time };
  };

  const formatAmount = (amount: number, currency: string): string => {
    return `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status as keyof typeof statusClasses] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => loadPage(currentPage - 1)}
          className={
            currentPage === 1
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    // Page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => loadPage(1)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => loadPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => loadPage(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => loadPage(currentPage + 1)}
          className={
            currentPage === totalPages
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    return items;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentHistoryTable.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>{t("paymentHistoryTable.loading")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentHistoryTable.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("paymentHistoryTable.empty.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("paymentHistoryTable.empty.description")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("paymentHistoryTable.title")}</CardTitle>
          <Button variant="outline" size="sm" onClick={refreshHistory}>
            {t("paymentHistoryTable.buttons.refresh")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("paymentHistoryTable.table.transactionId")}
                  </TableHead>
                  <TableHead>
                    {t("paymentHistoryTable.table.planName")}
                  </TableHead>
                  <TableHead>{t("paymentHistoryTable.table.amount")}</TableHead>
                  <TableHead>
                    {t("paymentHistoryTable.table.dateTime")}
                  </TableHead>
                  <TableHead>{t("paymentHistoryTable.table.email")}</TableHead>
                  <TableHead>{t("paymentHistoryTable.table.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("paymentHistoryTable.table.invoice")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="cursor-pointer hover:text-primary truncate max-w-[80px] inline-block align-middle"
                              onClick={() => {
                                navigator.clipboard.writeText(payment.transaction_id);
                                toast.success("Transaction ID copied to clipboard");
                              }}
                            >
                              {payment.transaction_id.length > 8
                                ? `${payment.transaction_id.slice(0, 8)}...`
                                : payment.transaction_id}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{payment.transaction_id}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.plan_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <div>{formatDateTime(payment.date).date}</div>
                      <div className="text-xs text-gray-500">
                        {formatDateTime(payment.date).time}
                      </div>
                    </TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(payment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t("paymentHistoryTable.buttons.view")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div>
                  {t("paymentHistoryTable.pagination.showing")}{" "}
                  {(currentPage - 1) * 10 + 1}{" "}
                  {t("paymentHistoryTable.pagination.to")}{" "}
                  {Math.min(currentPage * 10, totalRecords)}
                  {t("paymentHistoryTable.pagination.of")} {totalRecords}{" "}
                  {t("paymentHistoryTable.pagination.results")}
                </div>
              </div>
              <Pagination>
                <PaginationContent>{renderPaginationItems()}</PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={handleCloseInvoiceModal}
          paymentItem={selectedPayment}
        />
      )}
    </>
  );
};
