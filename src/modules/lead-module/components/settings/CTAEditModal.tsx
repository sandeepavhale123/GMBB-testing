import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormValidation } from "@/hooks/useFormValidation";
import { CTASettings, ctaSettingsSchema } from "@/hooks/useCTASettings";
import { useToast } from "@/hooks/use-toast";

interface CTAEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: CTASettings;
  onSave: (settings: CTASettings) => Promise<boolean>;
  isLoading?: boolean;
}

export const CTAEditModal: React.FC<CTAEditModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CTASettings>(currentSettings);
  const { validate, getFieldError, hasFieldError, clearErrors } = useFormValidation(ctaSettingsSchema);
  const { toast } = useToast();

  // Reset form when modal opens/closes or settings change
  useEffect(() => {
    if (isOpen) {
      // Ensure all required fields exist with defaults
      const settingsWithDefaults = {
        header: currentSettings.header || "Ready to Improve Your GMB Performance?",
        description: currentSettings.description || "Let's work together to boost your Google My Business score and increase your local visibility.",
        buttonLabel: currentSettings.buttonLabel || "Let's Work Together",
        buttonLink: currentSettings.buttonLink || "#contact",
        backgroundColor: currentSettings.backgroundColor || "#3B82F6",
        textColor: currentSettings.textColor || "#FFFFFF",
      };
      setFormData(settingsWithDefaults);
      clearErrors();
    }
  }, [isOpen, currentSettings, clearErrors]);

  const handleInputChange = (field: keyof CTASettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const validation = validate(formData);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    const success = await onSave(formData);
    
    if (success) {
      toast({
        title: "CTA Settings Saved",
        description: "Your call-to-action has been updated successfully.",
      });
      onClose();
    } else {
      toast({
        title: "Save Failed",
        description: "Failed to save CTA settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData(currentSettings);
    clearErrors();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit CTA Section</DialogTitle>
          <DialogDescription>
            Customize your call-to-action header, description, button text, and link.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Header Input */}
          <div className="grid gap-2">
            <Label htmlFor="header">CTA Header</Label>
            <Input
              id="header"
              value={formData.header}
              onChange={(e) => handleInputChange("header", e.target.value)}
              placeholder="Enter CTA header text"
              className={hasFieldError("header") ? "border-destructive" : ""}
            />
            {hasFieldError("header") && (
              <p className="text-sm text-destructive">{getFieldError("header")}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="description">CTA Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter CTA description text"
              className={hasFieldError("description") ? "border-destructive" : ""}
              rows={4}
            />
            {hasFieldError("description") && (
              <p className="text-sm text-destructive">{getFieldError("description")}</p>
            )}
          </div>

          {/* Button Label Input */}
          <div className="grid gap-2">
            <Label htmlFor="buttonLabel">Button Label</Label>
            <Input
              id="buttonLabel"
              value={formData.buttonLabel}
              onChange={(e) => handleInputChange("buttonLabel", e.target.value)}
              placeholder="Enter button text"
              className={hasFieldError("buttonLabel") ? "border-destructive" : ""}
            />
            {hasFieldError("buttonLabel") && (
              <p className="text-sm text-destructive">{getFieldError("buttonLabel")}</p>
            )}
          </div>

          {/* Button Link Input */}
          <div className="grid gap-2">
            <Label htmlFor="buttonLink">Button Link (Optional)</Label>
            <Input
              id="buttonLink"
              type="url"
              value={formData.buttonLink}
              onChange={(e) => handleInputChange("buttonLink", e.target.value)}
              placeholder="https://example.com or #contact"
              className={hasFieldError("buttonLink") ? "border-destructive" : ""}
            />
            {hasFieldError("buttonLink") && (
              <p className="text-sm text-destructive">{getFieldError("buttonLink")}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter a full URL (https://...) or leave empty for no link
            </p>
          </div>

          {/* Color Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                className={hasFieldError("backgroundColor") ? "border-destructive h-10" : "h-10"}
              />
              {hasFieldError("backgroundColor") && (
                <p className="text-sm text-destructive">{getFieldError("backgroundColor")}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="textColor">Text Color</Label>
              <Input
                id="textColor"
                type="color"
                value={formData.textColor}
                onChange={(e) => handleInputChange("textColor", e.target.value)}
                className={hasFieldError("textColor") ? "border-destructive h-10" : "h-10"}
              />
              {hasFieldError("textColor") && (
                <p className="text-sm text-destructive">{getFieldError("textColor")}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};