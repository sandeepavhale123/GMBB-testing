import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Copy, RotateCcw, Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface UtmTrackingBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtmTrackingBuilderModal: React.FC<
  UtmTrackingBuilderModalProps
> = ({ isOpen, onClose }) => {
  const { t } = useI18nNamespace("Utils/utmTrackingBuilder");

  const utmSchema = z.object({
    websiteUrl: z
      .string()
      .min(1, { message: t("modal.validation.url") })
      .transform((val) => {
        const trimmed = val.trim();
        if (!trimmed) return trimmed;
        
        // Check if user is trying to add a protocol (contains ://)
        if (trimmed.includes('://')) {
          // User has attempted a protocol, check if it's valid
          if (/^https?:\/\//i.test(trimmed)) {
            // Valid http/https protocol, return as-is
            return trimmed;
          } else {
            // Invalid protocol detected (like h://, htt://, etc.)
            // Return as-is and let URL validation fail with proper error
            return trimmed;
          }
        }
        
        // No protocol attempt detected, auto-add https://
        return `https://${trimmed}`;
      })
      .refine(
        (val) => {
          try {
            const url = new URL(val);
            return url.protocol === 'http:' || url.protocol === 'https:';
          } catch {
            return false;
          }
        },
        { message: t("modal.validation.url") }
      ),
    campaignName: z
      .string()
      .trim()
      .min(1, { message: t("modal.validation.campaign") }),
    campaignSource: z
      .string()
      .trim()
      .min(1, { message: t("modal.validation.Source") }),
    campaignMedium: z
      .string()
      .trim()
      .min(1, { message: t("modal.validation.Medium") }),
    campaignTerm: z
      .string()
      .trim()
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    campaignContent: z
      .string()
      .trim()
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
  });

  type UtmFormData = z.infer<typeof utmSchema>;

  const [generatedUrl, setGeneratedUrl] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UtmFormData>({
    resolver: zodResolver(utmSchema),
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    try {
      if (
        formValues.websiteUrl &&
        formValues.campaignName &&
        formValues.campaignSource &&
        formValues.campaignMedium
      ) {
        const url = new URL(formValues.websiteUrl);
        
        // Helper function to add params only if they have valid values
        const addParam = (key: string, value: string | undefined) => {
          if (value && value.trim()) {
            url.searchParams.set(key, value.trim());
          }
        };

        addParam("utm_campaign", formValues.campaignName);
        addParam("utm_source", formValues.campaignSource);
        addParam("utm_medium", formValues.campaignMedium);
        addParam("utm_term", formValues.campaignTerm);
        addParam("utm_content", formValues.campaignContent);
        
        setGeneratedUrl(url.toString());
      } else {
        setGeneratedUrl("");
      }
    } catch (error) {
      setGeneratedUrl("");
    }
  }, [formValues]);

  const handleCopyUrl = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast.success(t("modal.form.copySuccess"));
    }
  };

  const handleClearForm = () => {
    reset();
    setGeneratedUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5 text-primary" />
            {t("modal.title")}
          </DialogTitle>
        </DialogHeader>

        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">{t("modal.form.close")}</span>
        </DialogClose>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
          {/* Left Section - Info */}
          <div className="lg:col-span-2 bg-muted/50 p-6 rounded-lg border border-border space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("modal.info.title")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("modal.info.description")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {t("modal.info.example.title")}
              </h4>
              <div className="bg-background p-3 rounded border border-border">
                <code className="text-xs break-all text-muted-foreground">
                  {t("modal.info.example.url")}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {t("modal.info.benefits.title")}
              </h4>
              <ul className="space-y-2">
                {(Array.isArray(
                  t("modal.info.benefits.list", {
                    returnObjects: true,
                  })
                )
                  ? (t("modal.info.benefits.list", {
                      returnObjects: true,
                    }) as string[])
                  : []
                ).map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="lg:col-span-3 space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">
                  {t("modal.form.websiteUrl.label")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder={t("modal.form.websiteUrl.placeholder")}
                  {...register("websiteUrl")}
                />
                {errors.websiteUrl && (
                  <p className="text-xs text-destructive">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignName">
                  {t("modal.form.campaignName.label")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="campaignName"
                  placeholder={t("modal.form.campaignName.placeholder")}
                  {...register("campaignName")}
                />
                {errors.campaignName && (
                  <p className="text-xs text-destructive">
                    {errors.campaignName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignSource">
                    {t("modal.form.campaignSource.label")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="campaignSource"
                    placeholder={t("modal.form.campaignSource.placeholder")}
                    {...register("campaignSource")}
                  />
                  {errors.campaignSource && (
                    <p className="text-xs text-destructive">
                      {errors.campaignSource.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaignMedium">
                    {t("modal.form.campaignMedium.label")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="campaignMedium"
                    placeholder={t("modal.form.campaignMedium.placeholder")}
                    {...register("campaignMedium")}
                  />
                  {errors.campaignMedium && (
                    <p className="text-xs text-destructive">
                      {errors.campaignMedium.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignTerm">
                    {t("modal.form.campaignTerm.label")}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({t("modal.form.optional")})
                    </span>
                  </Label>
                  <Input
                    id="campaignTerm"
                    placeholder={t("modal.form.campaignTerm.placeholder")}
                    {...register("campaignTerm")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaignContent">
                    {t("modal.form.campaignContent.label")}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({t("modal.form.optional")})
                    </span>
                  </Label>
                  <Input
                    id="campaignContent"
                    placeholder={t("modal.form.campaignContent.placeholder")}
                    {...register("campaignContent")}
                  />
                </div>
              </div>
            </form>

            {generatedUrl && (
              <div className="space-y-2 pt-4 border-t border-border">
                <Label>{t("modal.form.generatedUrl")}</Label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted p-3 rounded border border-border">
                    <p className="text-sm break-all text-foreground">
                      {generatedUrl}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyUrl}
                    title={t("modal.form.copyUrl")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClearForm}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("modal.form.clearForm")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
