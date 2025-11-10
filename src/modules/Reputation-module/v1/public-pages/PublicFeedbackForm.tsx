import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetFeedbackFormPublic } from "@/api/reputationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { FormField } from "@/modules/Reputation-module/types/formBuilder.types";

type FormStep = "rating" | "form" | "review-sites" | "success";

export const PublicFeedbackForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { data, isLoading, error } = useGetFeedbackFormPublic(formId || "");

  const [currentStep, setCurrentStep] = useState<FormStep>("rating");
  const [starRating, setStarRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse JSON fields
  const formFields: FormField[] = data?.data?.formFields
    ? JSON.parse(data.data.formFields)
    : [];
  const reviewSiteUrls: Record<string, string> = data?.data?.reviewSiteUrls
    ? JSON.parse(data.data.reviewSiteUrls)
    : {};

  const handleStarClick = (rating: number) => {
    setStarRating(rating);
    setCurrentStep("form");
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
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
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }

      // Email validation
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          errors[field.name] = "Please enter a valid email address";
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission (replace with actual API call later)
    setTimeout(() => {
      setIsSubmitting(false);

      // Check if rating meets threshold for review sites
      if (starRating >= (data?.data?.positiveRatingThreshold || 4)) {
        setCurrentStep("review-sites");
      } else {
        setCurrentStep("success");
      }
    }, 1000);
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
              {field.required && <span className="text-destructive ml-1">*</span>}
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
              {field.required && <span className="text-destructive ml-1">*</span>}
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
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">
            The feedback form you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formConfig = data.data;

  // Rating Step
  if (currentStep === "rating") {
    return (
      <div className="space-y-6">
        {formConfig.logo && (
          <div className="flex justify-center mb-6">
            <img
              src={formConfig.logo}
              alt={formConfig.formName}
              className="h-20 w-auto object-contain"
            />
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{formConfig.title}</h1>
          <p className="text-muted-foreground text-lg">{formConfig.subtitle}</p>
        </div>

        <div className="flex justify-center gap-2 py-8">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleStarClick(rating)}
              onMouseEnter={() => setHoveredStar(rating)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className="h-12 w-12"
                fill={
                  rating <= (hoveredStar || starRating)
                    ? "hsl(var(--chart-1))"
                    : "none"
                }
                stroke={
                  rating <= (hoveredStar || starRating)
                    ? "hsl(var(--chart-1))"
                    : "hsl(var(--muted-foreground))"
                }
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Form Step
  if (currentStep === "form") {
    return (
      <div className="space-y-6">
        {formConfig.logo && (
          <div className="flex justify-center mb-4">
            <img
              src={formConfig.logo}
              alt={formConfig.formName}
              className="h-16 w-auto object-contain"
            />
          </div>
        )}

        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-foreground">{formConfig.title}</h2>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                className="h-6 w-6"
                fill={rating <= starRating ? "hsl(var(--chart-1))" : "none"}
                stroke={
                  rating <= starRating
                    ? "hsl(var(--chart-1))"
                    : "hsl(var(--muted-foreground))"
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {formFields
            .sort((a, b) => a.order - b.order)
            .map((field) => renderField(field))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </div>
    );
  }

  // Review Sites Step
  if (currentStep === "review-sites") {
    const validReviewSites = Object.entries(reviewSiteUrls).filter(
      ([_, url]) => url && url.trim() !== ""
    );

    return (
      <div className="space-y-6 text-center">
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
                Leave a review on {site.charAt(0).toUpperCase() + site.slice(1)}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            ))}
          </div>
        )}

        <Button
          onClick={() => setCurrentStep("success")}
          variant="ghost"
          className="w-full mt-4"
        >
          Skip
        </Button>
      </div>
    );
  }

  // Success Step
  if (currentStep === "success") {
    return (
      <div className="space-y-6 text-center py-8">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            {formConfig.successTitle}
          </h2>
          <p className="text-muted-foreground text-lg">
            {formConfig.successSubtitle}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
