import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Inbox, Loader2 } from "lucide-react";
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

  const getChannelIcon = (channel: "SMS" | "Email") => {
    return channel === "SMS" ? (
      <MessageSquare className="w-4 h-4" />
    ) : (
      <Mail className="w-4 h-4" />
    );
  };

  const getContentPreview = (template: Template) => {
    if (template.content) {
      return template.content.length > 80
        ? `${template.content.substring(0, 80)}...`
        : template.content;
    }
    return "Default template content...";
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

        {templates.length === 0 ? (
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
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <RadioGroup
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              {templates.map((template) => (
                <div key={template.id}>
                  <Label
                    htmlFor={`template-${template.id}`}
                    className="cursor-pointer"
                  >
                    <Card
                      className={cn(
                        "p-4 transition-all hover:border-primary",
                        selectedTemplateId === template.id &&
                          "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value={template.id}
                          id={`template-${template.id}`}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {template.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 shrink-0"
                            >
                              {getChannelIcon(template.channel)}
                              <span>{template.channel}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getContentPreview(template)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

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
