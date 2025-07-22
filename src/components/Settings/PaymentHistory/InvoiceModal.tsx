import React, { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getInvoiceDetails } from "@/api/paymentHistoryApi";
import { InvoiceDetails } from "@/types/paymentTypes";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}
export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  transactionId
}) => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  React.useEffect(() => {
    if (isOpen && transactionId) {
      fetchInvoiceDetails();
    }
  }, [isOpen, transactionId]);
  const fetchInvoiceDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsUsingMockData(false);
      console.log("Fetching invoice details for:", transactionId);
      const details = await getInvoiceDetails(transactionId);
      console.log("Retrieved invoice details:", details);
      setInvoiceDetails(details);

      // Check if we're using mock data
      if (details.customer.name === "John Doe" && details.customer.email === "john.doe@example.com") {
        setIsUsingMockData(true);
      }
    } catch (error) {
      console.error("Failed to fetch invoice details:", error);
      setError("Failed to load invoice details. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load invoice details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = async () => {
    if (!invoiceDetails) {
      toast({
        title: "Error",
        description: "No invoice data available to download.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      // Find the invoice content element
      const invoiceElement = document.querySelector('.bg-white.p-6.rounded-lg.border') as HTMLElement;
      
      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Capture the invoice as an image using html2canvas
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `invoice-${invoiceDetails.transaction_id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Success",
            description: "Invoice image downloaded successfully."
          });
        }
      }, 'image/png');
      
    } catch (error) {
      console.error("Failed to capture invoice image:", error);
      toast({
        title: "Error",
        description: "Failed to capture invoice image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatAmount = (amount: number, currency: string): string => {
    return `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        {isUsingMockData}

        {isLoading ? <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading invoice details...</span>
          </div> : error ? <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchInvoiceDetails} variant="outline">
              Try Again
            </Button>
          </div> : invoiceDetails ? <div className="bg-white p-6 rounded-lg border">
            {/* Billed From Section */}
            <div className="mb-6">
              <div className="border-b-2 border-gray-300 pb-2 mb-4">
                <h3 className="text-center font-semibold text-gray-700">
                  Billed From
                </h3>
              </div>
              <div className="text-sm space-y-1">
                <div className="font-semibold">GMB Briefcase</div>
                <div>sales@citationbuilderpro.com</div>
                <div>T-16 Software Technology Park India,</div>
                <div>Opp Garware Stadium, Cikalthana MIDC</div>
                <div>Aurangabad - 431005</div>
                <div>9822298988</div>
              </div>
            </div>

            {/* Billed To Section */}
            <div className="mb-6">
              <div className="border-b-2 border-gray-300 pb-2 mb-4">
                <h3 className="text-center font-semibold text-gray-700">
                  Billed To
                </h3>
              </div>
              <div className="text-sm space-y-1">
                <div className="font-semibold">{invoiceDetails.customer.name}</div>
                <div>{invoiceDetails.customer.email}</div>
                {invoiceDetails.customer.address && <div>{invoiceDetails.customer.address}</div>}
                {invoiceDetails.customer.city && invoiceDetails.customer.state && <div>{invoiceDetails.customer.city}, {invoiceDetails.customer.state}</div>}
              </div>
            </div>

            {/* Product Section */}
            <div className="mb-6">
              <div className="border-b-2 border-gray-300 pb-2 mb-4">
                <h3 className="text-center font-semibold text-gray-700">
                  Product
                </h3>
              </div>
              <div className="text-sm mb-4 font-semibold">
                PRODUCT DESCRIPTION & DETAILS:
              </div>
              
              <div className="border border-gray-300 rounded">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex">
                  <div className="w-16 font-semibold">S. No.</div>
                  <div className="flex-1 font-semibold">Product</div>
                  <div className="w-24 font-semibold text-right">Total</div>
                </div>
                <div className="px-4 py-2 flex">
                  <div className="w-16">1</div>
                  <div className="flex-1">GMB Briefcase - {invoiceDetails.plan_name}</div>
                  <div className="w-24 text-right">
                    {formatAmount(invoiceDetails.amount, invoiceDetails.currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Transaction ID: {invoiceDetails.transaction_id}</div>
              <div>Date: {formatDate(invoiceDetails.date)}</div>
            </div>
          </div> : <div className="text-center py-8 text-gray-500">
            Failed to load invoice details.
          </div>}
          
          {/* Download Button */}
          <div className="flex justify-end mt-6">
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading || !invoiceDetails}>
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Download
            </Button>
          </div>
        </DialogContent>
    </Dialog>;
};