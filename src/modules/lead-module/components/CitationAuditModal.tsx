import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CityPlacesInput, CityData } from "@/components/ui/city-places-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { useCreateLeadCitationReport } from "@/api/leadApi";
import { toast } from "sonner";
import { ReportProgressModal, ReportType } from "@/components/Dashboard/ReportProgressModal";
import { CopyUrlModal } from "@/components/Dashboard/CopyUrlModal";

const citationAuditSchema = z.object({
  businessName: z.string().min(1, "Business name is required."),
  phone: z.string().min(1, "Phone number is required."),
  keyword: z.string().min(1, "Keyword is required."),
  city: z.string().min(1, "City is required."),
});

type CitationAuditFormData = z.infer<typeof citationAuditSchema>;

interface CitationAuditModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  businessName?: string;
  phone?: string;
  onSuccess?: () => void;
}

export const CitationAuditModal: React.FC<CitationAuditModalProps> = ({
  open,
  onClose,
  leadId,
  businessName,
  phone,
  onSuccess,
}) => {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [reportProgressOpen, setReportProgressOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [reportUrl, setReportUrl] = useState<string>('');
  const [copyUrlModalOpen, setCopyUrlModalOpen] = useState(false);
  const createCitationReport = useCreateLeadCitationReport();

  const form = useForm<CitationAuditFormData>({
    resolver: zodResolver(citationAuditSchema),
    defaultValues: {
      businessName: businessName || "",
      phone: phone || "",
      keyword: "",
      city: "",
    },
  });

  // Auto-fill form when businessName or phone props change
  useEffect(() => {
    if (businessName) {
      form.setValue("businessName", businessName);
    }
    if (phone) {
      form.setValue("phone", phone);
    }
  }, [businessName, phone, form]);

  const handleCitySelect = (selectedCityData: CityData) => {
    setCityData(selectedCityData);
    form.setValue("city", selectedCityData.formattedAddress);
    form.clearErrors("city");
  };

  const onSubmit = async (data: CitationAuditFormData) => {
    if (!cityData) {
      toast.error("Please select a valid city");
      return;
    }

    const payload = {
      leadId,
      bname: data.businessName,
      phone: data.phone,
      city: data.city,
      keyword: data.keyword,
      lat: cityData.latitude,
      long: cityData.longitude,
      short_country: cityData.country,
    };

    setReportUrl('');
    setReportProgressOpen(true);
    setReportStatus('loading');

    createCitationReport.mutate(payload, {
      onSuccess: (response) => {
        setReportStatus('success');
        setReportUrl(response.data.reportUrl || '');
        
        // Call the onSuccess callback to refetch data
        onSuccess?.();
        
        // Close the main modal
        onClose();
        form.reset();
        setCityData(null);
      },
      onError: (error: any) => {
        setReportStatus('error');
        toast.error(error?.response?.data?.message || "Failed to create citation audit report");
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setCityData(null);
  };

  const handleReportProgressSuccess = () => {
    setReportProgressOpen(false);
    setReportStatus(null);
    setCopyUrlModalOpen(true);
  };

  const handleReportProgressClose = (open: boolean) => {
    setReportProgressOpen(open);
    if (!open) {
      setReportStatus(null);
      setReportUrl('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Generate Citation Audit Report</DialogTitle>
              <DialogDescription>
                Fill in the business details to generate a comprehensive citation audit report.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyword *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter target keyword"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <CityPlacesInput
                      placeholder="Search for city"
                      onPlaceSelect={handleCitySelect}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createCitationReport.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCitationReport.isPending}
              >
                {createCitationReport.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* Report Progress Modal */}
      {reportStatus && (
        <ReportProgressModal
          open={reportProgressOpen}
          onOpenChange={handleReportProgressClose}
          reportType="citation-audit"
          status={reportStatus}
          onSuccess={handleReportProgressSuccess}
        />
      )}

      {/* Copy URL Modal */}
      <CopyUrlModal
        open={copyUrlModalOpen}
        onOpenChange={setCopyUrlModalOpen}
        reportUrl={reportUrl}
      />
    </Dialog>
  );
};