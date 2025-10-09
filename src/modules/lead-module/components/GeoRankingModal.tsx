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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useCreateGeoReport } from "@/api/leadApi";
import { toast } from "sonner";
import {
  processDistanceValue,
  getDistanceOptions,
} from "@/utils/geoRankingUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface GeoRankingModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess?: () => void;
  onReportProgress?: (
    status: "loading" | "success" | "error",
    url?: string
  ) => void;
  onReportSuccess?: (url: string) => void;
}

export const GeoRankingModal: React.FC<GeoRankingModalProps> = ({
  open,
  onClose,
  leadId,
  onSuccess,
  onReportProgress,
  onReportSuccess,
}) => {
  const { t } = useI18nNamespace("Laed-module-component/GeoRankingModal");

  const geoRankingSchema = z.object({
    keywords: z
      .string()
      .min(1, t("geoRanking.validation.keywordsMin"))
      .refine((val) => {
        const keywordsList = val
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        return keywordsList.length <= 3;
      }, t("geoRanking.validation.maxKeyword"))
      .refine((val) => {
        const keywordsList = val
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        return keywordsList.length > 0;
      }, t("geoRanking.validation.keywords")),
    gridSize: z
      .number()
      .refine((val) => val === 3 || val === 5, t("geoRanking.validation.grid")),
    distanceUnit: z.enum(["Meters", "Miles"]),
    distanceValue: z.string().min(1, t("geoRanking.validation.distance")),
  });

  type GeoRankingFormData = z.infer<typeof geoRankingSchema>;

  const createGeoReport = useCreateGeoReport();
  const navigate = useNavigate();

  const form = useForm<GeoRankingFormData>({
    resolver: zodResolver(geoRankingSchema),
    defaultValues: {
      keywords: "",
      gridSize: 3,
      distanceUnit: "Meters",
      distanceValue: "100",
    },
  });

  const distanceUnit = form.watch("distanceUnit");
  const distanceOptions = getDistanceOptions(distanceUnit);

  const onSubmit = async (data: GeoRankingFormData) => {
    const payload = {
      reportId: leadId,
      keywords: data.keywords,
      distanceUnit: data.distanceUnit,
      distanceValue: processDistanceValue(
        data.distanceValue,
        data.distanceUnit
      ),
      gridSize: data.gridSize,
    };

    // Use parent handler for progress modal
    onReportProgress?.("loading");

    createGeoReport.mutate(payload, {
      onSuccess: (response) => {
        const reportUrl = response.data.reportUrl || "";
        onReportSuccess?.(reportUrl);

        // Call the onSuccess callback to refetch data
        onSuccess?.();

        // Close the main modal
        onClose();
        form.reset();
      },
      onError: (error: any) => {
        onReportProgress?.("error");
        toast.error(
          error?.response?.data?.message || t("geoRanking.errors.failed")
        );
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("geoRanking.title")}</DialogTitle>
          <DialogDescription>{t("geoRanking.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("geoRanking.form.keywords")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("geoRanking.form.keywordsPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gridSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("geoRanking.form.gridSize")}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("geoRanking.form.gridSizePlaceholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3">3x3</SelectItem>
                      <SelectItem value="5">5x5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("geoRanking.form.distanceUnit")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Meters" id="meters" />
                        <FormLabel htmlFor="meters" className="font-normal">
                          {t("geoRanking.form.meters")}
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Miles" id="miles" />
                        <FormLabel htmlFor="miles" className="font-normal">
                          {t("geoRanking.form.miles")}
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("geoRanking.form.distanceValue")}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "geoRanking.form.distanceValuePlaceholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {distanceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createGeoReport.isPending}
              >
                {t("geoRanking.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={createGeoReport.isPending}>
                {createGeoReport.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("geoRanking.buttons.generate")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
