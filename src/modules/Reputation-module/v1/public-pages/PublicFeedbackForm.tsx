import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetFeedbackFormPublic } from "@/api/reputationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { FormField } from "@/modules/Reputation-module/types/formBuilder.types";

type FormStep = "rating" | "form" | "review-sites" | "success";

export const PublicFeedbackForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { data, isLoading, error } = useGetFeedbackFormPublic(formId || "");

  const [currentStep, setCurrentStep] = useState<FormStep>("form");
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
    
    // Determine next step based on rating threshold
    if (rating >= (data?.data?.positiveRatingThreshold || 4)) {
      setCurrentStep("review-sites");
    } else {
      setCurrentStep("success");
    }
  };

  const handleInputChange = (fieldName: string, value: any, isCheckbox = false) => {
    setFormData((prev) => {
      if (isCheckbox) {
        // Handle checkbox group - toggle value in array
        const currentValues = (prev[fieldName] || []) as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
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
        if (field.type === 'checkbox-group') {
          if (!value || !Array.isArray(value) || value.length === 0) {
            errors[field.name] = `${field.label} is required`;
          }
        } else if (field.type === 'file') {
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          }
        } else if (!value) {
          errors[field.name] = `${field.label} is required`;
        }
      }

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = "Please enter a valid email address";
        }
      }
      
      // File size validation
      if (field.type === 'file' && value && field.maxFileSize) {
        if (value.size > field.maxFileSize * 1024 * 1024) {
          errors[field.name] = `File size must be less than ${field.maxFileSize}MB`;
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

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              <SelectTrigger className={error ? "border-destructive" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {field.options?.filter(opt => opt.value && opt.value.trim() !== '').map((option) => (
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
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={() => handleInputChange(field.name, option.value, true)}
                    />
                    <Label htmlFor={`${field.id}-${option.value}`} className="cursor-pointer">
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
              {field.required && <span className="text-destructive ml-1">*</span>}
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
                Accepted: {field.accept}
              </p>
            )}
            {field.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                Max size: {field.maxFileSize}MB
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
    return (
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Form Not Found</h2>
            <p className="text-muted-foreground">
              The feedback form you're looking for doesn't exist or has been removed.
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

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              How would you rate your experience?
            </h1>
            <p className="text-muted-foreground text-lg">
              Please select a rating below
            </p>
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
                    rating <= (hoveredStar || starRating) ? "#FFC107" : "none"
                  }
                  stroke={
                    rating <= (hoveredStar || starRating) ? "#FFC107" : "#9CA3AF"
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

          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {formConfig.title}
            </h2>
            <p className="text-muted-foreground">{formConfig.subtitle}</p>
          </div>

          <div className="space-y-4">
            {formFields
              .sort((a, b) => a.order - b.order)
              .map((field) => renderField(field))}
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Continue
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
                  Leave a review on{" "}
                  {site.charAt(0).toUpperCase() + site.slice(1)}
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
