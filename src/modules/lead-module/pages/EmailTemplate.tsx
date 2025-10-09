import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Save, Eye, Plus, Edit } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const EmailTemplate: React.FC = () => {
  const { t, loaded } = useI18nNamespace("Lead-module-pages/emailTemplate");
  const [email, setEmail] = useState("");
  const [subjeact, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (loaded) {
      setEmail(t("input.email"));
      setSubject(t("input.subject"));
      setContent(t("input.emailContent"));
    }
  }, [loaded, t]);
  const templates = [
    {
      name: t("template.welcome"),
      status: t("statuses.Active"),
      lastModified: t("template.welcomeMod"),
    },
    {
      name: t("template.follow"),
      status: t("statuses.Active"),
      lastModified: t("template.followMod"),
    },
    {
      name: t("template.news"),
      status: t("statuses.Draft"),
      lastModified: t("template.newsMod"),
    },
    {
      name: t("template.promo"),
      status: t("statuses.Inactive"),
      lastModified: t("template.promoMod"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t("newTemplate")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("templateList.title")}</CardTitle>
            <CardDescription>{t("templateList.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          template.status === "Active"
                            ? "default"
                            : template.status === "Draft"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {template.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {template.lastModified}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {t("editor.title")}
            </CardTitle>
            <CardDescription>{t("editor.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">{t("editor.nameLabel")}</Label>
                <Input
                  id="template-name"
                  placeholder={t("editor.namePlaceholder")}
                  defaultValue={email}
                />
              </div>
              <div>
                <Label htmlFor="subject-line">{t("editor.subjectLabel")}</Label>
                <Input
                  id="subject-line"
                  placeholder={t("editor.subjectPlaceholder")}
                  defaultValue={subjeact}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email-content">{t("editor.contentLabel")}</Label>
              <Textarea
                id="email-content"
                placeholder={t("editor.contentPlaceholder")}
                className="min-h-[200px]"
                defaultValue={content}
              />
            </div>

            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">
                {t("editor.variablesTitle")}:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "{{firstName}}",
                  "{{lastName}}",
                  "{{email}}",
                  "{{company}}",
                  "{{phone}}",
                ].map((variable) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                {t("buttons.preview")}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline"> {t("buttons.saveDraft")}</Button>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  {t("buttons.saveActivate")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplate;
