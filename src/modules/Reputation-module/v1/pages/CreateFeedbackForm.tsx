import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FormField } from "../../types/formBuilder.types";
import { FormBuilderModal } from "../components/FormBuilderModal";
import {
  useCreateFeedbackForm,
  useUpdateFeedbackForm,
  useGetFeedbackForm,
} from "@/api/reputationApi";
import { FormCreatedSuccessModal } from "../components/FormCreatedSuccessModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

type ReviewSite = {
  id: string;
  name: string;
  logo: string;
  color: string;
  textColor: string;
};

const reviewSites: ReviewSite[] = [
  {
    id: "google",
    name: "Google",
    logo: "/lovable-uploads/social-icons/google.png",
    color: "#4285F4",
    textColor: "#fff",
  },
  {
    id: "facebook",
    name: "Facebook",
    logo: "/lovable-uploads/social-icons/facebook.png",
    color: "#1877F2",
    textColor: "#fff",
  },
  {
    id: "tripadvisor",
    name: "Tripadvisor",
    logo: "/lovable-uploads/social-icons/tripadvisor.png",
    color: "#00AF87",
    textColor: "#fff",
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    logo: "/lovable-uploads/social-icons/trustpilot.png",
    color: "#00B67A",
    textColor: "#fff",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "/lovable-uploads/social-icons/air-bnb.png",
    color: "#FF385C",
    textColor: "#fff",
  },
];

// URL validation helper
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

