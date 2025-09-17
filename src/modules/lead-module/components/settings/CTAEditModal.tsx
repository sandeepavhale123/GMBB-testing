import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormValidation } from "@/hooks/useFormValidation";
import { SingleCTASettings, singleCTASettingsSchema } from "@/hooks/useCTASettings";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";
interface CTAEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: SingleCTASettings;
  onSave: (settings: SingleCTASettings) => Promise<boolean>;
  onReset: () => Promise<boolean>;
  isLoading: boolean;
  ctaType: 'call' | 'appointment';
}
export const CTAEditModal: React.FC<CTAEditModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  onReset,
  isLoading,
  ctaType
}) => {
  const [formData, setFormData] = useState<SingleCTASettings>(() => {
    // Initialize with safe defaults to prevent undefined errors
    return currentSettings || {
      header: "BOOST YOUR GBP SCORE &&& Increase your calls",
      description: "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
      buttonLabel: "BOOK A CALL",
      buttonLink: "#contact",
      isVisible: true
    };
  });
  const {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors
  } = useFormValidation(singleCTASettingsSchema);
  const {
    toast
  } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  // Reset form when modal opens only
  useEffect(() => {
    if (isOpen) {
      // Ensure all required fields exist with defaults - handle undefined currentSettings
      const settingsWithDefaults = {
        header: currentSettings?.header || "BOOST YOUR GBP SCORE &&& Increase your calls",
        description: currentSettings?.description || "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
        buttonLabel: currentSettings?.buttonLabel || "BOOK A CALL",
        buttonLink: currentSettings?.buttonLink || "#contact",
        isVisible: currentSettings?.isVisible ?? true
      };
      setFormData(settingsWithDefaults);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentSettings]);
  const handleInputChange = (field: keyof SingleCTASettings, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = async () => {
    const validation = validate(formData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive"
      });
      return;
    }
    const success = await onSave(formData);
    if (success) {
      toast({
        title: "CTA Settings Saved",
        description: "Your call-to-action has been updated successfully."
      });
      onClose();
    } else {
      toast({
        title: "Save Failed",
        description: "Failed to save CTA settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleCancel = () => {
    setFormData(currentSettings || {
      header: "BOOST YOUR GBP SCORE &&& Increase your calls",
      description: "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
      buttonLabel: "BOOK A CALL",
      buttonLink: "#contact",
      isVisible: true
    });
    clearErrors();
    onClose();
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const success = await onReset();
      if (success) {
        toast({
          title: "CTA Reset",
          description: `${ctaType === 'call' ? 'Call' : 'Appointment'} CTA has been reset to defaults.`,
        });
        onClose();
      } else {
        toast({
          title: "Reset Failed",  
          description: "Failed to reset CTA settings. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsResetting(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={open => {
    if (!open) onClose();
  }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit {ctaType === 'call' ? 'Call' : 'Appointment'} CTA Settings</DialogTitle>
          <DialogDescription>
            Customize your call-to-action header, description, button text, and link.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Visibility Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isVisible">Show CTA in Reports</Label>
              <p className="text-xs text-muted-foreground">
                Toggle to show or hide this CTA section in generated reports
              </p>
            </div>
            <Switch id="isVisible" checked={formData.isVisible ?? true} onCheckedChange={checked => handleInputChange("isVisible", checked)} />
          </div>

          {/* Header Input */}
          <div className="grid gap-2">
            <Label htmlFor="header">CTA Header</Label>
            <Input id="header" autoFocus value={formData.header ?? ""} onChange={e => handleInputChange("header", e.target.value)} placeholder="Enter CTA header text" className={hasFieldError("header") ? "border-destructive" : ""} />
            {hasFieldError("header") && <p className="text-sm text-destructive">{getFieldError("header")}</p>}
          </div>

          {/* Description Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="description">CTA Description</Label>
            <Textarea id="description" value={formData.description ?? ""} onChange={e => handleInputChange("description", e.target.value)} placeholder="Enter CTA description text" className={hasFieldError("description") ? "border-destructive" : ""} rows={4} />
            {hasFieldError("description") && <p className="text-sm text-destructive">{getFieldError("description")}</p>}
          </div>

          {/* Button Label Input */}
          <div className="grid gap-2">
            <Label htmlFor="buttonLabel">Button Label</Label>
            <Input id="buttonLabel" value={formData.buttonLabel ?? ""} onChange={e => handleInputChange("buttonLabel", e.target.value)} placeholder="Enter button text" className={hasFieldError("buttonLabel") ? "border-destructive" : ""} />
            {hasFieldError("buttonLabel") && <p className="text-sm text-destructive">{getFieldError("buttonLabel")}</p>}
          </div>

          {/* Button Link Input */}
          <div className="grid gap-2">
            <Label htmlFor="buttonLink">Button Link (Optional)</Label>
            <Input id="buttonLink" type="text" value={formData.buttonLink ?? ""} onChange={e => handleInputChange("buttonLink", e.target.value)} placeholder="https://example.com or #contact" className={hasFieldError("buttonLink") ? "border-destructive" : ""} />
            {hasFieldError("buttonLink") && <p className="text-sm text-destructive">{getFieldError("buttonLink")}</p>}
            <p className="text-xs text-muted-foreground">
              Enter a full URL (https://...) or leave empty for no link
            </p>
          </div>

        </div>

        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isResetting} className="mr-auto">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset CTA to Default?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all {ctaType === 'call' ? 'call' : 'appointment'} CTA settings to their default values. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} disabled={isResetting}>
                  {isResetting ? "Resetting..." : "Reset"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};