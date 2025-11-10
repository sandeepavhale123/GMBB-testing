import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Eye } from "lucide-react";
import { toast } from "@/hooks/toast/use-toast";
import { cn } from "@/lib/utils";
import { FormField } from "../../types/formBuilder.types";
import { FormBuilderModal } from "../components/FormBuilderModal";
import { saveFeedbackForm } from "@/utils/feedbackStorage";

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

const ratingThresholds = [
  { value: 3, label: "3 stars or above" },
  { value: 4, label: "4 stars or above" },
  { value: 5, label: "5 stars only" },
];

export const CreateFeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formName, setFormName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [title, setTitle] = useState("How was your experience with us?");
  const [subtitle, setSubtitle] = useState("We value your feedback and would love to hear from you.");
  const [positiveFeedbackTitle, setPositiveFeedbackTitle] = useState(
    "We'd love to hear from you! Share your experience by leaving us a review.",
  );
  const [reviewSiteUrls, setReviewSiteUrls] = useState<Record<string, string>>({});
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});
  const [positiveRatingThreshold, setPositiveRatingThreshold] = useState(4);
  const [successTitle, setSuccessTitle] = useState("Thank you for your feedback!");
  const [successSubtitle, setSuccessSubtitle] = useState(
    "We appreciate you taking the time to share your thoughts. Your feedback helps us improve our service.",
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        [siteId]: "Please enter a valid URL (e.g., https://example.com)",
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Validate URLs before saving
    const hasUrlErrors = Object.keys(urlErrors).length > 0;
    if (hasUrlErrors) {
      toast({
        title: "Invalid URLs",
        description: "Please fix invalid URLs before saving",
        variant: "destructive",
      });
      return;
    }

    if (!formName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a form name",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      name: formName,
      logo: logo || "",
      title,
      subtitle,
      positive_rating_threshold: positiveRatingThreshold,
      positive_feedback_title: positiveFeedbackTitle,
      positive_feedback_urls: reviewSiteUrls,
      success_title: successTitle,
      success_subtitle: successSubtitle,
      form_fields: formFields,
    };

    try {
      const savedForm = saveFeedbackForm(formData);

      toast({
        title: "Form Created",
        description: "Your feedback form has been created successfully",
      });

      // Navigate back to dashboard
      navigate("/module/reputation/v1/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save feedback form",
        variant: "destructive",
      });
    }
  };

  const stepTitles = [
    "Feedback Form Details",
    "Customization Options",
    "Positive Feedback Redirect",
    "Success Message",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{stepTitles[currentStep - 1]}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
              </div>
            </div>

            {/* Step 1: Feedback Form Details */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="text-sm font-medium">
                      Form Name *
                    </Label>
                    <Input
                      id="form-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g., Restaurant Feedback Form"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">This name is for your internal reference only</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="text-sm font-medium">
                      Logo
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  {/* Header with title and edit button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Feedback form</h3>
                    <Button variant="outline" size="sm" onClick={() => setIsFormBuilderOpen(true)}>
                      Edit
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
                              <SelectValue placeholder={field.placeholder || "Select an option"} />
                            </SelectTrigger>
                            <SelectContent className="bg-background z-50">
                              {field.options?.filter(opt => opt.value && opt.value.trim() !== '').map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "radio" ? (
                          <RadioGroup disabled className="space-y-2">
                            {field.options?.map((opt) => (
                              <div key={opt.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt.value} id={`preview-${field.id}-${opt.value}`} />
                                <Label htmlFor={`preview-${field.id}-${opt.value}`} className="text-xs">
                                  {opt.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : field.type === "checkbox-group" ? (
                          <div className="space-y-2">
                            {field.options?.map((opt) => (
                              <div key={opt.value} className="flex items-center space-x-2">
                                <Checkbox id={`preview-${field.id}-${opt.value}`} disabled />
                                <Label htmlFor={`preview-${field.id}-${opt.value}`} className="text-xs">
                                  {opt.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        ) : field.type === "file" ? (
                          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            {field.accept && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Accepted: {field.accept}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Input
                            type={field.type === "text" || field.type === "email" ? field.type : "text"}
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
                  Next
                </Button>
              </>
            )}

            {/* Step 2: Customization Options (same as step 1 for now) */}
            {currentStep === 2 && (
              <>
                <p className="text-sm text-muted-foreground">Review and adjust your form's branding elements</p>

                <div className="space-y-2">
                  <Label htmlFor="title-2" className="text-sm font-medium">
                    Form Title
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
                    Form Subtitle
                  </Label>
                  <Textarea
                    id="subtitle-2"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating-threshold" className="text-sm font-medium">
                    Positive Feedback Threshold
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Choose the minimum star rating that you consider as positive feedback
                  </p>
                  <Select
                    value={positiveRatingThreshold.toString()}
                    onValueChange={(value) => setPositiveRatingThreshold(Number(value))}
                  >
                    <SelectTrigger id="rating-threshold" className="w-full">
                      <SelectValue placeholder="Select rating threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      {ratingThresholds.map((threshold) => (
                        <SelectItem key={threshold.value} value={threshold.value.toString()}>
                          {threshold.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Positive Feedback Redirect */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="positive-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Textarea
                    id="positive-title"
                    value={positiveFeedbackTitle}
                    onChange={(e) => setPositiveFeedbackTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Enter positive feedback title..."
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Review Sites</Label>
                  <p className="text-xs text-muted-foreground">
                    Enter the review URLs where customers can leave their feedback. Only valid URLs will be displayed to
                    users.
                  </p>
                  <div className="space-y-3">
                    {reviewSites.map((site) => {
                      return (
                        <div key={site.id} className="space-y-2">
                          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                            <img src={site.logo} alt={`${site.name} logo`} className="w-6 h-6 object-contain" />
                            <span className="text-sm font-medium text-foreground min-w-[100px]">{site.name}</span>
                            <Input
                              placeholder="https://example.com/review"
                              value={reviewSiteUrls[site.id] || ""}
                              onChange={(e) => handleReviewSiteUrlChange(site.id, e.target.value)}
                              className={cn(
                                "flex-1",
                                urlErrors[site.id] && "border-destructive focus-visible:ring-destructive",
                              )}
                            />
                          </div>
                          {urlErrors[site.id] && <p className="text-xs text-destructive pl-4">{urlErrors[site.id]}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 4: Success Message */}
            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="success-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Textarea
                    id="success-title"
                    value={successTitle}
                    onChange={(e) => setSuccessTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Enter success message title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="success-subtitle" className="text-sm font-medium">
                    Subtitle
                  </Label>
                  <Textarea
                    id="success-subtitle"
                    value={successSubtitle}
                    onChange={(e) => setSuccessSubtitle(e.target.value)}
                    className="min-h-[60px] resize-none"
                    placeholder="Enter success message subtitle"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                    Previous
                  </Button>
                  <Button onClick={handleSave} className="flex-1" size="lg">
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Preview Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6 hidden lg:block">
            <h3 className="text-sm font-medium text-foreground">Preview</h3>

            <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[500px]">
              <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
                {/* Logo Display */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    {logo ? (
                      <img src={logo} alt="Logo Preview" className="h-20 object-contain" />
                    ) : (
                      <div className="bg-muted px-8 py-6 rounded text-center">
                        <span className="text-lg font-bold text-muted-foreground">LOGO</span>
                      </div>
                    )}
                  </div>
                  {formName && currentStep === 1 && (
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{formName}</p>
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
                            {field.label} {field.required && <span className="text-destructive">*</span>}
                          </Label>
                          {field.type === "textarea" ? (
                            <Textarea placeholder={field.placeholder || ""} className="min-h-[100px] resize-none" />
                          ) : field.type === "select" ? (
                            <Select>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={field.placeholder || "Select an option"} />
                              </SelectTrigger>
                              <SelectContent className="bg-background z-50">
                                {field.options?.filter(opt => opt.value && opt.value.trim() !== '').map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "radio" ? (
                            <RadioGroup className="space-y-2">
                              {field.options?.map((opt) => (
                                <div key={opt.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={opt.value} id={`live-${field.id}-${opt.value}`} />
                                  <Label htmlFor={`live-${field.id}-${opt.value}`} className="text-sm">
                                    {opt.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : field.type === "checkbox-group" ? (
                            <div className="space-y-2">
                              {field.options?.map((opt) => (
                                <div key={opt.value} className="flex items-center space-x-2">
                                  <Checkbox id={`live-${field.id}-${opt.value}`} />
                                  <Label htmlFor={`live-${field.id}-${opt.value}`} className="text-sm">
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
                                    console.log('File selected:', file.name);
                                  }
                                }}
                              />
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              {field.accept && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Accepted: {field.accept}
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
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">
                          Reset Form
                        </Button>
                        <Button className="flex-1">Submit Feedback</Button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="text-center space-y-4">
                      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                    </div>
                    <div className="flex justify-center gap-2 py-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} className="transition-transform hover:scale-110">
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
                      <h2 className="text-lg font-medium text-foreground">{positiveFeedbackTitle}</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                      {reviewSites
                        .filter((site) => reviewSiteUrls[site.id] && isValidUrl(reviewSiteUrls[site.id]))
                        .map((site) => {
                          return (
                            <button
                              key={site.id}
                              className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-transform hover:scale-105"
                            >
                              <img src={site.logo} alt={`${site.name} logo`} className="w-5 h-5 object-contain" />
                              <span>Review on {site.name}</span>
                            </button>
                          );
                        })}
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <div className="text-center space-y-4 py-8">
                    <h2 className="text-2xl font-bold text-foreground">{successTitle}</h2>
                    <p className="text-base text-muted-foreground">{successSubtitle}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
