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
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CitationAuditModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  businessName?: string;
  phone?: string;
  onSuccess?: () => void;
  onReportProgress?: (
    status: "loading" | "success" | "error",
    url?: string
  ) => void;
  onReportSuccess?: (url: string) => void;
}

export const CitationAuditModal: React.FC<CitationAuditModalProps> = ({
  open,
  onClose,
  leadId,
  businessName,
  phone,
  onSuccess,
  onReportProgress,
  onReportSuccess,
}) => {
  const { t } = useI18nNamespace("Laed-module-component/CitationAuditModal");

  const citationAuditSchema = z.object({
    businessName: z.string().min(1, t("citationAudit.validation.business")),
    phone: z.string().min(1, t("citationAudit.validation.phone")),
    keyword: z.string().min(1, t("citationAudit.validation.keyword")),
    city: z.string().min(1, t("citationAudit.validation.city")),
  });

  type CitationAuditFormData = z.infer<typeof citationAuditSchema>;

  const [cityData, setCityData] = useState<CityData | null>(null);
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

    // Use parent handler for progress modal
    onReportProgress?.("loading");

    createCitationReport.mutate(payload, {
      onSuccess: (response) => {
        const reportUrl = response.data.reportUrl || "";
        onReportSuccess?.(reportUrl);

        // Call the onSuccess callback to refetch data
        onSuccess?.();

        // Close the main modal
        onClose();
        form.reset();
        setCityData(null);
      },
      onError: (error: any) => {
        onReportProgress?.("error");
        toast.error(
          error?.response?.data?.message ||
            t("citationAudit.errors.generateFailed")
        );
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setCityData(null);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{t("citationAudit.title")}</DialogTitle>
              <DialogDescription>
                {t("citationAudit.description")}
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
                  <FormLabel>{t("citationAudit.form.businessName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "citationAudit.form.businessNamePlaceholder"
                      )}
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
                  <FormLabel>{t("citationAudit.form.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("citationAudit.form.phonePlaceholder")}
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
                  <FormLabel>{t("citationAudit.form.keyword")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("citationAudit.form.keywordPlaceholder")}
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
                  <FormLabel>{t("citationAudit.form.city")}</FormLabel>
                  <FormControl>
                    <CityPlacesInput
                      placeholder={t("citationAudit.form.cityPlaceholder")}
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
                {t("citationAudit.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={createCitationReport.isPending}>
                {createCitationReport.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("citationAudit.buttons.generate")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
