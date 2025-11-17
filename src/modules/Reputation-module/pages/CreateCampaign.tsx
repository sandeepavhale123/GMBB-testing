import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhonePreview } from "@/modules/Reputation-module/components/PhonePreview";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { z } from "zod";
import { getAllFormsFromLocalStorage } from "../utils/formBuilder.utils";

interface Contact {
  name: string;
  phone: string;
}

interface FeedbackForm {
  id?: string;
  name: string;
  createdAt?: string;
  fields?: any[];
}
const DEFAULT_SMS_TEMPLATE = `Hi Name!

👋 We hope you enjoyed your recent experience with us. Could you please take a moment to leave us a review? ⭐

Review Link`;
const DEFAULT_EMAIL_TEMPLATE = `Hi Name!

👋 We hope you enjoyed your recent experience with us. Could you please take a moment to leave us a review? ⭐

Review Link`;
const DEFAULT_WHATSAPP_TEMPLATE = `Hi Name!

👋 We hope you enjoyed your recent experience with us. Could you please take a moment to leave us a review? ⭐

Review Link`;
export const CreateCampaign: React.FC = () => {
  const { t } = useI18nNamespace("Reputation/createCampaign");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<"review" | "survey">(
    "review"
  );
  const [channel, setChannel] = useState<"sms" | "email" | "whatsapp">(
    "whatsapp"
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [templateContent, setTemplateContent] = useState(
    DEFAULT_WHATSAPP_TEMPLATE
  );
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [uploadedCSVFile, setUploadedCSVFile] = useState<File | null>(null);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [selectedFeedbackForm, setSelectedFeedbackForm] = useState<string>("");
  // Load feedback forms on mount
  useEffect(() => {
    const forms = getAllFormsFromLocalStorage();
    setFeedbackForms(forms);
  }, []);

  // Handle campaign type switch - clear feedback form when switching to review
  useEffect(() => {
    if (campaignType === "review") {
      setSelectedFeedbackForm("");
      // Remove feedback form URL from template content
      setTemplateContent((prev) =>
        prev.replace(/📋.*?\n.*?\/feedback\/form\/[^\s]+/g, "").trim()
      );
    }
  }, [campaignType]);

  // Auto-insert feedback form URL when selected
  useEffect(() => {
    if (campaignType === "survey" && selectedFeedbackForm) {
      const formUrl = `${window.location.origin}/feedback/form/${selectedFeedbackForm}`;

      // Check if URL already exists to avoid duplicates
      if (!templateContent.includes(formUrl)) {
        setTemplateContent((prev) => {
          // Remove any existing feedback form URLs first
          const cleaned = prev
            .replace(/📋.*?\n.*?\/feedback\/form\/[^\s]+/g, "")
            .trim();

          if (cleaned) {
            return `${cleaned}\n\n📋 Survey Form: ${formUrl}`;
          }
          return `📋 Please take a moment to complete our survey:\n${formUrl}`;
        });
      }
    }
  }, [selectedFeedbackForm, campaignType]);

  const campaignSchema = z.object({
    campaignName: z
      .string()
      .min(1, t("validation.nameRequired"))
      .max(100, "Campaign name must be less than 100 characters"),
    channel: z.enum(["sms", "email", "whatsapp"]),
    contacts: z
      .array(
        z.object({
          name: z.string().min(1),
          phone: z.string().regex(/^\d{10,15}$/, t("validation.invalidPhone")),
        })
      )
      .min(1, t("validation.contactRequired")),
    template: z.string().min(1, "Template cannot be empty"),
    schedule: z.object({
      enabled: z.boolean(),
      date: z.string().optional(),
      time: z.string().optional(),
    }),
  });
  const handleChannelChange = (value: string) => {
    if (value === "sms" || value === "email" || value === "whatsapp") {
      setChannel(value);
      if (value === "sms") {
        setTemplateContent(DEFAULT_SMS_TEMPLATE);
      } else if (value === "email") {
        setTemplateContent(DEFAULT_EMAIL_TEMPLATE);
      } else {
        setTemplateContent(DEFAULT_WHATSAPP_TEMPLATE);
      }
    }
  };
  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast({
        title: "Error",
        description:
          channel === "email"
            ? "Please enter both name and email"
            : "Please enter both name and phone number",
        variant: "destructive",
      });
      return;
    }
    if (channel !== "email" && !/^\d{10,15}$/.test(newContactPhone)) {
      toast({
        title: "Error",
        description: t("validation.invalidPhone"),
        variant: "destructive",
      });
      return;
    }
    setContacts([
      ...contacts,
      {
        name: newContactName,
        phone: newContactPhone,
      },
    ]);
    setNewContactName("");
    setNewContactPhone("");
  };
  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };
  const handleEditContact = (index: number) => {
    const contact = contacts[index];
    setNewContactName(contact.name);
    setNewContactPhone(contact.phone);
    handleRemoveContact(index);
  };
  const handleDownloadSample = () => {
    const headers = channel === "email" ? "name,email" : "name,phone";
    const sampleRow =
      channel === "email" ? "John Doe,john@example.com" : "John Doe,1234567890";
    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_contacts.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleCSVUpload = (file: File) => {
    setUploadedCSVFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        toast({
          title: "Error",
          description: "CSV file is empty or invalid",
          variant: "destructive",
        });
        return;
      }

      const headers = lines[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim());
      const nameIndex = headers.indexOf("name");
      const phoneIndex = headers.indexOf("phone");
      const emailIndex = headers.indexOf("email");

      if (nameIndex === -1) {
        toast({
          title: "Error",
          description: "CSV must contain 'name' column",
          variant: "destructive",
        });
        return;
      }

      if (channel === "email" && emailIndex === -1) {
        toast({
          title: "Error",
          description: "CSV must contain 'email' column for email campaigns",
          variant: "destructive",
        });
        return;
      }

      if ((channel === "sms" || channel === "whatsapp") && phoneIndex === -1) {
        toast({
          title: "Error",
          description:
            "CSV must contain 'phone' column for SMS/WhatsApp campaigns",
          variant: "destructive",
        });
        return;
      }

      const newContacts: Contact[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const name = values[nameIndex];
        const contactValue =
          channel === "email" ? values[emailIndex] : values[phoneIndex];

        if (name && contactValue) {
          if (channel !== "email" && !/^\d{10,15}$/.test(contactValue)) {
            continue;
          }
          newContacts.push({ name, phone: contactValue });
        }
      }

      if (newContacts.length === 0) {
        toast({
          title: "Error",
          description: "No valid contacts found in CSV",
          variant: "destructive",
        });
        return;
      }

      setContacts([...contacts, ...newContacts]);
      toast({
        title: "Success",
        description: `${newContacts.length} contacts imported successfully`,
      });
      setIsImportModalOpen(false);
      setUploadedCSVFile(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      const validatedData = campaignSchema.parse({
        campaignName,
        channel,
        contacts,
        template: templateContent,
        schedule: {
          enabled: scheduleEnabled,
          date: scheduleDate,
          time: scheduleTime,
        },
      });
      toast({
        title: t("success.title"),
        description: t("success.description"),
      });
      navigate("/module/reputation/request");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Please check your inputs",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="pb-8 pt-4  min-h-screen bg-background">
      <div className="mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>

        {/* Campaign Name and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("campaignName.label")}
            </label>
            <Input
              placeholder={t("campaignName.placeholder")}
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full text-base"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("campaignType.label")}
            </label>
            <Select
              value={campaignType}
              onValueChange={(value: "review" | "survey") =>
                setCampaignType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("campaignType.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="review">
                  {t("campaignType.review")}
                </SelectItem>
                <SelectItem value="survey">
                  {t("campaignType.survey")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Channel Toggle */}
        <div className="space-y-2">
          <ToggleGroup
            type="single"
            value={channel}
            onValueChange={handleChannelChange}
            className="justify-start w-full"
          >
            <ToggleGroupItem
              value="whatsapp"
              className="flex-1 data-[state=on]:bg-white data-[state=on]:border-2 data-[state=on]:border-border data-[state=on]:font-semibold data-[state=off]:bg-muted"
            >
              {t("channel.whatsapp")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="sms"
              className="flex-1 data-[state=on]:bg-white data-[state=on]:border-2 data-[state=on]:border-border data-[state=on]:font-semibold data-[state=off]:bg-muted"
            >
              {t("channel.sms")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="email"
              className="flex-1 data-[state=on]:bg-white data-[state=on]:border-2 data-[state=on]:border-border data-[state=on]:font-semibold data-[state=off]:bg-muted"
            >
              {t("channel.email")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Add Contacts Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{t("contacts.title")}</h3>
              <div className="flex gap-4">
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  {t("contacts.importCSV")}
                </Button>
                <Button variant="link" className="text-primary p-0 h-auto">
                  {t("contacts.contactList")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-4 items-end">
              <Input
                placeholder={t("contacts.namePlaceholder")}
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
              <Input
                type={channel === "email" ? "email" : "tel"}
                placeholder={
                  channel === "email"
                    ? t("contacts.emailPlaceholder")
                    : t("contacts.phonePlaceholder")
                }
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
              />
              <Button
                onClick={handleAddContact}
                className="bg-black hover:bg-black/90 text-white whitespace-nowrap"
                style={{
                  width: "138px",
                }}
              >
                {t("contacts.addButton")}
              </Button>
            </div>

            {/* Display added contacts */}
            {contacts.length > 0 && (
              <div className="mt-4 border border-grey-200 rounded-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Sr.No
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                        {channel === "email" ? "Email" : "Contact No."}
                      </th>
                      <th className="text-right px-4 font-semibold text-sm text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm">{index + 1}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {contact.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {contact.phone}
                        </td>
                        <td className="py-3 px-4 flex justify-end ">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContact(index)}
                              className="h-8 px-2"
                            >
                              {t("contacts.editButton")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveContact(index)}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {t("contacts.removeButton")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border rounded-md">
          {/* Left: Template Editor */}
          <Card className="border-0">
            <CardHeader>
              <h3 className="text-lg font-semibold">{t("template.title")}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("template.defaultTemplate")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    {t("template.defaultTemplate")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Feedback Form Selector - Only for Survey Campaigns */}
              {campaignType === "survey" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("feedbackForm.label")}
                  </label>
                  <Select
                    value={selectedFeedbackForm}
                    onValueChange={setSelectedFeedbackForm}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("feedbackForm.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackForms.length === 0 ? (
                        <SelectItem value="none" disabled>
                          {t("feedbackForm.noFormsAvailable")}
                        </SelectItem>
                      ) : (
                        feedbackForms.map((form) => (
                          <SelectItem key={form.id} value={form.id || ""}>
                            {form.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Textarea
                rows={10}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Right: Phone Preview */}
          <div className="hidden md:flex items-center justify-center  pt-[100px] pb-0 bg-blue-100 ">
            <PhonePreview channel={channel} content={templateContent} />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={scheduleEnabled}
              onCheckedChange={setScheduleEnabled}
            />
            <label className="text-sm font-medium text-foreground">
              {t("schedule.label")}
            </label>
          </div>

          {scheduleEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder={t("schedule.date")}
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
              <Input
                type="time"
                placeholder={t("schedule.time")}
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            {t("submit")}
          </Button>
        </div>
      </div>

      {/* Import CSV Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{t("importModal.title")}</DialogTitle>
              <Button
                variant="link"
                className="text-primary p-0 h-auto flex items-center gap-2"
                onClick={handleDownloadSample}
              >
                <Download className="h-4 w-4" />
                {t("importModal.downloadSample")}
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <CSVDropzone
              onFileUploaded={handleCSVUpload}
              uploadedFile={uploadedCSVFile}
              isReupload={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
