import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { useFormValidation } from "@/hooks/useFormValidation";
import { manualContactSchema, type ManualContactFormData } from "@/schemas/contactSchema";
import { countryCodes } from "@/data/countryCodes";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { toast } from "@/hooks/use-toast";
import { Download, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);

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

        {/* Tab Toggle Buttons */}
        <div className="inline-flex rounded-lg border border-border bg-background p-1 w-full">
          <Button
            variant={activeTab === "manual" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("manual")}
            className="rounded-md px-4 flex-1"
          >
            {t("tabs.manual")}
          </Button>
          <Button
            variant={activeTab === "csv" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("csv")}
            className="rounded-md px-4 flex-1"
          >
            {t("tabs.csv")}
          </Button>
        </div>

        {/* Manual Entry Content */}
        {activeTab === "manual" && (
          <div className="space-y-4 mt-4">
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
              <Label>
                {t("manual.countryCodeLabel")} & {t("manual.phoneLabel")} <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryCodeOpen}
                      className={cn(
                        "w-[180px] justify-between text-left",
                        hasFieldError("countryCode") && "border-destructive"
                      )}
                    >
                      <span className="truncate">
                        {formData.countryCode
                          ? countryCodes.find((country) => country.code === formData.countryCode)?.label
                          : t("manual.countryCodePlaceholder")}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 z-[100]" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countryCodes.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.label}
                              onSelect={() => {
                                handleInputChange("countryCode", country.code);
                                setCountryCodeOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.countryCode === country.code ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                <Input
                  id="phoneNumber"
                  placeholder={t("manual.phonePlaceholder")}
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, ""))}
                  className={cn("flex-1", hasFieldError("phoneNumber") && "border-destructive")}
                />
              </div>
              {(hasFieldError("countryCode") || hasFieldError("phoneNumber")) && (
                <p className="text-sm text-destructive">
                  {hasFieldError("countryCode") ? t(getFieldError("countryCode")) : t(getFieldError("phoneNumber"))}
                </p>
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
          </div>
        )}

        {/* CSV Import Content */}
        {activeTab === "csv" && (
          <div className="space-y-4 mt-4">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
