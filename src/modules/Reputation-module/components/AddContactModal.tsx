import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { useFormValidation } from "@/hooks/useFormValidation";
import { manualContactSchema, type ManualContactFormData } from "@/schemas/contactSchema";
import { countryCodes } from "@/data/countryCodes";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { toast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdded: (contact: { name: string; countryCode: string; phoneNumber: string }) => void;
}

export const AddContactModal = ({ open, onOpenChange, onContactAdded }: AddContactModalProps) => {
  const { t } = useI18nNamespace("Reputation/addContactModal");
  const [activeTab, setActiveTab] = useState<"manual" | "csv">("manual");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manual form state
  const [formData, setFormData] = useState<ManualContactFormData>({
    name: "",
    countryCode: "",
    phoneNumber: "",
  });

  const { validate, getFieldError, hasFieldError, clearErrors } = useFormValidation(manualContactSchema);

  const handleInputChange = (field: keyof ManualContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadSample = () => {
    const csvContent = "Name,Country Code,Phone Number\nJohn Doe,+1,5551234567\nJane Smith,+39,0212345678\nMaria Garcia,+34,612345678";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts_sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleManualSubmit = () => {
    const validationResult = validate(formData);

    if (!validationResult.isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      onContactAdded({
        name: formData.name,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
      });

      toast.success({
        title: t("success.contactAdded"),
      });

      // Reset form
      setFormData({ name: "", countryCode: "", phoneNumber: "" });
      clearErrors();
      onOpenChange(false);
    } catch (error) {
      toast.error({
        title: t("errors.addFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVImport = () => {
    if (!uploadedFile) {
      toast.error({
        title: t("validation.csvRequired"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        
        // Skip header row
        const dataLines = lines.slice(1);
        let importedCount = 0;

        dataLines.forEach((line) => {
          const [name, countryCode, phoneNumber] = line.split(",").map((cell) => cell.trim());
          
          if (name && countryCode && phoneNumber) {
            onContactAdded({ name, countryCode, phoneNumber });
            importedCount++;
          }
        });

        if (importedCount > 0) {
          toast.success({
            title: t("success.contactsImported", { count: importedCount }),
          });
          setUploadedFile(null);
          onOpenChange(false);
        } else {
          toast.error({
            title: t("errors.importFailed"),
          });
        }
      };

      reader.onerror = () => {
        toast.error({
          title: t("errors.importFailed"),
        });
      };

      reader.readAsText(uploadedFile);
    } catch (error) {
      toast.error({
        title: t("errors.importFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", countryCode: "", phoneNumber: "" });
    setUploadedFile(null);
    clearErrors();
    setActiveTab("manual");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "csv")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">{t("tabs.manual")}</TabsTrigger>
            <TabsTrigger value="csv">{t("tabs.csv")}</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("manual.nameLabel")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t("manual.namePlaceholder")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={hasFieldError("name") ? "border-destructive" : ""}
              />
              {hasFieldError("name") && (
                <p className="text-sm text-destructive">{t(getFieldError("name"))}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryCode">
                {t("manual.countryCodeLabel")} <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                <SelectTrigger id="countryCode" className={hasFieldError("countryCode") ? "border-destructive" : ""}>
                  <SelectValue placeholder={t("manual.countryCodePlaceholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFieldError("countryCode") && (
                <p className="text-sm text-destructive">{t(getFieldError("countryCode"))}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                {t("manual.phoneLabel")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phoneNumber"
                placeholder={t("manual.phonePlaceholder")}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, ""))}
                className={hasFieldError("phoneNumber") ? "border-destructive" : ""}
              />
              {hasFieldError("phoneNumber") && (
                <p className="text-sm text-destructive">{t(getFieldError("phoneNumber"))}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button onClick={handleManualSubmit} disabled={isSubmitting}>
                {t("manual.submitButton")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-medium">{t("csv.title")}</h4>
              <p className="text-sm text-muted-foreground">{t("csv.description")}</p>
              <p className="text-sm text-muted-foreground">{t("csv.fileColumns")}</p>
            </div>

            <Button
              variant="outline"
              onClick={handleDownloadSample}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("csv.downloadSample")}
            </Button>

            <CSVDropzone
              onFileUploaded={setUploadedFile}
              uploadedFile={uploadedFile}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button onClick={handleCSVImport} disabled={isSubmitting || !uploadedFile}>
                {t("csv.importButton")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
