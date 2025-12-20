import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSaveBulkAIAutoReplyMutation } from "@/api/bulkAutoReplyApi";
import { useParams } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface BulkAISettings {
  tone?: string;
  text_reply?: string;
  customPrompt?: string;
  specific_star?: string[];
  oldStatus?: string;
  prompt?: string;
}
interface BulkAIConfigurationManagerProps {
  autoAiSettings?: BulkAISettings;
  onSave?: (settings: BulkAISettings) => void;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  projectId?: number;
  projectType?: string;
}
export const BulkAIConfigurationManager: React.FC<
  BulkAIConfigurationManagerProps
> = ({
  autoAiSettings,
  onSave,
  isEnabled = false,
  onToggle,
  projectId,
  projectType,
}) => {
  const { t } = useI18nNamespace("BulkAutoReply/bulkAIConfigurationManager");
  const params = useParams();
  const [saveBulkAIAutoReply] = useSaveBulkAIAutoReplyMutation();
  const [responseStyle, setResponseStyle] = useState("professional");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedStarRatings, setSelectedStarRatings] = useState<string[]>([
    "1_star",
    "2_star",
    "3_star",
    "4_star",
    "5_star",
  ]);
  const [replyTemplate, setReplyTemplate] = useState(`Hi {full_name},
{responcetext}
Thank you`);
  const [replyToExistingReviews, setReplyToExistingReviews] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [sampleResponse, setSampleResponse] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update state when autoAiSettings data is loaded
  useEffect(() => {
    if (autoAiSettings) {
      // Auto-enable advanced options if any advanced settings exist
      if (autoAiSettings.text_reply || autoAiSettings.customPrompt || autoAiSettings.specific_star) {
        setShowAdvanced(true);
      }
      if (autoAiSettings.text_reply) {
        setReplyTemplate(autoAiSettings.text_reply.replace(/\r\n/g, "\n"));
      }
      if (autoAiSettings.tone) {
        setResponseStyle(autoAiSettings.tone);
      }
      if (autoAiSettings.prompt) {
        setAdditionalInstructions(autoAiSettings.prompt);
      }
      if (autoAiSettings.customPrompt) {
        setCustomPrompt(autoAiSettings.customPrompt);
      }
      if (autoAiSettings?.specific_star) {
        setSelectedStarRatings(autoAiSettings.specific_star);
      }
      if (autoAiSettings?.oldStatus) {
        setReplyToExistingReviews(autoAiSettings.oldStatus === "1");
      }
    }
  }, [autoAiSettings]);
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const currentProjectId = projectId || parseInt(params.projectId || "1");

      // Format reply_text with proper line breaks for API
      const formattedReplyText = replyTemplate.replace(/\n/g, "\r\n");
      const response = await saveBulkAIAutoReply({
        projectId: currentProjectId,
        tone: responseStyle,
        customPrompt: customPrompt,
        reply_text: formattedReplyText,
        specific_star: selectedStarRatings,
        newStatus: 1,
        oldStatus: replyToExistingReviews ? 1 : 0,
      }).unwrap();

      // Call the onSave callback if provided
      if (onSave) {
        const payload = {
          tone: responseStyle,
          text_reply: formattedReplyText,
          specific_star: selectedStarRatings,
          oldStatus: replyToExistingReviews ? "1" : "0",
          prompt: additionalInstructions,
        };
        onSave(payload);
      }
      const locationCount = response.data?.ids?.length || 0;
      toast({
        title: t("toast.success"),
        description: t("toast.saveSuccess", {
          count: locationCount,
          plural: locationCount !== 1 ? "s" : "",
        }),
        // `AI Auto Reply settings saved successfully! Updated ${locationCount} location${
        //   locationCount !== 1 ? "s" : ""
        // }.`,
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.saveError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleToggleEnabled = async (enabled: boolean) => {
    try {
      const currentProjectId = projectId || parseInt(params.projectId || "1");

      // Format reply_text with proper line breaks for API
      const formattedReplyText = replyTemplate.replace(/\n/g, "\r\n");
      const response = await saveBulkAIAutoReply({
        projectId: currentProjectId,
        tone: responseStyle,
        customPrompt: customPrompt,
        reply_text: formattedReplyText,
        specific_star: selectedStarRatings,
        newStatus: 1,
        oldStatus: replyToExistingReviews ? 1 : 0,
      }).unwrap();
      if (onToggle) {
        onToggle(enabled);
      }
      const locationCount = response.data?.ids?.length || 0;
      toast({
        title: t("toast.success"),
        description: t("toast.toggleSuccess", {
          status: enabled ? "enabled" : "disabled",
          count: locationCount,
          plural: locationCount !== 1 ? "s" : "",
        }),
        // `AI Auto Reply ${
        //   enabled ? "enabled" : "disabled"
        // } successfully! Updated ${locationCount} location${
        //   locationCount !== 1 ? "s" : ""
        // }.`,
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.toggleError"),
        variant: "destructive",
      });
    }
  };
  const handleToggleReplyToExisting = async (enabled: boolean) => {
    try {
      const currentProjectId = projectId || parseInt(params.projectId || "1");

      // Format reply_text with proper line breaks for API
      const formattedReplyText = replyTemplate.replace(/\n/g, "\r\n");
      const response = await saveBulkAIAutoReply({
        projectId: currentProjectId,
        tone: responseStyle,
        customPrompt: customPrompt,
        reply_text: formattedReplyText,
        specific_star: selectedStarRatings,
        newStatus: 1,
        oldStatus: enabled ? 1 : 0,
      }).unwrap();
      setReplyToExistingReviews(enabled);
      const locationCount = response.data?.ids?.length || 0;
      toast({
        title: t("toast.success"),
        description: t("toast.replyToggleSuccess", {
          status: enabled ? "enabled" : "disabled",
          count: locationCount,
          plural: locationCount !== 1 ? "s" : "",
        }),
        // `Reply to existing reviews ${
        //   enabled ? "enabled" : "disabled"
        // } successfully! Updated ${locationCount} location${
        //   locationCount !== 1 ? "s" : ""
        // }.`,
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.replyToggleError"),
        variant: "destructive",
      });
    }
  };

  // Show DNR placeholder if project type is "dnr"
  if (projectType === "dnr") {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center text-center space-x-3 justify-center ">
            <CardTitle className="font-bold  text-[20px] text-center text-gray-900 ">
              {t("dnr.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <img
              src="/lovable-uploads/0b0da1e0-8d90-4343-aeff-7a9a7b821ef6.png"
              alt="Do not respond illustration"
              className="mx-auto mb-4 w-[200px] h-auto"
            />
            <p className="text-sm text-gray-500 mt-1">
              {t("dnr.description1")}
            </p>
            <p className="text-muted-foreground">{t("dnr.description2")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-4">
              <CardTitle className="text-base font-medium text-gray-900">
                {t("header.title")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-600 text-white hover:bg-purple-300 hover:text-black"
                >
                  {t("header.badge")}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t("header.description")}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Configuration Panel */}
      <CardContent className="space-y-6">
        {/* AI Response Style */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <label className="text-sm font-semibold text-foreground">
              {t("responseStyle.label")}
            </label>
          </div>
          <Select value={responseStyle} onValueChange={setResponseStyle}>
            <SelectTrigger className="bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder={t("responseStyle.placeholder")} />
            </SelectTrigger>
            <SelectContent className="bg-background border-border/60 shadow-lg">
              <SelectItem value="professional" className="hover:bg-muted/80">
                {t("responseStyle.styles.professional")}
              </SelectItem>
              <SelectItem value="friendly" className="hover:bg-muted/80">
                {t("responseStyle.styles.friendly")}
              </SelectItem>
              <SelectItem value="casual" className="hover:bg-muted/80">
                {t("responseStyle.styles.casual")}
              </SelectItem>
              <SelectItem value="formal" className="hover:bg-muted/80">
                {t("responseStyle.styles.formal")}
              </SelectItem>
              <SelectItem value="empathetic" className="hover:bg-muted/80">
                <div className="flex items-center gap-2">
                  {/* <div className="w-2 h-2 bg-red-500 rounded-full"></div> */}
                  {t("responseStyle.styles.empathetic")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
          {t("responseStyle.hint")}
        </p>

        {/* Advanced Options Toggle */}
        <Card className="bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-foreground">
                {t("advanced.label")}
              </label>
            </div>
            <Switch
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </Card>

        {/* Advanced Options Content */}
        {showAdvanced && (
          <div className="space-y-6">
            {/* Variables Info Card */}
            <div className="rounded-2xl p-4 bg-blue-900 text-white">
              <label className="block text-sm font-semibold text-gray-200 mb-1">
                {t("advanced.noteTitle")}
              </label>
              <p className="text-sm leading-relaxed">
                {t("advanced.noteText1")}
                <span className="font-medium text-white">
                  {" "}
                  {"{full_name}"}, {"{first_name}"}, {"{last_name}"}
                </span>
                {t("advanced.noteText2")}
                <span className="font-medium text-white">
                  {" "}
                  {"{responcetext}"}
                </span>
                {t("advanced.noteText3")}
              </p>
            </div>

            {/* Custom Prompt Section */}
            <div className="space-y-3 group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <label className="text-sm font-semibold text-foreground">
                  {t("advanced.customPrompt.label")}
                </label>
              </div>
              <div className="relative">
                <Textarea
                  placeholder={t("advanced.customPrompt.placeholder")}
                  className="min-h-[80px] bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y text-sm"
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => {
                    if (e.target.value.length <= 800) {
                      setCustomPrompt(e.target.value);
                    }
                  }}
                  maxLength={800}
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${customPrompt.length >= 800 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {customPrompt.length}/800
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("advanced.customPrompt.hint")}
              </p>
            </div>

            {/* Reply Text Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <label className="text-sm font-semibold text-foreground">
                  {t("advanced.replyText")}
                </label>
              </div>
              <Textarea
                placeholder={t("advanced.responsePlaceholder")}
                className="min-h-[120px] bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y font-mono text-sm"
                rows={6}
                value={replyTemplate}
                onChange={(e) => setReplyTemplate(e.target.value)}
              />
            </div>

            {/* Star Ratings Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <h4 className="text-sm font-semibold text-foreground">
                  {t("advanced.starRatings")}
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const starKey = `${star}_star`;
                  const isChecked = selectedStarRatings.includes(starKey);
                  return (
                    <Card
                      key={star}
                      className={`p-3 cursor-pointer border-border/60 transition-all hover:border-primary/70 ${
                        isChecked ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedStarRatings((prev) =>
                            prev.filter((s) => s !== starKey)
                          );
                        } else {
                          setSelectedStarRatings((prev) => [...prev, starKey]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`checkbox-star-${star}`}
                          className="text-sm text-foreground flex items-center gap-1 cursor-pointer"
                        >
                          {star} Star
                        </label>
                        <Checkbox
                          id={`checkbox-star-${star}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStarRatings((prev) => [
                                ...prev,
                                starKey,
                              ]);
                            } else {
                              setSelectedStarRatings((prev) =>
                                prev.filter((s) => s !== starKey)
                              );
                            }
                          }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Generate Sample AI Response Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <CardTitle className="text-sm font-semibold text-foreground">
                {t("sample.title")}
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("sample.subtitle")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dummy Review Example */}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {t("sample.reviewUser")}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t("sample.reviewText")}</p>
            </div>

            <Button
              onClick={() => {
                setIsGeneratingSample(true);
                // Simulate AI response generation
                setTimeout(() => {
                  setSampleResponse(`Hi John Doe,

Thank you so much for taking the time to share your ${
                    responseStyle || "professional"
                  } experience with us! We're thrilled to hear that you had a great time and that our staff exceeded your expectations.

Your feedback about our excellent service means a lot to our team. We're delighted that you found our staff friendly and helpful.

We appreciate your business and look forward to serving you again soon!

Best regards,
The Team`);
                  setIsGeneratingSample(false);
                }, 2000);
              }}
              disabled={isGeneratingSample}
              variant="outline"
              className="w-full"
            >
              {isGeneratingSample ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("sample.buttonLoading")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t("sample.button")}
                </>
              )}
            </Button>

            {sampleResponse && (
              <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("sample.generatedLabel")}
                </p>
                <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                  {sampleResponse}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reply to Existing Reviews */}
        <Card className="bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-foreground">
                {t("replyExisting.label")}
              </label>
            </div>
            <Switch
              checked={replyToExistingReviews}
              onCheckedChange={handleToggleReplyToExisting}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("replyExisting.description")}
          </p>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("save.button")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
