import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Upload, Star } from "lucide-react";
import { getFeedbackFormById, saveFeedbackResponse } from "@/utils/feedbackStorage";
import { toast } from "@/hooks/toast/use-toast";

export const PublicFeedbackForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [formTemplate, setFormTemplate] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [starRating, setStarRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showReviewSites, setShowReviewSites] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formId) {
      const form = getFeedbackFormById(formId);
      if (form) {
        setFormTemplate(form);
      } else {
        toast({
          title: "Form Not Found",
          description: "The feedback form you're looking for doesn't exist",
          variant: "destructive",
        });
      }
    }
  }, [formId]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (starRating === 0) {
      newErrors.starRating = "Please provide a star rating";
    }

    formTemplate.form_fields.forEach((field: any) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      saveFeedbackResponse(formId!, {
        star_rating: starRating,
        name: formData.name || "",
        email_or_phone: formData.email || formData.phone || "",
        comment: formData.comment || "",
        responses: formData,
      });

      // Check if rating meets positive threshold
      if (starRating >= formTemplate.positive_rating_threshold) {
        setShowReviewSites(true);
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  if (!formTemplate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full text-center space-y-4">
          {formTemplate.logo && (
            <img
              src={formTemplate.logo}
              alt="Logo"
              className="h-20 object-contain mx-auto"
            />
          )}
          <h2 className="text-2xl font-bold text-foreground">
            {formTemplate.success_title}
          </h2>
          <p className="text-muted-foreground">{formTemplate.success_subtitle}</p>
        </div>
      </div>
    );
  }

  // Review sites screen
  if (showReviewSites) {
    const validReviewUrls = Object.entries(formTemplate.positive_feedback_urls || {}).filter(
      ([_, url]) => url && String(url).trim() !== ""
    );

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
          {formTemplate.logo && (
            <div className="flex justify-center">
              <img
                src={formTemplate.logo}
                alt="Logo"
                className="h-20 object-contain"
              />
            </div>
          )}
          <div className="text-center">
            <h2 className="text-lg font-medium text-foreground">
              {formTemplate.positive_feedback_title}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {validReviewUrls.map(([siteId, url]) => (
              <a
                key={siteId}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium border bg-background hover:bg-accent transition-all"
              >
                Review on {siteId.charAt(0).toUpperCase() + siteId.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main feedback form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          {formTemplate.logo && (
            <div className="flex justify-center">
              <img
                src={formTemplate.logo}
                alt="Logo"
                className="h-20 object-contain"
              />
            </div>
          )}

          {/* Title and subtitle */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {formTemplate.title}
            </h2>
            {formTemplate.subtitle && (
              <p className="text-sm text-muted-foreground">
                {formTemplate.subtitle}
              </p>
            )}
          </div>

          {/* Star rating */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStarRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredStar || starRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.starRating && (
              <p className="text-sm text-destructive text-center">
                {errors.starRating}
              </p>
            )}
          </div>

          {/* Dynamic form fields */}
          {formTemplate.form_fields.map((field: any) => (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}{" "}
                {field.required && <span className="text-destructive">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={errors[field.name] ? "border-destructive" : ""}
                />
              ) : field.type === "select" ? (
                <Select
                  value={formData[field.name] || ""}
                  onValueChange={(value) => handleFieldChange(field.name, value)}
                >
                  <SelectTrigger
                    className={errors[field.name] ? "border-destructive" : ""}
                  >
                    <SelectValue
                      placeholder={field.placeholder || "Select an option"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt: any) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "radio" ? (
                <RadioGroup
                  value={formData[field.name] || ""}
                  onValueChange={(value) => handleFieldChange(field.name, value)}
                >
                  {field.options?.map((opt: any) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={opt.value}
                        id={`${field.id}-${opt.value}`}
                      />
                      <Label htmlFor={`${field.id}-${opt.value}`}>
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : field.type === "checkbox-group" ? (
                <div className="space-y-2">
                  {field.options?.map((opt: any) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${opt.value}`}
                        checked={formData[field.name]?.includes(opt.value)}
                        onCheckedChange={(checked) => {
                          const current = formData[field.name] || [];
                          const updated = checked
                            ? [...current, opt.value]
                            : current.filter((v: string) => v !== opt.value);
                          handleFieldChange(field.name, updated);
                        }}
                      />
                      <Label htmlFor={`${field.id}-${opt.value}`}>
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : field.type === "file" ? (
                <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 block">
                  <Input
                    type="file"
                    accept={field.accept}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFieldChange(field.name, file.name);
                      }
                    }}
                  />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {formData[field.name] || "Click to upload"}
                  </p>
                  {field.accept && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted: {field.accept}
                    </p>
                  )}
                </label>
              ) : (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={errors[field.name] ? "border-destructive" : ""}
                />
              )}

              {errors[field.name] && (
                <p className="text-sm text-destructive">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </div>
    </div>
  );
};
