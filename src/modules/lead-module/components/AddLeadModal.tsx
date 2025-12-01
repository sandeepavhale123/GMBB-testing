import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LeadGooglePlacesInput } from "./LeadGooglePlacesInput";
import {
  Plus,
  Building2,
  ExternalLink,
  Hash,
  Mail,
  Phone,
  MapPin,
  Loader2,
  X,
  Search,
} from "lucide-react";
import { addLead, AddLeadRequest } from "@/api/leadApi";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AddLeadModalProps {
  onSuccess?: () => void;
}

interface LeadFormData {
  businessName: string;
  address: string;
  mapUrl: string;
  cid: string;
  email?: string;
  phone?: string;
  location?: string;
  keyword?: string;
  inputMethod: "name" | "url" | "cid";
  latitude?: string;
  longitude?: string;
}

// Form validation schema

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ onSuccess }) => {
  const { t } = useI18nNamespace("Laed-module-component/AddLeadModal");

  const leadFormSchema = z
    .object({
      businessName: z.string().optional(),
      mapUrl: z.string().optional(),
      cid: z.string().optional(),
      email: z.string().email("Please enter a valid email").or(z.literal("")),
      phone: z.string().optional(),
      location: z.string().optional(),
      keyword: z.string().optional(),
      inputMethod: z.enum(["name", "url", "cid"]),
    })
    .superRefine((data, ctx) => {
      if (data.inputMethod === "name") {
        if (!data.businessName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["businessName"],
            message: t("addLead.validation.businessNameRequired"),
          });
        }
        if (!data.cid || !/^\d+$/.test(data.cid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["cid"],
            message: t("addLead.validation.cidInvalid"),
          });
        }
      }
      if (data.inputMethod === "url") {
        if (!data.mapUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mapUrl"],
            message: t("addLead.validation.mapUrlRequired"),
          });
        }
      }
      if (data.inputMethod === "cid") {
        if (!data.cid || !/^\d+$/.test(data.cid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["cid"],
            message: t("addLead.validation.cidNumeric"),
          });
        }
      }
    });

  const [open, setOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validate, getFieldError, hasFieldError, clearErrors } =
    useFormValidation(leadFormSchema);

  const [formData, setFormData] = useState<LeadFormData>({
    businessName: "",
    address: "",
    mapUrl: "",
    cid: "",
    email: "",
    phone: "",
    location: "",
    keyword: "",
    inputMethod: "name",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate form data
    const validation = validate(formData);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: t("addLead.error.validationTitle"),
        description: t("addLead.error.validationDesc"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare API request based on input method
      const apiRequest: AddLeadRequest = {
        inputtype:
          formData.inputMethod === "name"
            ? "0"
            : formData.inputMethod === "url"
            ? "1"
            : "2",
        inputtext:
          formData.inputMethod === "name"
            ? formData.cid
            : formData.inputMethod === "url"
            ? formData.mapUrl
            : formData.cid,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
        keyword: formData.keyword || undefined,
        // Send coordinates only for Google auto suggest (inputMethod: "name")
        coordinates:
          formData.inputMethod === "name" &&
          formData.latitude &&
          formData.longitude
            ? `${formData.latitude},${formData.longitude}`
            : undefined,
      };

      const response = await addLead(apiRequest);

      if (response.code === 200) {
        toast({
          title: t("addLead.success.title"),
          description: response.message || t("addLead.success.description"),
        });

        // Reset form and close modal
        setFormData({
          businessName: "",
          address: "",
          mapUrl: "",
          cid: "",
          email: "",
          phone: "",
          location: "",
          keyword: "",
          inputMethod: "name",
          latitude: "",
          longitude: "",
        });
        setShowOptionalDetails(false);
        clearErrors();
        setOpen(false);

        // Notify parent component
        onSuccess?.();
      } else {
        throw new Error(response.message || t("addLead.error.addFailedTitle"));
      }
    } catch (error) {
      console.error("Error adding lead:", error);

      // Extract backend message from API response
      const backendMessage = (error as any)?.response?.data?.message;

      if (backendMessage) {
        toast({
          variant: "destructive",
          title: backendMessage,
          description: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: t("addLead.error.addFailedTitle"),
          description: t("addLead.error.addFailedDesc"),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceSelect = useCallback(
    (business: {
      name: string;
      address: string;
      latitude: string;
      longitude: string;
      cid?: string;
      placeId?: string;
    }) => {
      setFormData((prev) => ({
        ...prev,
        businessName: business.name || "",
        address: business.address || "",
        cid: business.cid || "",
        latitude: business.latitude || "",
        longitude: business.longitude || "",
      }));
    },
    []
  );

  const isFromPac = (e: any) => {
    const original = e?.detail?.originalEvent as Event | undefined;
    const t =
      (original?.target as HTMLElement) || (e.target as HTMLElement | null);
    return !!t?.closest?.(".pac-container");
  };

  const renderPrimaryFields = () => {
    switch (formData.inputMethod) {
      case "name":
        return (
          <div className="space-y-2">
            <Label htmlFor="business-name">
              {t("addLead.fields.businessName")}
            </Label>
            <LeadGooglePlacesInput
              onPlaceSelect={handlePlaceSelect}
              placeholder={t("addLead.fields.businessPlaceholder")}
              defaultValue={formData.businessName}
            />
            {hasFieldError("businessName") && (
              <p className="text-sm text-destructive">
                {getFieldError("businessName")}
              </p>
            )}
            {hasFieldError("cid") && (
              <p className="text-sm text-destructive">{getFieldError("cid")}</p>
            )}
          </div>
        );
      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor="map-url">{t("addLead.fields.mapUrl")}</Label>
            <Input
              id="map-url"
              type="url"
              placeholder={t("addLead.fields.mapUrlPlaceholder")}
              value={formData.mapUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mapUrl: e.target.value }))
              }
            />
            {hasFieldError("mapUrl") && (
              <p className="text-sm text-destructive">
                {getFieldError("mapUrl")}
              </p>
            )}
          </div>
        );
      case "cid":
        return (
          <div className="space-y-2">
            <Label htmlFor="cid"> {t("addLead.fields.cid")}</Label>
            <Input
              id="cid"
              placeholder={t("addLead.fields.cidPlaceholder")}
              value={formData.cid}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cid: e.target.value }))
              }
            />
            {hasFieldError("cid") && (
              <p className="text-sm text-destructive">{getFieldError("cid")}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("addLead.button")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (isFromPac(e)) e.preventDefault();
        }}
        onFocusOutside={(e) => {
          if (isFromPac(e)) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isFromPac(e)) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t("addLead.title")}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t("addLead.inputMethod.label")}
            </Label>
            <RadioGroup
              value={formData.inputMethod}
              onValueChange={(value: "name" | "url" | "cid") =>
                setFormData((prev) => ({ ...prev, inputMethod: value }))
              }
              className="flex flex-col sm:flex-row sm:gap-6 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name" className="cursor-pointer">
                  {t("addLead.inputMethod.name")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url" className="cursor-pointer">
                  {t("addLead.inputMethod.url")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cid" id="cid" />
                <Label htmlFor="cid" className="cursor-pointer">
                  {t("addLead.inputMethod.cid")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Primary Fields */}
          <div className="space-y-4">{renderPrimaryFields()}</div>

          {/* Optional Details Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="optional-toggle" className="text-sm font-medium">
              {t("addLead.fields.optionalDetails")}
            </Label>
            <Switch
              id="optional-toggle"
              checked={showOptionalDetails}
              onCheckedChange={setShowOptionalDetails}
            />
          </div>

          {/* Optional Fields */}
          {showOptionalDetails && (
            <div className="space-y-4 border-t pt-4">
              {/* Two-column layout for optional fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{t("addLead.fields.email")}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("addLead.fields.emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  {hasFieldError("email") && (
                    <p className="text-sm text-destructive">
                      {getFieldError("email")}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{t("addLead.fields.phone")}</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("addLead.fields.phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{t("addLead.fields.location")}</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder={t("addLead.fields.locationPlaceholder")}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Keyword Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="keyword"
                    className="flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>{t("addLead.fields.keyword")}</span>
                  </Label>
                  <Input
                    id="keyword"
                    placeholder={t("addLead.fields.keywordPlaceholder")}
                    value={formData.keyword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        keyword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm mb-2">
                  {t("addLead.notes.latitudeLongitude")}
                </p>
                <p className="text-sm">{t("addLead.notes.freeText")}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              {t("addLead.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("addLead.adding")}
                </>
              ) : (
                t("addLead.button")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
