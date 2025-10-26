import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhonePreview } from "@/modules/Reputation-module/components/PhonePreview";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface Contact {
  name: string;
  phone: string;
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
  const [channel, setChannel] = useState<"sms" | "email" | "whatsapp">("sms");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [templateContent, setTemplateContent] = useState(DEFAULT_SMS_TEMPLATE);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

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
        }),
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
        description: "Please enter both name and phone number",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10,15}$/.test(newContactPhone)) {
      toast({
        title: "Error",
        description: t("validation.invalidPhone"),
        variant: "destructive",
      });
      return;
    }

    setContacts([...contacts, { name: newContactName, phone: newContactPhone }]);
    setNewContactName("");
    setNewContactPhone("");
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

        {/* Campaign Name Input */}
        <div className="space-y-2">
          <Input
            placeholder={t("campaignName.placeholder")}
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full text-base"
          />
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
            <ToggleGroupItem
              value="whatsapp"
              className="flex-1 data-[state=on]:bg-white data-[state=on]:border-2 data-[state=on]:border-border data-[state=on]:font-semibold data-[state=off]:bg-muted"
            >
              {t("channel.whatsapp")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Add Contacts Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{t("contacts.title")}</h3>
              <div className="flex gap-4">
                <Button variant="link" className="text-primary p-0 h-auto">
                  {t("contacts.importCSV")}
                </Button>
                <Button variant="link" className="text-primary p-0 h-auto">
                  {t("contacts.contactList")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder={t("contacts.namePlaceholder")}
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
              <Input
                placeholder={t("contacts.phonePlaceholder")}
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
              />
            </div>
            <Button onClick={handleAddContact} className="bg-black hover:bg-black/90 text-white w-[138px]">
              {t("contacts.addButton")}
            </Button>
            {contacts.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Added Contacts ({contacts.length})</p>
                <div className="space-y-2">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="text-sm">
                        {contact.name} - {contact.phone}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border rounded">
          {/* Left: Template Editor */}
          <Card className="border-0">
            <CardHeader>
              <h3 className="text-lg font-semibold">{t("template.title")}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder={t("template.defaultTemplate")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("template.defaultTemplate")}</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                rows={10}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Right: Phone Preview */}
          <div className="flex items-center justify-center">
            <PhonePreview channel={channel} content={templateContent} />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
            <label className="text-sm font-medium text-foreground">{t("schedule.label")}</label>
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
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-8">
            {t("submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};
