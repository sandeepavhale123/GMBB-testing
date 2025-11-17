import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  Eye,
  Save,
  Building2,
  Globe,
  MapPin,
  List,
  Image as ImageIcon,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { updateIssueFix, updateFixStatus } from "@/services/liveSeoFixer";
import { cn } from "@/lib/utils";

// Schema type to icon mapping
const schemaIcons: Record<string, any> = {
  LocalBusiness: Building2,
  WebSite: Globe,
  Place: MapPin,
  BreadcrumbList: List,
  ImageObject: ImageIcon,
  default: FileText,
};

// Get icon for schema type
const getSchemaIcon = (type: string) => {
  return schemaIcons[type] || schemaIcons.default;
};

// Convert camelCase to Title Case
const camelToTitle = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

// Validation functions
const validateUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid (optional field)
  return /^https?:\/\/.+/.test(url);
};

const validateEmail = (email: string): boolean => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true;
  return /^[\d\s\-\+\(\)]+$/.test(phone);
};

const validateLatitude = (lat: string): boolean => {
  if (!lat) return true;
  const num = parseFloat(lat);
  return !isNaN(num) && num >= -90 && num <= 90;
};

const validateLongitude = (lng: string): boolean => {
  if (!lng) return true;
  const num = parseFloat(lng);
  return !isNaN(num) && num >= -180 && num <= 180;
};

