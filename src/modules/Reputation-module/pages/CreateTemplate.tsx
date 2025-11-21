import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { PhonePreview } from "@/modules/Reputation-module/components/PhonePreview";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const DEFAULT_SMS_TEMPLATE = `Hi {name}!

👋 We hope you enjoyed your recent experience with us. Could you please take a moment to leave us a review? ⭐

Review Link:{reviewLink}`;

const DEFAULT_EMAIL_TEMPLATE = `Hi {name}!

👋 We hope you enjoyed your recent experience with us. Could you please take a moment to leave us a review? ⭐

Review Link:{reviewLink}`;

const DEFAULT_WHATSAPP_TEMPLATE = `Hi {name}!

👋 We hope you enjoyed your recent experience with us. Could you please take a moment to leave us a review? ⭐

Review Link:{reviewLink}`;

// Mock template data - would be replaced with actual API call
const mockTemplatesData: Record<
  string,
  { name: string; channel: "sms" | "email" | "whatsapp"; content: string }
> = {
  "1": {
    name: "Simple Review Request",
    channel: "sms",
    content: `Hi {name}!

👋 Thank you for choosing us! Please share your experience...

Review Link:{reviewLink}`,
  },
  "2": {
    name: "Friendly Follow-up",
    channel: "email",
    content: `Dear {name}!

👋 We'd love to hear your feedback...

Review Link:{reviewLink}`,
  },
  "3": {
    name: "Professional Request",
    channel: "sms",
    content: `Hello {name}!

👋 We value your opinion...

Review Link:{reviewLink}`,
  },
  "4": {
    name: "Casual & Fun",
    channel: "sms",
    content: `Hey {name}! 👋

How was your experience?

Review Link:{reviewLink}`,
  },
};

const CreateTemplate: React.FC = () => {
  const { t } = useI18nNamespace("Reputation/createTemplate");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { templateId } = useParams<{ templateId?: string }>();
  const isEditMode = !!templateId;

  const [templateName, setTemplateName] = useState("");
  const [channel, setChannel] = useState<"sms" | "email" | "whatsapp">(
    "whatsapp"
  );
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [templateContent, setTemplateContent] = useState(
    DEFAULT_WHATSAPP_TEMPLATE
  );

  // Auto-fill template data when in edit mode
  useEffect(() => {
    if (isEditMode && templateId) {
      const templateData = mockTemplatesData[templateId];
      if (templateData) {
        setTemplateName(templateData.name);
        setChannel(templateData.channel);
        setTemplateContent(templateData.content);
      }
    }
  }, [templateId, isEditMode]);

  const templateSchema = z.object({
    templateName: z
      .string()
      .min(1, t("validation.nameRequired"))
      .max(100, "Template name must be less than 100 characters"),
    channel: z.enum(["sms", "email", "whatsapp"]),
    template: z.string().min(1, "Template cannot be empty"),
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

  const handleSubmit = async () => {
    try {
      const validatedData = templateSchema.parse({
        templateName,
        channel,
        template: templateContent,
      });

      toast({
        title: isEditMode ? "Template Updated" : t("success.title"),
        description: isEditMode
          ? "Your template has been updated successfully"
          : t("success.description"),
      });

      navigate("/module/reputation/request?tab=templates");
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
    <div className="pb-8 pt-4 min-h-screen bg-background">
      <div className="mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-foreground">
          {isEditMode ? "Edit Template" : t("title")}
        </h1>

        {/* Template Name Input */}
        <div className="space-y-2">
          <Input
            placeholder={t("templateName.placeholder")}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
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
              <div className="bg-blue-100 p-2 text-sm rounded-lg">
                <pre>
                  Short code : {"{name}"} , {"{reviewLink}"}{" "}
                </pre>
              </div>
              <Textarea
                rows={10}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Right: Phone Preview */}
          <div className="hidden md:flex items-center justify-center pt-[100px] pb-0 bg-blue-100">
            <PhonePreview channel={channel} content={templateContent} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            {isEditMode ? "Update Template" : t("submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;
