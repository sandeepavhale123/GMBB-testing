import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetFeedbackFormPublic,
  useSubmitFeedbackForm,
} from "@/api/reputationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { FormField } from "@/modules/Reputation-module/types/formBuilder.types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { languageMap } from "@/lib/languageMap";
import i18n from "@/i18n";

type FormStep = "rating" | "form" | "review-sites" | "success";

export const PublicFeedbackForm: React.FC = () => {
  const { t } = useI18nNamespace(
    "Reputation-module-v1-publicpages/PublicFeedbackForm"
  );
  const { formId } = useParams<{ formId: string }>();
  const { data, isLoading, error } = useGetFeedbackFormPublic(formId || "");
  const { mutate: submitFeedback } = useSubmitFeedbackForm();

  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [starRating, setStarRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👇 detect and apply API language
  useEffect(() => {
    if (data?.data?.language) {
      // Convert full name (like "german") to code (like "de")
      const langName = data.data.language.toLowerCase();
      const langCode = languageMap[langName] || "en"; // fallback to English
      if (i18n.language !== langCode) {
        i18n.changeLanguage(langCode);
      }
    }
  }, [data?.data?.language]);

  // Safe parser for formFields that handles multiple data formats
  const parseFormFields = (data: any): FormField[] => {
    try {
      const fields = data?.data?.formFields;

      // Case 1: Already an array
      if (Array.isArray(fields)) {
        return fields;
      }

      // Case 2: String that needs parsing
      if (typeof fields === "string" && fields.trim()) {
        try {
          const parsed = JSON.parse(fields);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          console.error("Failed to parse formFields string:", fields);
          return [];
        }
      }

      // Case 3: Invalid or missing
      console.warn("formFields is not an array or valid string:", fields);
      return [];
    } catch (error) {
      console.error("Error parsing formFields:", error);
      return [];
    }
  };

  // Safe parser for reviewSiteUrls that handles multiple data formats
  const parseReviewSiteUrls = (data: any): Record<string, string> => {
    try {
      const urls = data?.data?.reviewSiteUrls;

      // Case 1: Already an object
      if (urls && typeof urls === "object" && !Array.isArray(urls)) {
        return urls;
      }

      // Case 2: String that needs parsing
      if (typeof urls === "string" && urls.trim()) {
        try {
          const parsed = JSON.parse(urls);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return parsed;
          }
          console.error("Parsed reviewSiteUrls is not an object:", parsed);
          return {};
        } catch {
          console.error("Failed to parse reviewSiteUrls string:", urls);
          return {};
        }
      }

      // Case 3: Invalid or missing
      console.warn("reviewSiteUrls is not an object or valid string:", urls);
      return {};
    } catch (error) {
      console.error("Error parsing reviewSiteUrls:", error);
      return {};
    }
  };

  // Helper function to reorder formData based on form field order
  const reorderFormData = (
    data: Record<string, any>,
    fields: FormField[]
  ): Record<string, any> => {
    const orderedData: Record<string, any> = {};

    // Sort fields by order property
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);

    // Add each field's data in the correct order
    sortedFields.forEach((field) => {
      if (data.hasOwnProperty(field.name)) {
        orderedData[field.name] = data[field.name];
      }
    });

    // Add any extra fields that aren't in formFields (edge case)
    Object.keys(data).forEach((key) => {
      if (!orderedData.hasOwnProperty(key)) {
        orderedData[key] = data[key];
      }
    });

    return orderedData;
  };

  const formFields: FormField[] = parseFormFields(data);
  const reviewSiteUrls: Record<string, string> = parseReviewSiteUrls(data);

  const handleStarClick = (rating: number) => {
    setStarRating(rating);
    setIsSubmitting(true);

    // Reorder formData to match form field order
    const orderedFormData = reorderFormData(formData, formFields);

    // Submit feedback form to API
    submitFeedback(
      {
        formId: formId || "",
        starRating: rating,
        formData: orderedFormData,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);

          // Determine next step based on rating threshold
          if (rating >= (data?.data?.positiveRatingThreshold || 4)) {
            setCurrentStep("review-sites");
          } else {
            setCurrentStep("success");
          }
        },
        onError: (error: any) => {
          setIsSubmitting(false);

          // Show error toast only on failure
          toast({
            title: t("submissionFailed"),
            description:
              error?.response?.data?.message ||
              t("submissionFailedDescription"),
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleInputChange = (
    fieldName: string,
    value: any,
    isCheckbox = false
  ) => {
    setFormData((prev) => {
      if (isCheckbox) {
        // Handle checkbox group - toggle value in array
        const currentValues = (prev[fieldName] || []) as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [fieldName]: newValues };
      }
      return { ...prev, [fieldName]: value };
    });

    // Clear error when user interacts
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    formFields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation
      if (field.required) {
        if (field.type === "checkbox-group") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            errors[field.name] = `${field.label} ${t("required")}`;
          }
        } else if (field.type === "file") {
          if (!value) {
            errors[field.name] = `${field.label} ${t("required")}`;
          }
        } else if (!value) {
          errors[field.name] = `${field.label} ${t("required")}`;
        }
      }

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = t("validEmail");
        }
      }

      // File size validation
      if (field.type === "file" && value && field.maxFileSize) {
        if (value.size > field.maxFileSize * 1024 * 1024) {
          errors[field.name] = t("fileSize", { maxSize: field.maxFileSize });
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: t("validationErrorTitle"),
        description: t("validationErrorDescription"),
        variant: "destructive",
      });
      return;
    }

    // After form validation, go to rating step
    setCurrentStep("rating");
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || "";
    const error = formErrors[field.name];

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={error ? "border-destructive" : ""}
              rows={4}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.id}-${option.value}`}
                  />
                  <Label
                    htmlFor={`${field.id}-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              <SelectTrigger className={error ? "border-destructive" : ""}>
                <SelectValue placeholder={t("selectOption")} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {field.options
                  ?.filter((opt) => opt.value && opt.value.trim() !== "")
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "checkbox-group":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => {
                const isChecked =
                  Array.isArray(value) && value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`${field.id}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={() =>
                        handleInputChange(field.name, option.value, true)
                      }
                    />
                    <Label
                      htmlFor={`${field.id}-${option.value}`}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={field.id}
              type="file"
              accept={field.accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleInputChange(field.name, file);
                }
              }}
              className={error ? "border-destructive" : ""}
            />
            {field.accept && (
              <p className="text-xs text-muted-foreground">
                {t("accepted")}: {field.accept}
              </p>
            )}
            {field.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                {t("max", { size: field.maxFileSize })}
                {/* Max size: {field.maxFileSize}MB */}
              </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error || !data) {
    // Check if it's a 404 error
    const is404Error =
      (error as any)?.status === 404 ||
      (error as any)?.response?.status === 404;

    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {is404Error
                ? t("formNotFound")
                : error
                ? t("errorTitle")
                : t("notfound")}
            </h2>
            <p className="text-muted-foreground">
              {is404Error
                ? t("formNotFoundDescription")
                : error
                ? t("errorDescription")
                : t("formDesc")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formConfig = data.data;

  // Step 2: Star Rating (after form submission)
  if (currentStep === "rating") {
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6">
          {formConfig.logo && (
            <div className="flex justify-center mb-6">
              <img
                src={formConfig.logo}
                alt={formConfig.formName}
                className="h-20 w-auto object-contain"
              />
            </div>
          )}

          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {formConfig.title}
            </h2>
            <p className="text-muted-foreground">{formConfig.subtitle}</p>
          </div>

          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t("submitting")}</span>
            </div>
          )}

          <div className="flex justify-center gap-2 py-8">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleStarClick(rating)}
                onMouseEnter={() => setHoveredStar(rating)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={isSubmitting}
                className="transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star
                  className="h-12 w-12"
                  fill={
                    rating <= (hoveredStar || starRating) ? "#FFC107" : "none"
                  }
                  stroke={
                    rating <= (hoveredStar || starRating)
                      ? "#FFC107"
                      : "#9CA3AF"
                  }
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 1: Form Fields (initial step)
  if (currentStep === "form") {
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6">
          {formConfig.logo && (
            <div className="flex justify-center mb-4">
              <img
                src={formConfig.logo}
                alt={formConfig.formName}
                className="h-16 w-auto object-contain"
              />
            </div>
          )}

          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-foreground text-center">
              {formConfig.formName}
            </h2>
          </div>

          <div className="space-y-4">
            {formFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("noFields")}</p>
              </div>
            ) : (
              formFields
                .sort((a, b) => a.order - b.order)
                .map((field) => renderField(field))
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            {t("continue")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Review Sites (for positive ratings)
  if (currentStep === "review-sites") {
    const validReviewSites = Object.entries(reviewSiteUrls).filter(
      ([_, url]) => url && url.trim() !== ""
    );

    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {formConfig.positiveFeedbackTitle}
            </h2>
          </div>

          {validReviewSites.length > 0 && (
            <div className="space-y-3 pt-4">
              {validReviewSites.map(([site, url]) => (
                <Button
                  key={site}
                  onClick={() => window.open(url, "_blank")}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <img
                    src={`/lovable-uploads/social-icons/${site}.png`}
                    className="w-6 h-6"
                    alt=""
                  />
                  {t("leaveReviewOn")}
                  <span>{site.charAt(0).toUpperCase() + site.slice(1)}</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Step 4: Success Message
  if (currentStep === "success") {
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6 text-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {formConfig.successTitle}
            </h2>
            <p className="text-muted-foreground text-lg">
              {formConfig.successSubtitle}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
