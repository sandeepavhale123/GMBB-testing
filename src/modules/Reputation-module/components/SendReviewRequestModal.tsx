import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Inbox, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addedOn: string;
}

interface Template {
  id: string;
  name: string;
  channel: "SMS" | "Email";
  status: "active" | "draft";
  date: string;
  content?: string;
}

interface SendReviewRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  templates: Template[];
  onSend: (contactId: string, templateId: string) => Promise<void>;
}

export const SendReviewRequestModal: React.FC<SendReviewRequestModalProps> = ({
  open,
  onOpenChange,
  contact,
  templates,
  onSend,
}) => {
  const { t } = useTranslation("Reputation/request");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  // Filter templates based on contact's available information
  const availableTemplates = templates.filter(template => {
    if (template.channel === "Email" && contact?.email) return true;
    if (template.channel === "SMS" && contact?.phone) return true;
    return false;
  });

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleSend = async () => {
    if (!contact || !selectedTemplateId) return;

    setIsSending(true);
    try {
      await onSend(contact.id, selectedTemplateId);
      // Reset state after successful send
      setSelectedTemplateId("");
    } catch (error) {
      console.error("Failed to send review request:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setSelectedTemplateId("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t("sendReviewRequest.title")} {contact && `- ${contact.name}`}
          </DialogTitle>
          <DialogDescription>
            {t("sendReviewRequest.selectTemplate")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {availableTemplates.length === 0 ? (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <Inbox className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {t("sendReviewRequest.noTemplatesAvailable")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("sendReviewRequest.createTemplateFirst")}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Template Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="template-select">
                  {t("sendReviewRequest.selectTemplate")}
                </Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger id="template-select">
                    <SelectValue placeholder={t("sendReviewRequest.selectTemplatePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Content Textarea */}
              {selectedTemplate && (
                <div className="space-y-2">
                  <Label htmlFor="template-content">
                    {t("sendReviewRequest.templateContent")}
                  </Label>
                  <Textarea
                    id="template-content"
                    value={selectedTemplate.content || "Default template content..."}
                    readOnly
                    className="min-h-[120px] resize-none"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSending}
          >
            {t("sendReviewRequest.cancel")}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedTemplateId || isSending || templates.length === 0}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("sendReviewRequest.sending")}
              </>
            ) : (
              t("sendReviewRequest.send")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
