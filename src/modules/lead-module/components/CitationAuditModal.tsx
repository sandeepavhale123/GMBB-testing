import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2 } from "lucide-react";
import { useCreateLeadCitationReport } from "@/api/leadApi";
import { toast } from "sonner";

const citationAuditSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  phone: z.string().min(1, "Phone number is required"),
  keyword: z.string().min(1, "Keyword is required"),
  city: z.string().min(1, "City is required"),
});

type CitationAuditFormData = z.infer<typeof citationAuditSchema>;

interface CitationAuditModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
}

export const CitationAuditModal: React.FC<CitationAuditModalProps> = ({
  open,
  onClose,
  leadId,
}) => {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const createCitationReport = useCreateLeadCitationReport();
  const navigate = useNavigate();

  const form = useForm<CitationAuditFormData>({
    resolver: zodResolver(citationAuditSchema),
    defaultValues: {
      businessName: "",
      phone: "",
      keyword: "",
      city: "",
    },
  });

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

    createCitationReport.mutate(payload, {
      onSuccess: (response) => {
        toast.success("Citation audit report created successfully!");
        
        // Navigate to the report page
        navigate(`/module/lead/citation-audit-report/${response.data.reportId}`);
        
        onClose();
        form.reset();
        setCityData(null);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create citation audit report");
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setCityData(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Generate Citation Audit Report</DialogTitle>
          <DialogDescription>
            Fill in the business details to generate a comprehensive citation audit report.
          </DialogDescription>
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
    </Dialog>
  );
};