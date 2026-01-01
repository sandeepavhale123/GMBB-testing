import React, { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentHistoryItem } from "@/types/paymentTypes";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentItem: PaymentHistoryItem;
}
export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  paymentItem,
}) => {
  const { t } = useI18nNamespace("PaymentHistory/invoiceModal");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    if (!paymentItem) {
      toast({
        title: t("invoiceModal.error.title"),
        description: t("invoiceModal.error.noData"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);

      // Find the invoice content element
      const invoiceElement = document.querySelector(
        ".bg-white.p-6.rounded-lg.border"
      ) as HTMLElement;

      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Capture the invoice as an image using html2canvas
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `invoice-${paymentItem.transaction_id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: t("invoiceModal.success.title"),
            description: t("invoiceModal.success.downloaded"),
          });
        }
      }, "image/png");
    } catch (error) {
      // console.error("Failed to capture invoice image:", error);
      toast({
        title: t("invoiceModal.error.title"),
        description: t("invoiceModal.error.captureFailed"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatAmount = (amount: number, currency: string): string => {
    return `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0 px-6 py-2 pb-6">
        <DialogHeader className="flex-row justify-between items-center">
          <DialogTitle>{t("invoiceModal.title")}</DialogTitle>
          {/* Download Button */}
          <div className="flex justify-end me-5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading || !paymentItem}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              {t("invoiceModal.download")}
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">{t("invoiceModal.loading")}</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        ) : paymentItem ? (
          <div className="bg-white p-6 rounded-lg border">
            {/* Billed From Section */}
            <div className="mb-6">
              {/* <div className="border-b-2 border-gray-300 pb-2 mb-4"> */}
              <h3 className="font-semibold text-gray-700">
                {t("invoiceModal.sections.billedFrom")}
              </h3>
              {/* </div> */}
              <div className="text-sm space-y-1">
                <div className="font-semibold">
                  {t("invoiceModal.info.name")}
                </div>
                <div>{t("invoiceModal.info.email")}</div>
                <div>{t("invoiceModal.info.house")}</div>
                <div>{t("invoiceModal.info.address")}</div>
                <div>{t("invoiceModal.info.city")}</div>
                <div>{t("invoiceModal.info.mobile")}</div>
              </div>
            </div>

            {/* Billed To Section */}
            <div className="mb-6 text-right">
              {/* <div className="border-b-2 border-gray-300 pb-2 mb-4"> */}
              <h3 className="text-right font-semibold text-gray-700">
                {t("invoiceModal.sections.billedTo")}
              </h3>
              {/* </div> */}
              <div className="text-sm space-y-1">
                <div className="font-semibold">{paymentItem.fullName}</div>
                <div>{paymentItem.email}</div>
                {paymentItem.city && paymentItem.state && (
                  <div>
                    {paymentItem.city}, {paymentItem.state}
                  </div>
                )}
              </div>
            </div>

            {/* Product Section */}
            <div className="mb-6">
              <div className="border-b-2 border-gray-300 pb-2 mb-4">
                <h3 className="text-center font-semibold text-gray-700">
                  {t("invoiceModal.sections.product")}
                </h3>
              </div>
              <div className="text-sm mb-4 font-semibold">
                {t("invoiceModal.sections.productDescription")}
              </div>

              <div className="border border-gray-300 rounded">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex">
                  <div className="w-16 font-semibold">
                    {t("invoiceModal.table.serial")}
                  </div>
                  <div className="flex-1 font-semibold">
                    {t("invoiceModal.table.product")}
                  </div>
                  <div className="w-24 font-semibold text-right">
                    {t("invoiceModal.table.total")}
                  </div>
                </div>
                <div className="px-4 py-2 flex">
                  <div className="w-16">1</div>
                  <div className="flex-1">
                    {t("invoiceModal.info.name")} - {paymentItem.plan_name}
                  </div>
                  <div className="w-24 text-right">
                    {formatAmount(paymentItem.amount, paymentItem.currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                {t("invoiceModal.invoiceInfo.transactionId")}:{" "}
                {paymentItem.transaction_id}
              </div>
              <div>
                {t("invoiceModal.invoiceInfo.date")}: {paymentItem.date}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t("invoiceModal.fallback.failed")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
