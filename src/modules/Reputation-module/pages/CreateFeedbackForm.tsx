import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ReactFormBuilder } from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import "./CreateFeedbackForm.css";

export const CreateFeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const isEditMode = Boolean(formId);

  const [templateName, setTemplateName] = useState("");
  const [formData, setFormData] = useState<any[]>([]);

  useEffect(() => {
    // In edit mode, load existing form data
    if (isEditMode && formId) {
      // Mock data for edit mode
      setTemplateName(`Feedback Form ${formId}`);
      // Load saved form schema from backend/storage
    }
  }, [isEditMode, formId]);

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (formData.length === 0) {
      toast.error("Please add at least one form field");
      return;
    }

    // Check if form has at least one required field (optional validation)
    const requiredFieldsCount = formData.filter((f) => f.required).length;

    // Log form structure for debugging
    console.log("Saving form:", {
      name: templateName,
      formData: formData,
      requiredFields: requiredFieldsCount,
    });

    toast.success(isEditMode ? "Feedback form updated successfully" : "Feedback form created successfully");

    // Navigate back to request page with feedbackForms tab
    navigate("/module/reputation/request?tab=feedbackForms");
  };

  const handleCancel = () => {
    navigate("/module/reputation/request?tab=feedbackForms");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditMode ? "Edit Feedback Form" : "Create Feedback Form"}
            </h1>
            <p className="text-muted-foreground mt-1">Design a custom feedback form using drag-and-drop builder</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
      </div>

      {/* Template Name Card */}
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              placeholder="Enter form template name..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Builder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Form Builder</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop elements to create your custom feedback form
          </p>
        </CardHeader>
        <CardContent>
          <div className="min-h-[600px] rounded-lg overflow-hidden border-red-100">
            <ReactFormBuilder
              onPost={(data: any) => {
                setFormData(data.task_data);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          {isEditMode ? "Update Form" : "Create Form"}
        </Button>
      </div>
    </div>
  );
};
