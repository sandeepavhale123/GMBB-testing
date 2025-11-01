import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SurveyCreatorWidget } from "../components/SurveyCreatorWidget";
import { validateSurveyJSON } from "../utils/surveyValidation";

export const CreateFeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const isEditMode = Boolean(formId);

  const [templateName, setTemplateName] = useState("");
  const [surveyJSON, setSurveyJSON] = useState<any>(null);

  useEffect(() => {
    // In edit mode, load existing form data
    if (isEditMode && formId) {
      // Mock data for edit mode
      setTemplateName(`Feedback Form ${formId}`);
      // Load saved survey JSON from backend/storage
      // setSurveyJSON(loadedSurveyJSON);
    }
  }, [isEditMode, formId]);

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    // Validate survey JSON
    const validation = validateSurveyJSON(surveyJSON);
    
    if (!validation.isValid) {
      toast.error(validation.errors[0] || "Please add at least one question to the form");
      return;
    }

    // Log form structure for debugging
    console.log("Saving form:", {
      name: templateName,
      surveyJSON: surveyJSON,
      stats: validation.stats,
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
        <CardContent className="overflow-visible p-0">
          <div className="min-h-[600px]">
            <SurveyCreatorWidget
              initialJSON={surveyJSON}
              onSave={(json) => setSurveyJSON(json)}
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
