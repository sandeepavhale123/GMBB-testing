import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Code, Menu, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeviceBreakpoints } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldTypeSidebar } from "../components/FormBuilder/FieldTypeSidebar";
import { FormCanvas } from "../components/FormBuilder/FormCanvas";
import { PropertyEditorPanel } from "../components/FormBuilder/PropertyEditorPanel";
import { JsonPreviewDialog } from "../components/FormBuilder/JsonPreviewDialog";
import { SaveFormDialog } from "../components/FormBuilder/SaveFormDialog";
import {
  createDefaultField,
  validateFormSchema,
  saveFormToLocalStorage,
  loadFormFromLocalStorage,
  reorderFields,
  duplicateField,
  generateFieldName,
} from "../utils/formBuilder.utils";
import type { FormField, FieldType } from "../types/formBuilder.types";

const CreateFeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const isEditMode = Boolean(formId);

  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [mobileTab, setMobileTab] = useState<
    "fields" | "canvas" | "properties"
  >("canvas");
  const { isMobile, isTablet, isDesktop } = useDeviceBreakpoints();

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
      saveFormToLocalStorage(formId || "draft", schema);
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
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          // Auto-generate name if label is being updated
          if (updates.label !== undefined) {
            return {
              ...field,
              ...updates,
              name: generateFieldName(updates.label),
            };
          }
          return { ...field, ...updates };
        }
        return field;
      })
    );
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    toast.success("Field deleted");
  };

  const handleDuplicateField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      const duplicated = duplicateField(field);
      duplicated.order = fields.length;
      setFields([...fields, duplicated]);
      setSelectedFieldId(duplicated.id);
      toast.success("Field duplicated");
    }
  };

  const handleReorderFields = (startIndex: number, endIndex: number) => {
    const reordered = reorderFields(fields, startIndex, endIndex);
    setFields(reordered);
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleConfirmSave = (name: string) => {
    const schema = { name, fields };
    const validation = validateFormSchema(schema);

    if (!validation.valid) {
      validation.errors.forEach((err) => toast.error(err));
      return;
    }

    setTemplateName(name);

    // Generate unique ID for new forms
    const savedFormId = formId || `form_${Date.now()}`;
    const savedSchema = {
      id: savedFormId,
      name,
      fields,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    saveFormToLocalStorage(savedFormId, savedSchema);

    // Clear draft
    if (!formId) {
      localStorage.removeItem("feedback_form_draft");
    }

    toast.success(
      isEditMode
        ? "Feedback form updated successfully"
        : "Feedback form created successfully"
    );

    navigate("/module/reputation/request?tab=feedbackForms");
  };

  const handleCancel = () => {
    navigate("/module/reputation/request?tab=feedbackForms");
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="flex flex-col h-screen border border-gray-100">
      {/* Top Header */}
      <div className="border-b p-3 md:p-4 bg-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-bold">
            {isEditMode ? "Edit" : "Create"} Survey Form
          </h1>

          {/* Desktop buttons */}
          {isDesktop && (
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
          )}

          {/* Mobile/Tablet buttons */}
          {!isDesktop && (
            <div className="flex gap-2 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowJsonDialog(true)}
                    disabled={fields.length === 0}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    View JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCancel}>
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive layout */}
      {isDesktop ? (
        // Desktop: Three-column layout
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
            onUpdateField={(updates) =>
              selectedFieldId && handleUpdateField(selectedFieldId, updates)
            }
          />
        </div>
      ) : isMobile ? (
        // Mobile: Tab-based navigation
        <Tabs
          value={mobileTab}
          onValueChange={(v) =>
            setMobileTab(v as "fields" | "canvas" | "properties")
          }
          className="flex-1 flex flex-col"
        >
          <TabsList className="w-full justify-start border-b rounded-none h-12 px-3">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            {selectedFieldId && (
              <TabsTrigger value="properties">Properties</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="fields" className="flex-1 overflow-hidden mt-0">
            <FieldTypeSidebar
              onAddField={(type) => {
                handleAddField(type);
                setMobileTab("canvas");
              }}
            />
          </TabsContent>

          <TabsContent value="canvas" className="flex-1 overflow-hidden mt-0">
            <FormCanvas
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={(id) => {
                setSelectedFieldId(id);
                if (id) setMobileTab("properties");
              }}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
              onDuplicateField={handleDuplicateField}
              onReorderFields={handleReorderFields}
              onDropNewField={handleAddField}
            />
          </TabsContent>

          {selectedFieldId && (
            <TabsContent
              value="properties"
              className="flex-1 overflow-hidden mt-0"
            >
              <PropertyEditorPanel
                selectedField={selectedField}
                onUpdateField={(updates) =>
                  selectedFieldId && handleUpdateField(selectedFieldId, updates)
                }
              />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        // Tablet: Canvas + Sheet sidebars
        <div className="flex flex-1 overflow-hidden relative">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-4 z-10"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <FieldTypeSidebar onAddField={handleAddField} />
            </SheetContent>
          </Sheet>

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

          {selectedFieldId && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-4 z-10"
                >
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <PropertyEditorPanel
                  selectedField={selectedField}
                  onUpdateField={(updates) =>
                    selectedFieldId &&
                    handleUpdateField(selectedFieldId, updates)
                  }
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      )}

      {/* JSON Preview Dialog */}
      <JsonPreviewDialog
        open={showJsonDialog}
        onOpenChange={setShowJsonDialog}
        schema={{ name: templateName, fields }}
      />

      {/* Save Form Dialog */}
      <SaveFormDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleConfirmSave}
        defaultName={templateName}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default CreateFeedbackForm;