// Safe parser for formFields that handles multiple data formats
const parseFormFields = (fields: any): FormField[] => {
  try {
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
const parseReviewSiteUrls = (urls: any): Record<string, string> => {
  try {
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
    return {};
  } catch (error) {
    console.error("Error parsing reviewSiteUrls:", error);
    return {};
  }
};

export const CreateFeedbackForm: React.FC = () => {
  const { t } = useI18nNamespace(
    "Reputation-module-v1-pages/CreateFeedbackForm"
  );

  const ratingThresholds = [
    { value: 3, label: t("rating.lab1") },
    { value: 4, label: t("rating.lab2") },
    { value: 5, label: t("rating.lab3") },
  ];

  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const isEditMode = !!formId;
  const [currentStep, setCurrentStep] = useState(1);
  const [formName, setFormName] = useState("");
  const [formNameError, setFormNameError] = useState("");
  const [logoError, setLogoError] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [title, setTitle] = useState("How was your experience with us?");
  const [subtitle, setSubtitle] = useState(
    "We value your feedback and would love to hear from you."
  );
  const [positiveFeedbackTitle, setPositiveFeedbackTitle] = useState(
    "We'd love to hear from you! Share your experience by leaving us a review."
  );
  const [reviewSiteUrls, setReviewSiteUrls] = useState<Record<string, string>>(
    {}
  );
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});
  const [positiveRatingThreshold, setPositiveRatingThreshold] = useState(4);
  const [successTitle, setSuccessTitle] = useState(
    "Thank you for your feedback!"
  );
  const [successSubtitle, setSuccessSubtitle] = useState(
    "We appreciate you taking the time to share your thoughts. Your feedback helps us improve our service."
  );
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "field-name",
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      required: true,
      order: 0,
    },
    {
      id: "field-email",
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      required: true,
      order: 1,
    },
    {
      id: "field-comment",
      type: "textarea",
      label: "Comment",
      name: "comment",
      placeholder: "Enter your comment",
      required: true,
      order: 2,
    },
  ]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdFormUrl, setCreatedFormUrl] = useState("");

  const createFormMutation = useCreateFeedbackForm();
  const updateFormMutation = useUpdateFeedbackForm();
  const { data: existingFormData, isLoading: isLoadingForm } =
    useGetFeedbackForm(formId);

  // Pre-populate form fields when editing
  React.useEffect(() => {
    if (isEditMode && existingFormData?.data) {
      const data = existingFormData.data;

      // Basic fields
      setFormName(data.formName);
      setTitle(data.title);
      setSubtitle(data.subtitle);
      setPositiveFeedbackTitle(data.positiveFeedbackTitle);
      setPositiveRatingThreshold(data.positiveRatingThreshold);
      setSuccessTitle(data.successTitle);
      setSuccessSubtitle(data.successSubtitle);

      // Parse formFields safely (handles both string and array)
      const parsedFields = parseFormFields(data.formFields);
      if (parsedFields.length > 0) {
        setFormFields(parsedFields);
      }

      // Parse reviewSiteUrls safely (handles both string and object)
      const parsedUrls = parseReviewSiteUrls(data.reviewSiteUrls);
      setReviewSiteUrls(parsedUrls);

      // Set logo preview (URL from server)
      if (data.logo) {
        setLogo(data.logo);
        // Note: logoFile remains null since we're not re-uploading
      }
    }
  }, [isEditMode, existingFormData, formId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Clear logo error when user uploads
      if (logoError) {
        setLogoError("");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSiteUrlChange = (siteId: string, url: string) => {
    setReviewSiteUrls((prev) => ({
      ...prev,
      [siteId]: url,
    }));

    // Validate URL
    if (url && !isValidUrl(url)) {
      setUrlErrors((prev) => ({
        ...prev,
        [siteId]: t("messages.invalidUrlFormat"),
      }));
    } else {
      setUrlErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[siteId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    // Step 1 validation: Form name and logo are required
    if (currentStep === 1) {
      if (!formName.trim()) {
        setFormNameError(t("messages.formNameRequired"));
        return;
      }

      // Validate logo upload
      if (!logoFile && !logo) {
        setLogoError(t("messages.logoRequired"));
        // toast({
        //   title: t("messages.validationError"),
        //   description: t("messages.logoRequired"),
        //   variant: "destructive",
        // });
        return;
      }
    }

    // Step 3 validation: At least one valid review site URL is required
    if (currentStep === 3) {
      const validUrls = Object.entries(reviewSiteUrls).filter(
        ([_, url]) => url && isValidUrl(url)
      );

      if (validUrls.length === 0) {
        toast({
          title: t("messages.validationError"),
          description: t("messages.validUrlRequired"),
          variant: "destructive",
        });
        return;
      }

      // Check if there are any URL errors
      const hasUrlErrors = Object.keys(urlErrors).length > 0;
      if (hasUrlErrors) {
        toast({
          title: t("labels.invalid"),
          description: t("messages.invalidUrls"),
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast({
        title: t("messages.validationError"),
        description: t("messages.validMessage"),
        variant: "destructive",
      });
      return;
    }

    const hasUrlErrors = Object.keys(urlErrors).length > 0;
    if (hasUrlErrors) {
      toast({
        title: t("labels.invalid"),
        description: t("messages.invalidUrls"),
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditMode && formId) {
        // UPDATE MODE
        const response = await updateFormMutation.mutateAsync({
          formId,
          formName,
          logo: logoFile, // Only if new file uploaded
          formFields: JSON.stringify(formFields),
          title,
          subtitle,
          positiveRatingThreshold: positiveRatingThreshold.toString(),
          positiveFeedbackTitle,
          reviewSiteUrls: JSON.stringify(reviewSiteUrls),
          successTitle,
          successSubtitle,
        });

        toast({
          title: t("labels.success"),
          description: response.message || t("messages.updated"),
        });

        // Navigate back to dashboard after successful update
        navigate("/module/reputation/v1/dashboard");
      } else {
        // CREATE MODE
        const response = await createFormMutation.mutateAsync({
          formName,
          logo: logoFile,
          formFields: JSON.stringify(formFields),
          title,
          subtitle,
          positiveRatingThreshold: positiveRatingThreshold.toString(),
          positiveFeedbackTitle,
          reviewSiteUrls: JSON.stringify(reviewSiteUrls),
          successTitle,
          successSubtitle,
        });

        setCreatedFormUrl(response.data.form_url);
        setIsSuccessModalOpen(true);

        toast({
          title: t("labels.success"),
          description: response.message || t("messages.saved"),
        });
      }
    } catch (error: any) {
      // Extract error message from API response
      const apiErrorMessage = error?.response?.data?.message;

      // Use API error message if available, otherwise use fallback
      const errorDescription =
        apiErrorMessage ||
        (isEditMode ? t("messages.updateError") : t("messages.createError"));

      toast({
        title: t("labels.error"),
        description: errorDescription,
        variant: "destructive",
      });
    }
  };

  const stepTitles = [
    t("title.step1"),
    t("title.step2"),
    t("title.step3"),
    t("title.step4"),
  ];

  // Show loading state when fetching existing form data
  if (isEditMode && isLoadingForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t("messages.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditMode ? t("title.edit") : stepTitles[currentStep - 1]}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">
                  {
                    isEditMode
                      ? t("messages.editing")
                      : `${t("labels.step", {
                          currentStep,
                        })}`
                    //  `Step ${currentStep} of 4`
                  }
                </span>
              </div>
            </div>

            {/* Step 1: Feedback Form Details */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="text-sm font-medium">
                      {t("labels.formName")} *
                    </Label>
                    <Input
                      id="form-name"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        // Clear error when user types
                        if (formNameError) {
                          setFormNameError("");
                        }
                      }}
                      placeholder={t("placeholders.formName")}
                      className={cn(
                        "w-full",
                        formNameError &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {formNameError ? (
                      <p className="text-xs text-destructive">
                        {formNameError}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t("tooltips.formNameInfo")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="logo-upload"
                      className="text-sm font-medium"
                    >
                      {t("labels.logo")} *
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className={cn(
                        "w-full",
                        logoError &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {logoError ? (
                      <p className="text-xs text-destructive">{logoError}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t("tooltips.logoInfo")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  {/* Header with title and edit button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      {" "}
                      {t("labels.feedback")}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFormBuilderOpen(true)}
                    >
                      {t("buttons.edit")}
                    </Button>
                  </div>

                  {/* Form fields preview */}
                  <div className="space-y-3 bg-muted/30 p-4 rounded-md">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {field.label} {field.required && "*"}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            placeholder={field.placeholder || ""}
                            disabled
                            className="bg-background min-h-[80px] resize-none"
                          />
                        ) : field.type === "select" ? (
                          <Select disabled>
                            <SelectTrigger className="bg-background">
                              <SelectValue
                                placeholder={
                                  field.placeholder || t("placeholders.option")
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-background z-50">
                              {field.options
                                ?.filter(
                                  (opt) => opt.value && opt.value.trim() !== ""
                                )
                                .map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "radio" ? (
                          <RadioGroup disabled className="space-y-2">
                            {field.options?.map((opt) => (
                              <div
                                key={opt.value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={opt.value}
                                  id={`preview-${field.id}-${opt.value}`}
                                />
                                <Label
                                  htmlFor={`preview-${field.id}-${opt.value}`}
                                  className="text-xs"
                                >
                                  {opt.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : field.type === "checkbox-group" ? (
                          <div className="space-y-2">
                            {field.options?.map((opt) => (
                              <div
                                key={opt.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`preview-${field.id}-${opt.value}`}
                                  disabled
                                />
                                <Label
                                  htmlFor={`preview-${field.id}-${opt.value}`}
                                  className="text-xs"
                                >
                                  {opt.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        ) : field.type === "file" ? (
                          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {t("tooltips.uploadInfo")}
                            </p>
                            {field.accept && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("messages.accept", { field: field.accept })}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Input
                            type={
                              field.type === "text" || field.type === "email"
                                ? field.type
                                : "text"
                            }
                            placeholder={field.placeholder || ""}
                            disabled
                            className="bg-background"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <FormBuilderModal
                  open={isFormBuilderOpen}
                  onOpenChange={setIsFormBuilderOpen}
                  fields={formFields}
                  onSave={setFormFields}
                />

                <Button onClick={handleNext} className="w-full" size="lg">
                  {t("buttons.next")}
                </Button>
              </>
            )}

            {/* Step 2: Customization Options (same as step 1 for now) */}
            {currentStep === 2 && (
              <>
                <p className="text-sm text-muted-foreground">
                  {t("messages.review")}
                </p>

                <div className="space-y-2">
                  <Label htmlFor="title-2" className="text-sm font-medium">
                    {t("labels.formTitle")}
                  </Label>
                  <Textarea
                    id="title-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle-2" className="text-sm font-medium">
                    {t("labels.formSubtitle")}
                  </Label>
                  <Textarea
                    id="subtitle-2"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="rating-threshold"
                    className="text-sm font-medium"
                  >
                    {t("labels.positiveRatingThreshold")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("tooltips.ratingInfo")}
                  </p>
                  <Select
                    value={positiveRatingThreshold.toString()}
                    onValueChange={(value) =>
                      setPositiveRatingThreshold(Number(value))
                    }
                  >
                    <SelectTrigger id="rating-threshold" className="w-full">
                      <SelectValue placeholder={t("placeholders.rating")} />
                    </SelectTrigger>
                    <SelectContent>
                      {ratingThresholds.map((threshold) => (
                        <SelectItem
                          key={threshold.value}
                          value={threshold.value.toString()}
                        >
                          {threshold.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    {t("buttons.previous")}
                  </Button>
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    {t("buttons.next")}
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Positive Feedback Redirect */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="positive-title"
                    className="text-sm font-medium"
                  >
                    {t("labels.title")}
                  </Label>
                  <Textarea
                    id="positive-title"
                    value={positiveFeedbackTitle}
                    onChange={(e) => setPositiveFeedbackTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder={t("placeholders.postitve")}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    {" "}
                    {t("labels.reviewSites")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("tooltips.reviewSiteInfo")}
                  </p>
                  <div className="space-y-3">
                    {reviewSites.map((site) => {
                      return (
                        <div key={site.id} className="space-y-2">
                          <div className="flex flex-col items-start md:flex-row md:items-center gap-3 p-4 rounded-lg border bg-card">
                            <img
                              src={site.logo}
                              alt={`${t("tooltips.imgalt", {
                                site: site.name,
                              })}`}
                              className="w-6 h-6 object-contain"
                            />
                            <span className="text-sm font-medium text-foreground min-w-[100px]">
                              {site.name}
                            </span>
                            <Input
                              placeholder={t("placeholders.url")}
                              value={reviewSiteUrls[site.id] || ""}
                              onChange={(e) =>
                                handleReviewSiteUrlChange(
                                  site.id,
                                  e.target.value
                                )
                              }
                              className={cn(
                                "flex-1",
                                urlErrors[site.id] &&
                                  "border-destructive focus-visible:ring-destructive"
                              )}
                            />
                          </div>
                          {urlErrors[site.id] && (
                            <p className="text-xs text-destructive pl-4">
                              {urlErrors[site.id]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    {t("buttons.previous")}
                  </Button>
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    {t("buttons.next")}
                  </Button>
                </div>
              </>
            )}

            {/* Step 4: Success Message */}
            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="success-title"
                    className="text-sm font-medium"
                  >
                    {t("labels.title")}
                  </Label>
                  <Textarea
                    id="success-title"
                    value={successTitle}
                    onChange={(e) => setSuccessTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder={t("placeholders.successTitle")}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="success-subtitle"
                    className="text-sm font-medium"
                  >
                    {t("labels.subtitle")}
                  </Label>
                  <Textarea
                    id="success-subtitle"
                    value={successSubtitle}
                    onChange={(e) => setSuccessSubtitle(e.target.value)}
                    className="min-h-[60px] resize-none"
                    placeholder={t("placeholders.successSubtitle")}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    {t("buttons.previous")}
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                    size="lg"
                    disabled={
                      createFormMutation.isPending ||
                      updateFormMutation.isPending
                    }
                  >
                    {isEditMode
                      ? updateFormMutation.isPending
                        ? t("buttons.updating")
                        : t("buttons.update")
                      : createFormMutation.isPending
                      ? t("buttons.saving")
                      : t("buttons.save")}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Preview Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6 hidden lg:block">
            <h3 className="text-sm font-medium text-foreground">
              {" "}
              {t("preview.header")}
            </h3>

            <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[500px]">
              <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
                {/* Logo Display */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={t("preview.logoalt")}
                        className="h-20 object-contain"
                      />
                    ) : (
                      <div className="bg-muted px-8 py-6 rounded text-center">
                        <span className="text-lg font-bold text-muted-foreground">
                          {t("preview.logoPlaceholder")}
                        </span>
                      </div>
                    )}
                  </div>
                  {formName && currentStep === 1 && (
                    <div className="text-left">
                      <p className="text-lg font-medium text-foreground text-center">
                        {formName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Content based on current step */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-4">
                      {formFields.map((field) => (
                        <div key={field.id} className="space-y-1.5">
                          <Label className="text-sm font-medium">
                            {field.label}{" "}
                            {field.required && (
                              <span className="text-destructive">*</span>
                            )}
                          </Label>
                          {field.type === "textarea" ? (
                            <Textarea
                              placeholder={field.placeholder || ""}
                              className="min-h-[100px] resize-none"
                            />
                          ) : field.type === "select" ? (
                            <Select>
                              <SelectTrigger className="bg-background">
                                <SelectValue
                                  placeholder={
                                    field.placeholder ||
                                    t("placeholders.option")
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-background z-50">
                                {field.options
                                  ?.filter(
                                    (opt) =>
                                      opt.value && opt.value.trim() !== ""
                                  )
                                  .map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "radio" ? (
                            <RadioGroup className="space-y-2">
                              {field.options?.map((opt) => (
                                <div
                                  key={opt.value}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={opt.value}
                                    id={`live-${field.id}-${opt.value}`}
                                  />
                                  <Label
                                    htmlFor={`live-${field.id}-${opt.value}`}
                                    className="text-sm"
                                  >
                                    {opt.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : field.type === "checkbox-group" ? (
                            <div className="space-y-2">
                              {field.options?.map((opt) => (
                                <div
                                  key={opt.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`live-${field.id}-${opt.value}`}
                                  />
                                  <Label
                                    htmlFor={`live-${field.id}-${opt.value}`}
                                    className="text-sm"
                                  >
                                    {opt.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          ) : field.type === "file" ? (
                            <label
                              htmlFor={`file-${field.id}`}
                              className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors block"
                            >
                              <Input
                                id={`file-${field.id}`}
                                type="file"
                                accept={field.accept}
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    //
                                  }
                                }}
                              />
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {t("tooltips.uploadInfo")}
                              </p>
                              {field.accept && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t("messages.accept", {
                                    field: field.accept,
                                  })}
                                </p>
                              )}
                            </label>
                          ) : (
                            <Input
                              type={
                                field.type === "text" ||
                                field.type === "email" ||
                                field.type === "number" ||
                                field.type === "date"
                                  ? field.type
                                  : "text"
                              }
                              placeholder={field.placeholder || ""}
                            />
                          )}
                        </div>
                      ))}
                      <div className="flex gap-3 hidden">
                        <Button variant="outline" className="flex-1">
                          {t("buttons.reset")}
                        </Button>
                        <Button className="flex-1">
                          {" "}
                          {t("buttons.submit")}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="text-center space-y-4">
                      <h2 className="text-xl font-semibold text-foreground">
                        {title}
                      </h2>
                      {subtitle && (
                        <p className="text-sm text-muted-foreground">
                          {subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center gap-2 py-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className={`w-10 h-10 ${
                              star <= positiveRatingThreshold
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-lg font-medium text-foreground">
                        {positiveFeedbackTitle}
                      </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                      {reviewSites
                        .filter(
                          (site) =>
                            reviewSiteUrls[site.id] &&
                            isValidUrl(reviewSiteUrls[site.id])
                        )
                        .map((site) => {
                          return (
                            <button
                              key={site.id}
                              className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-transform hover:scale-105"
                            >
                              <img
                                src={site.logo}
                                alt={`${t("tooltips.imgalt", {
                                  site: site.name,
                                })}`}
                                className="w-5 h-5 object-contain"
                              />
                              <span>
                                {" "}
                                {t("tooltips.review", { name: site.name })}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <div className="text-center space-y-4 py-8">
                    <h2 className="text-2xl font-bold text-foreground">
                      {successTitle}
                    </h2>
                    <p className="text-base text-muted-foreground">
                      {successSubtitle}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <FormCreatedSuccessModal
        open={isSuccessModalOpen}
        onOpenChange={(isOpen) => {
          setIsSuccessModalOpen(isOpen);
          if (!isOpen) {
            navigate("/module/reputation/v1/dashboard");
          }
        }}
        formUrl={createdFormUrl}
        formName={formName}
      />
    </div>
  );
};
