import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FieldType } from "../../types/formBuilder.types";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface FormBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FormField[];
  onSave: (fields: FormField[]) => void;
}

export const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
  open,
  onOpenChange,
  fields: initialFields,
  onSave,
}) => {
  const { t } = useI18nNamespace("Reputation-module-v1-components/FormBuilderModal");

  const fieldTypeOptions: { value: FieldType; label: string }[] = [
    { value: "text", label: t("fieldTypes.text") },
    { value: "email", label: t("fieldTypes.email") },
    { value: "textarea", label: t("fieldTypes.textarea") },
    { value: "number", label: t("fieldTypes.number") },
    { value: "date", label: t("fieldTypes.date") },
    { value: "select", label: t("fieldTypes.select") },
    { value: "radio", label: t("fieldTypes.radio") },
    { value: "checkbox-group", label: t("fieldTypes.checkboxGroup") },
  ];
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  // Raw textarea content for options-based fields
  const [optionsText, setOptionsText] = useState<string>("");
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);

  const isOptionsField = (f?: FormField) =>
    !!f && (f.type === "select" || f.type === "radio" || f.type === "checkbox-group");

  // Sync fields when modal opens
  useEffect(() => {
    if (open) {
      setFields(initialFields);
      setEditingField(null);
    }
  }, [open]);

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: t("newField"),
      name: `field_${Date.now()}`,
      placeholder: "",
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
    setEditingField(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (editingField === id) {
      setEditingField(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", fieldId);
  };

  const handleDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverFieldId(fieldId);
  };

  const handleDragLeave = () => {
    setDragOverFieldId(null);
  };

  const handleDrop = (e: React.DragEvent, dropFieldId: string) => {
    e.preventDefault();

    if (!draggedFieldId || draggedFieldId === dropFieldId) {
      setDraggedFieldId(null);
      setDragOverFieldId(null);
      return;
    }

    const draggedIndex = fields.findIndex((f) => f.id === draggedFieldId);
    const dropIndex = fields.findIndex((f) => f.id === dropFieldId);

    if (draggedIndex === -1 || dropIndex === -1) return;

    // Reorder fields array
    const newFields = [...fields];
    const [draggedField] = newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, draggedField);

    // Update order property for all fields
    const reorderedFields = newFields.map((field, index) => ({
      ...field,
      order: index,
    }));

    setFields(reorderedFields);
    setDraggedFieldId(null);
    setDragOverFieldId(null);
  };

  const handleDragEnd = () => {
    setDraggedFieldId(null);
    setDragOverFieldId(null);
  };

  const handleSave = () => {
    onSave(fields);
    onOpenChange(false);
  };

  const selectedField = fields.find((f) => f.id === editingField);

  // Keep textarea content in sync when switching fields or opening
  useEffect(() => {
    if (isOptionsField(selectedField)) {
      setOptionsText(selectedField?.options?.map((o) => o.label).join("\n") ?? "");
    } else {
      setOptionsText("");
    }
  }, [editingField, selectedField?.id, selectedField?.type, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Left Panel - Field List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t("formFields")}</Label>
              <Button size="sm" onClick={addField} variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                {t("addField")}
              </Button>
            </div>

            <ScrollArea className="h-[300px] md:h-[400px] border rounded-lg p-2">
              <div className="space-y-2">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    onDragOver={(e) => handleDragOver(e, field.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-move transition-all ${
                      editingField === field.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    } ${draggedFieldId === field.id ? "opacity-50 scale-95" : ""} ${
                      dragOverFieldId === field.id && draggedFieldId !== field.id
                        ? "border-primary border-2 bg-primary/10"
                        : ""
                    }`}
                    onClick={(e) => {
                      if (draggedFieldId) {
                        e.preventDefault();
                        return;
                      }
                      setEditingField(field.id);
                    }}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{field.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {field.type} {field.required && "• Required"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id);
                      }}
                      className="flex-shrink-0"
                      disabled={field.name === "name" || field.type === "email"}
                      title={field.name === "name" || field.type === "email" ? t("cannotRemove") : t("removeField")}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Field Editor */}
          <div className="space-y-4">
            {selectedField ? (
              <ScrollArea className="h-[300px] md:h-[440px] border border-gray-5 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">{t("editField")}</h4>

                  <div className="px-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="field-label" className="text-xs">
                        {t("label")}
                      </Label>
                      <Input
                        id="field-label"
                        value={selectedField.label}
                        onChange={(e) => {
                          const label = e.target.value;
                          const isProtectedField = selectedField.name === "name" || selectedField.name === "email";

                          if (isProtectedField) {
                            // For Name/Email fields: Only update label
                            updateField(selectedField.id, { label });
                          } else {
                            // For other fields: Update both label and name
                            let generatedName = label.replace(/\s+/g, "_");

                            // Add underscore if generated name conflicts with built-in fields
                            const lowerName = generatedName.toLowerCase();
                            if (lowerName === "name" || lowerName === "email") {
                              generatedName = generatedName + "_";
                            }

                            // Check for duplicate field names and make unique
                            const existingFieldNames = fields
                              .filter((f) => f.id !== selectedField.id) // Exclude current field
                              .map((f) => f.name.toLowerCase());

                            let finalName = generatedName;
                            let counter = 1;
                            while (existingFieldNames.includes(finalName.toLowerCase())) {
                              finalName = `${generatedName}_${counter}`;
                              counter++;
                            }

                            updateField(selectedField.id, {
                              label,
                              name: finalName,
                            });
                          }
                        }}
                        placeholder={t("fieldlabel")}
                      />
                    </div>

                    <div className="space-y-2 hidden">
                      <Label htmlFor="field-name" className="text-xs ">
                        {t("fieldName")}
                      </Label>
                      <Input
                        id="field-name"
                        value={selectedField.name}
                        onChange={(e) =>
                          updateField(selectedField.id, {
                            name: e.target.value,
                          })
                        }
                        placeholder={t("fieldPlace")}
                        disabled={selectedField.name === "name" || selectedField.name === "email"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="field-type" className="text-xs">
                        {t("fieldType")}
                      </Label>
                      <Select
                        value={selectedField.type}
                        onValueChange={(value: FieldType) => updateField(selectedField.id, { type: value })}
                        disabled={selectedField.name === "name" || selectedField.name === "email"}
                      >
                        <SelectTrigger
                          id="field-type"
                          disabled={selectedField.name === "name" || selectedField.name === "email"}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="field-placeholder" className="text-xs">
                        {t("placeholder")}
                      </Label>
                      <Input
                        id="field-placeholder"
                        value={selectedField.placeholder || ""}
                        onChange={(e) =>
                          updateField(selectedField.id, {
                            placeholder: e.target.value,
                          })
                        }
                        placeholder={t("plText")}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="field-required"
                        checked={selectedField.required}
                        onCheckedChange={(checked) =>
                          updateField(selectedField.id, {
                            required: checked === true,
                          })
                        }
                        disabled={selectedField.name === "name" || selectedField.name === "email"}
                      />
                      <Label
                        htmlFor="field-required"
                        className={`text-xs cursor-pointer ${
                          selectedField.name === "name" || selectedField.name === "email"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {t("requiredField")}
                      </Label>
                    </div>

                    {/* Options for select/radio/checkbox */}
                    {(selectedField.type === "select" ||
                      selectedField.type === "radio" ||
                      selectedField.type === "checkbox-group") && (
                      <div className="space-y-2">
                        <Label className="text-xs">{t("options")}</Label>
                        <Textarea
                          value={optionsText}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setOptionsText(raw);
                            const options = raw
                              .split(/\r?\n/)
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line) => ({
                                label: line,
                                value: line.toLowerCase().replace(/\s+/g, "_"),
                              }));
                            updateField(selectedField.id, { options });
                          }}
                          placeholder={t("enterOptions")}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">{t("enterOptions")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[440px] border rounded-lg flex items-center justify-center text-sm text-muted-foreground text-center px-6">
                {t("selectFieldToEdit")}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            {t("saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
