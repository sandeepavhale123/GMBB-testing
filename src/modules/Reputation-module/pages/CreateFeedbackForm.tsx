import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Code } from "lucide-react";
import { toast } from "sonner";
import { FieldTypeSidebar } from "../components/FormBuilder/FieldTypeSidebar";
import { FormCanvas } from "../components/FormBuilder/FormCanvas";
import { PropertyEditorPanel } from "../components/FormBuilder/PropertyEditorPanel";
import { JsonPreviewDialog } from "../components/FormBuilder/JsonPreviewDialog";
import {
  createDefaultField,
  validateFormSchema,
  saveFormToLocalStorage,
  loadFormFromLocalStorage,
  reorderFields,
  duplicateField,
} from "../utils/formBuilder.utils";
import type { FormField, FieldType } from "../types/formBuilder.types";

export const CreateFeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const isEditMode = Boolean(formId);

  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showJsonDialog, setShowJsonDialog] = useState(false);

  // Load form from localStorage on mount
  useEffect(() => {
    if (isEditMode && formId) {
      const savedForm = loadFormFromLocalStorage(formId);
      if (savedForm) {
        setTemplateName(savedForm.name);
        setFields(savedForm.fields);
      }
    }
  }, [isEditMode, formId]);

  // Auto-save to localStorage
  useEffect(() => {
    if (fields.length > 0 || templateName) {
      const schema = {
        id: formId,
        name: templateName,
        fields: fields,
      };
      saveFormToLocalStorage(formId || 'draft', schema);
    }
  }, [fields, templateName, formId]);

  // Handlers
  const handleAddField = (fieldType: FieldType) => {
    const newField = createDefaultField(fieldType);
    newField.order = fields.length;
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    toast.success(`${fieldType} field added`);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    toast.success('Field deleted');
  };

  const handleDuplicateField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const duplicated = duplicateField(field);
      duplicated.order = fields.length;
      setFields([...fields, duplicated]);
      setSelectedFieldId(duplicated.id);
      toast.success('Field duplicated');
    }
  };

  const handleReorderFields = (startIndex: number, endIndex: number) => {
    const reordered = reorderFields(fields, startIndex, endIndex);
    setFields(reordered);
  };

  const handleSave = () => {
    const schema = { name: templateName, fields };
    const validation = validateFormSchema(schema);

    if (!validation.valid) {
      validation.errors.forEach(err => toast.error(err));
      return;
    }

    // TODO: Save to backend
    toast.success(
      isEditMode ? "Feedback form updated successfully" : "Feedback form created successfully"
    );

    navigate("/module/reputation/request?tab=feedbackForms");
  };

  const handleCancel = () => {
    navigate("/module/reputation/request?tab=feedbackForms");
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Header */}
      <div className="border-b p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit" : "Create"} Feedback Form
          </h1>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJsonDialog(true)}
              disabled={fields.length === 0}
            >
              <Code className="h-4 w-4 mr-2" />
              View JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>

        <Input
          placeholder="Enter form template name..."
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <FieldTypeSidebar onAddField={handleAddField} />

        <FormCanvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onUpdateField={handleUpdateField}
          onDeleteField={handleDeleteField}
          onDuplicateField={handleDuplicateField}
          onReorderFields={handleReorderFields}
          onDropNewField={handleAddField}
        />

        <PropertyEditorPanel
          selectedField={selectedField}
          onUpdateField={(updates) => selectedFieldId && handleUpdateField(selectedFieldId, updates)}
        />
      </div>

      {/* JSON Preview Dialog */}
      <JsonPreviewDialog
        open={showJsonDialog}
        onOpenChange={setShowJsonDialog}
        schema={{ name: templateName, fields }}
      />
    </div>
  );
};