const validateDate = (date: string): boolean => {
  if (!date) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

// Field validation based on field name
const getFieldValidation = (fieldName: string, value: any): string | null => {
  if (typeof value !== "string") return null;

  if (fieldName.toLowerCase().includes("url") || fieldName === "item") {
    return validateUrl(value)
      ? null
      : "Invalid URL format (must start with http:// or https://)";
  }
  if (fieldName.toLowerCase().includes("email")) {
    return validateEmail(value) ? null : "Invalid email format";
  }
  if (
    fieldName.toLowerCase().includes("phone") ||
    fieldName.toLowerCase().includes("telephone")
  ) {
    return validatePhone(value) ? null : "Invalid phone number format";
  }
  if (fieldName.toLowerCase() === "latitude") {
    return validateLatitude(value)
      ? null
      : "Latitude must be between -90 and 90";
  }
  if (fieldName.toLowerCase() === "longitude") {
    return validateLongitude(value)
      ? null
      : "Longitude must be between -180 and 180";
  }
  if (fieldName.toLowerCase().includes("date")) {
    return validateDate(value) ? null : "Date must be in YYYY-MM-DD format";
  }

  return null;
};

// Check if field is required based on schema requirements metadata
const isRequiredField = (
  schemaType: string,
  fieldPath: string[],
  schemaRequirements: any
): boolean => {
  if (!schemaRequirements || !schemaRequirements[schemaType]) {
    return false;
  }

  let current = schemaRequirements[schemaType];

  for (let i = 0; i < fieldPath.length; i++) {
    const field = fieldPath[i];

    // Skip numeric indices (array item indices)
    if (!isNaN(Number(field))) {
      continue;
    }

    // Get the field definition
    const fieldDef = current[field];

    if (!fieldDef) {
      return false;
    }

    // If it's the last field in path
    if (i === fieldPath.length - 1) {
      if (typeof fieldDef === "string") {
        return fieldDef === "required";
      }
      if (typeof fieldDef === "object" && fieldDef._requirement) {
        return fieldDef._requirement === "required";
      }
      return false;
    }

    // Navigate deeper for nested objects/arrays
    if (typeof fieldDef === "object") {
      // Check if next field is inside _item_fields (for arrays)
      if (fieldDef._type === "array" && fieldDef._item_fields) {
        current = fieldDef._item_fields;
      } else {
        current = fieldDef;
      }
    } else {
      return false;
    }
  }

  return false;
};

interface SchemaEditorProps {}

const SchemaEditor: React.FC<SchemaEditorProps> = () => {
  const { projectId, auditId, pageId } = useParams<{
    projectId: string;
    auditId?: string;
    pageId?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get initial schema data from location state
  const initialSchemaData = location.state?.schemaData;
  const issueId = location.state?.issueId;
  const stateAuditId = location.state?.auditId;
  const schemaRequirements = location.state?.schemaRequirements || {};

  const [schemas, setSchemas] = useState<any[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [isModified, setIsModified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState<number | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Deep clone utility to prevent mutation
  const deepClone = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    return JSON.parse(JSON.stringify(obj));
  };

  // Initialize schemas from location state
  useEffect(() => {
    if (initialSchemaData) {
      try {
        const parsed =
          typeof initialSchemaData === "string"
            ? JSON.parse(initialSchemaData)
            : initialSchemaData;

        const schemasArray = Array.isArray(parsed) ? parsed : [parsed];
        setSchemas(schemasArray);
      } catch (error) {
        console.error("Failed to parse schema data:", error);
        toast({
          title: "Error",
          description: "Failed to load schema data. Invalid JSON format.",
          variant: "destructive",
        });
        navigate(-1);
      }
    }
  }, [initialSchemaData, navigate, toast]);

  // Update field value with deep cloning to prevent mutation
  const updateFieldValue = (
    schemaIndex: number,
    path: string[],
    value: any
  ) => {
    setSchemas((prev) => {
      const newSchemas = deepClone(prev);

      // Navigate to the field and update it
      let current: any = newSchemas[schemaIndex];
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;

      return newSchemas;
    });
    setIsModified(true);

    // Get schema type for validation
    const schemaType = schemas[schemaIndex]["@type"];
    const fieldName = path[path.length - 1];
    const isRequired = isRequiredField(schemaType, path, schemaRequirements);

    // Validate the field
    let error: string | null = null;

    // Check if required field is empty
    if (isRequired && (value === null || value === undefined || value === "")) {
      error = `${camelToTitle(fieldName)} is required`;
    } else if (value !== null && value !== undefined && value !== "") {
      // Check format validation only if field has a value
      error = getFieldValidation(fieldName, value);
    }

    if (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [schemaIndex]: {
          ...prev[schemaIndex],
          [path.join(".")]: error,
        },
      }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[schemaIndex]) {
          delete newErrors[schemaIndex][path.join(".")];
          // Remove schema index if no errors left
          if (Object.keys(newErrors[schemaIndex]).length === 0) {
            delete newErrors[schemaIndex];
          }
        }
        return newErrors;
      });
    }
  };

  // Clone structure with empty values - preserving nested array structures
  const cloneStructureWithEmptyValues = (obj: any, depth: number = 0): any => {
    // Prevent infinite recursion
    if (depth > 5) return "";

    if (obj === null || obj === undefined) {
      return "";
    }

    if (Array.isArray(obj)) {
      // For arrays with items, preserve the structure of first item for nested arrays
      if (obj.length > 0) {
        return [cloneStructureWithEmptyValues(obj[0], depth + 1)];
      }
      return [];
    }

    if (typeof obj === "object") {
      const cloned: any = {};
      Object.keys(obj).forEach((key) => {
        if (key === "@type" || key === "@context") {
          // Preserve @type and @context
          cloned[key] = obj[key];
        } else if (key === "position") {
          // Reset position to 0 (will be set correctly later)
          cloned[key] = 0;
        } else if (Array.isArray(obj[key])) {
          // For nested arrays, preserve structure if they have items
          if (obj[key].length > 0) {
            cloned[key] = [
              cloneStructureWithEmptyValues(obj[key][0], depth + 1),
            ];
          } else {
            cloned[key] = [];
          }
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          // Recursively clone nested objects
          cloned[key] = cloneStructureWithEmptyValues(obj[key], depth + 1);
        } else if (typeof obj[key] === "number") {
          cloned[key] = 0;
        } else {
          cloned[key] = "";
        }
      });
      return cloned;
    }

    if (typeof obj === "number") {
      return 0;
    }

    return "";
  };

  // Add array item with deep cloning
  const addArrayItem = (
    schemaIndex: number,
    arrayPath: string[],
    itemTemplate: any
  ) => {
    setSchemas((prev) => {
      const newSchemas = deepClone(prev);

      // Navigate to the array
      let current: any = newSchemas[schemaIndex];
      for (const key of arrayPath) {
        current = current[key];
      }

      // Add new item
      if (Array.isArray(current)) {
        current.push(deepClone(itemTemplate));
      }

      return newSchemas;
    });
    setIsModified(true);
  };

  // Remove array item with deep cloning
  const removeArrayItem = (
    schemaIndex: number,
    arrayPath: string[],
    itemIndex: number
  ) => {
    setSchemas((prev) => {
      const newSchemas = deepClone(prev);

      // Navigate to the array
      let current: any = newSchemas[schemaIndex];
      for (const key of arrayPath) {
        current = current[key];
      }

      // Remove item
      if (Array.isArray(current)) {
        current.splice(itemIndex, 1);

        // Update positions for BreadcrumbList
        if (newSchemas[schemaIndex]["@type"] === "BreadcrumbList") {
          current.forEach((item: any, idx: number) => {
            if (typeof item === "object" && item !== null) {
              item.position = idx + 1;
            }
          });
        }
      }

      return newSchemas;
    });
    setIsModified(true);
  };

  // Handle delete schema
  const handleDeleteClick = (index: number) => {
    if (schemas.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the only remaining schema.",
        variant: "destructive",
      });
      return;
    }
    setSchemaToDelete(index);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (schemaToDelete === null) return;

    setSchemas((prev) => prev.filter((_, idx) => idx !== schemaToDelete));

    // Adjust active tab if needed
    if (activeTabIndex === schemaToDelete) {
      setActiveTabIndex(Math.max(0, schemaToDelete - 1));
    } else if (activeTabIndex > schemaToDelete) {
      setActiveTabIndex(activeTabIndex - 1);
    }

    setIsModified(true);
    setShowDeleteDialog(false);
    setSchemaToDelete(null);

    toast({
      title: "Schema Deleted",
      description:
        "Schema deleted successfully. Remember to save your changes.",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    if (isModified) {
      setShowUnsavedDialog(true);
    } else {
      navigate(-1);
    }
  };

  // Handle save
  const handleSave = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Validate all schemas
    const newErrors: Record<string, Record<string, string>> = {};
    schemas.forEach((schema, schemaIndex) => {
      const schemaType = schema["@type"];
      validateSchemaFields(schema, schemaIndex, [], schemaType, newErrors);
    });

    // Set validation errors
    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Count total errors
      const errorCount = Object.values(newErrors).reduce(
        (sum, schemaErrors) => {
          return sum + Object.keys(schemaErrors).length;
        },
        0
      );

      toast({
        title: "Validation Error",
        description: `Please fix ${errorCount} validation error${
          errorCount > 1 ? "s" : ""
        } before saving. Required fields must be filled and values must be valid.`,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const jsonOutput = JSON.stringify(schemas, null, 2);

      // Call appropriate API based on available params
      if (auditId || stateAuditId) {
        // Use audit-based API (from AuditResultsGrouped)
        await updateIssueFix(
          projectId!,
          auditId || stateAuditId!,
          issueId,
          jsonOutput,
          true
        );
      } else if (pageId) {
        // Use page-based API (from PageAudit)
        await updateFixStatus(projectId!, pageId!, issueId, jsonOutput, true);
      } else {
        throw new Error("Missing required route parameters");
      }

      toast({
        title: "Success",
        description: "Schemas saved successfully.",
      });

      setIsModified(false);
      navigate(-1);
    } catch (error) {
      console.error("Failed to save schemas:", error);
      toast({
        title: "Error",
        description: "Failed to save schemas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Validate schema fields recursively
  const validateSchemaFields = (
    obj: any,
    schemaIndex: number,
    path: string[],
    schemaType: string,
    errors: Record<string, Record<string, string>>
  ) => {
    Object.keys(obj).forEach((key) => {
      if (key === "@context" || key === "@type") return;

      const value = obj[key];
      const currentPath = [...path, key];
      const fieldPath = currentPath.join(".");

      // Check if field is required
      const required = isRequiredField(
        schemaType,
        currentPath,
        schemaRequirements
      );

      // Validate required fields
      if (required) {
        if (value === null || value === undefined || value === "") {
          if (!errors[schemaIndex]) {
            errors[schemaIndex] = {};
          }
          errors[schemaIndex][fieldPath] = `${camelToTitle(key)} is required`;
          return;
        }

        // For arrays, check if they have at least one item
        if (Array.isArray(value) && value.length === 0) {
          if (!errors[schemaIndex]) {
            errors[schemaIndex] = {};
          }
          errors[schemaIndex][fieldPath] = `${camelToTitle(
            key
          )} must have at least one item`;
          return;
        }
      }

      // Recursively validate nested objects
      if (value && typeof value === "object" && !Array.isArray(value)) {
        validateSchemaFields(
          value,
          schemaIndex,
          currentPath,
          schemaType,
          errors
        );
      }
      // Validate array items
      else if (Array.isArray(value)) {
        value.forEach((item, itemIndex) => {
          if (item && typeof item === "object") {
            validateSchemaFields(
              item,
              schemaIndex,
              [...currentPath, itemIndex.toString()],
              schemaType,
              errors
            );
          }
        });
      }
      // Validate primitive values
      else if (value !== null && value !== undefined && value !== "") {
        const formatError = getFieldValidation(key, value);
        if (formatError) {
          if (!errors[schemaIndex]) {
            errors[schemaIndex] = {};
          }
          errors[schemaIndex][fieldPath] = formatError;
        }
      }
    });
  };

  // Render field based on type
  const renderField = (
    schemaIndex: number,
    fieldName: string,
    value: any,
    path: string[],
    schemaType: string
  ) => {
    const fieldPath = path.join(".");
    const error = validationErrors[schemaIndex]?.[fieldPath];
    const required = isRequiredField(schemaType, path, schemaRequirements);

    if (fieldName === "@context" || fieldName === "@type") {
      return null;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return renderNestedObject(
        schemaIndex,
        fieldName,
        value,
        path,
        schemaType
      );
    }

    if (Array.isArray(value)) {
      return renderArray(schemaIndex, fieldName, value, path, schemaType);
    }

    const isLongText =
      fieldName.toLowerCase().includes("description") ||
      fieldName.toLowerCase().includes("text");

    return (
      <div key={fieldPath} className="space-y-1.5">
        <Label htmlFor={fieldPath} className="text-sm font-medium">
          {camelToTitle(fieldName)}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {isLongText ? (
          <Textarea
            id={fieldPath}
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(schemaIndex, path, e.target.value)
            }
            placeholder={`Enter ${camelToTitle(fieldName).toLowerCase()}`}
            className={cn("min-h-[80px]", error && "border-destructive")}
          />
        ) : (
          <Input
            id={fieldPath}
            type={typeof value === "number" ? "number" : "text"}
            value={value || ""}
            onChange={(e) =>
              updateFieldValue(schemaIndex, path, e.target.value)
            }
            placeholder={`Enter ${camelToTitle(fieldName).toLowerCase()}`}
            className={cn("h-9", error && "border-destructive")}
          />
        )}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  };

  // Render nested object with compact styling
  const renderNestedObject = (
    schemaIndex: number,
    objectName: string,
    obj: any,
    basePath: string[],
    schemaType: string
  ) => {
    return (
      <div
        key={basePath.join(".")}
        className="border-l-2 border-muted pl-3 space-y-2"
      >
        <Label className="text-sm font-semibold text-foreground">
          {camelToTitle(objectName)}
        </Label>
        <div className="space-y-2">
          {Object.keys(obj).map((key) => {
            if (key === "@type") return null;
            return renderField(
              schemaIndex,
              key,
              obj[key],
              [...basePath, key],
              schemaType
            );
          })}
        </div>
      </div>
    );
  };

  // Render array
  const renderArray = (
    schemaIndex: number,
    arrayName: string,
    array: any[],
    basePath: string[],
    schemaType: string
  ) => {
    const getArrayItemTemplate = () => {
      // If array has existing items, clone the structure from the first item
      if (array.length > 0) {
        const firstItem = array[0];
        const clonedItem = cloneStructureWithEmptyValues(firstItem);

        // Special handling for BreadcrumbList positions
        if (schemaType === "BreadcrumbList" && typeof clonedItem === "object") {
          clonedItem.position = array.length + 1;
        }

        return clonedItem;
      }

      // Fallback templates for common schema types when array is empty
      if (schemaType === "BreadcrumbList") {
        return {
          "@type": "ListItem",
          position: array.length + 1,
          name: "",
          item: "",
        };
      }

      // Default empty object for other types
      return {};
    };

    return (
      <div key={basePath.join(".")} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            {camelToTitle(arrayName)}
          </Label>
          {array.length < 20 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addArrayItem(schemaIndex, basePath, getArrayItemTemplate())
              }
              className="h-8"
            >
              <Plus size={14} className="mr-1.5" />
              Add Item
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {array.map((item, itemIndex) => (
            <Card key={itemIndex} className="border-muted bg-muted/30">
              <CardHeader className="py-2 px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Item {itemIndex + 1}
                    {item.position && ` • Position ${item.position}`}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeArrayItem(schemaIndex, basePath, itemIndex)
                    }
                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-3 space-y-2">
                {typeof item === "object" ? (
                  Object.keys(item).map((key) => {
                    if (key === "@type") return null;
                    return renderField(
                      schemaIndex,
                      key,
                      item[key],
                      [...basePath, itemIndex.toString(), key],
                      schemaType
                    );
                  })
                ) : (
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newPath = [...basePath, itemIndex.toString()];
                      updateFieldValue(schemaIndex, newPath, e.target.value);
                    }}
                    className="h-9"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (schemas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading schema data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-3 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-8"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Schema Editor</h1>
            <p className="text-xs text-muted-foreground">
              Edit your Schema.org structured data
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {schemas.length} {schemas.length === 1 ? "Schema" : "Schemas"}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTabIndex.toString()}
        onValueChange={(v) => setActiveTabIndex(parseInt(v))}
      >
        <TabsList className="w-full justify-start overflow-x-auto h-9">
          {schemas.map((schema, index) => {
            const Icon = getSchemaIcon(schema["@type"]);
            return (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="relative pr-8 text-sm h-8"
              >
                <Icon size={14} className="mr-1.5" />
                {schema["@type"]}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(index);
                  }}
                  className="absolute right-1 h-5 w-5 p-0 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 size={10} />
                </Button>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {schemas.map((schema, index) => (
          <TabsContent
            key={index}
            value={index.toString()}
            className="space-y-3 mt-4"
          >
            {Object.keys(schema).map((key) => {
              if (key === "@context") return null;
              return renderField(
                index,
                key,
                schema[key],
                [key],
                schema["@type"]
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 shadow-lg">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <Button
            variant="outline"
            onClick={handleBack}
            className="h-9"
            size="sm"
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowPreviewDialog(true)}
            className="h-9"
            size="sm"
          >
            <Eye size={14} className="mr-1.5" />
            Preview JSON
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving || Object.keys(validationErrors).length > 0}
            className="h-9"
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} className="mr-1.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Delete Schema?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the{" "}
              <strong>
                {schemaToDelete !== null && schemas[schemaToDelete]?.["@type"]}
              </strong>{" "}
              schema? This change will only take effect when you save.
              {schemaToDelete !== null && schemas[schemaToDelete]?.name && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Name:</strong> {schemas[schemaToDelete].name}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(-1)}>
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview JSON Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>JSON Preview</DialogTitle>
            <DialogDescription>
              Preview of your schema data that will be saved
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{JSON.stringify(schemas, null, 2)}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(schemas, null, 2));
                toast({
                  title: "Copied",
                  description: "JSON copied to clipboard",
                });
              }}
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemaEditor;
