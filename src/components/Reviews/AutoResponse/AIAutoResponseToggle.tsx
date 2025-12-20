import React, { useEffect, useState } from "react";
import { Switch } from "../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Sparkles, Star, Calendar, User, Loader2 } from "lucide-react";
import {
  AutoAiSettings,
  LatestReview,
} from "../../../store/slices/reviews/templateTypes";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { useAppDispatch } from "@/hooks/useRedux";
import { useListingContext } from "@/context/ListingContext";
import {
  generateAIAutoReply,
  saveAIAutoReply,
} from "@/store/slices/reviews/thunks";
import { toast } from "@/hooks/use-toast";
import { ReplyToOldReviewsCard } from "./ReplyToOldReviewsCard";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface AIAutoResponseToggleProps {
  enabled: boolean;
  onToggle: () => void;
  autoAiSettings?: AutoAiSettings;
  review?: LatestReview;
}
export const AIAutoResponseToggle: React.FC<AIAutoResponseToggleProps> = ({
  enabled,
  onToggle,
  autoAiSettings,
  review,
}) => {
  const { t } = useI18nNamespace("Reviews/aiAutoResponse");
  const [responseStyle, setResponseStyle] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStarRatings, setSelectedStarRatings] = useState<string[]>([]);
  const [replyTemplate, setReplyTemplate] = useState(`Hi {full_name},
{responcetext}
Thank you`);
  const [customPrompt, setCustomPrompt] = useState("");
  const [settings, setSettings] = useState({
    useReviewerName: true,
    adaptTone: true,
    referenceSpecificPoints: false,
    requireApproval: true,
  });
  const [replyToExistingReviews, setReplyToExistingReviews] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();

  // Update state when autoAiSettings data is loaded
  useEffect(() => {
    if (autoAiSettings) {
      if (autoAiSettings.text_reply) {
        setReplyTemplate(autoAiSettings.text_reply.replace(/\\r\\n/g, "\n"));
      }
      if (autoAiSettings.tone) {
        setResponseStyle(autoAiSettings.tone);
      }
      if (autoAiSettings.prompt) {
        setAdditionalInstructions(autoAiSettings.prompt);
      }
      if (autoAiSettings?.specific_star) {
        setSelectedStarRatings(autoAiSettings.specific_star);
      }
      if (autoAiSettings?.oldStatus) {
        setReplyToExistingReviews(autoAiSettings.oldStatus === "1");
      }
      if (autoAiSettings?.customPrompt) {
        setCustomPrompt(autoAiSettings.customPrompt);
      }
    }
  }, [autoAiSettings]);
  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSaveSettings = () => {
    if (!selectedListing?.id) return;

    setIsSaving(true); // start loader

    const payload = {
      listingId: Number(selectedListing.id),
      tone: responseStyle,
      customPrompt: customPrompt,
      reply_text: replyTemplate,
      specific_star: selectedStarRatings,
      newStatus: 1,
      oldStatus: replyToExistingReviews ? 1 : 0,
    };

    dispatch(saveAIAutoReply(payload))
      .unwrap()
      .then((res) => {
        toast({
          title: t("aiAutoResponse.toast.success.saveTitle"),
          description:
            res.message || t("aiAutoResponse.toast.success.saveDescription"),
        });
      })
      .catch((err) => {
        toast({
          title: t("aiAutoResponse.toast.error.saveTitle"),
          description: err || t("aiAutoResponse.toast.error.saveDescription"),
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSaving(false); // end loader
      });
  };

  const handleGenerateAIResponse = () => {
    if (!selectedListing?.id || !review?.id) return;
    setIsGenerating(true);
    const payload = {
      reviewId: Number(review.id),
      customPrompt: customPrompt,
      tone: responseStyle,
      reviewReplyFormat: replyTemplate,
    };
    dispatch(generateAIAutoReply(payload))
      .unwrap()
      .then((generatedText) => {
        setAiResponse(generatedText);
        // setReplyTemplate(generatedText);
        toast({
          title: t("aiAutoResponse.toast.success.saveTitle"),
          description: t("aiAutoResponse.toast.success.generateDescription"),
        });
      })
      .catch((err) => {
        toast({
          title: t("aiAutoResponse.toast.error.saveTitle"),
          description:
            typeof err === "string"
              ? err
              : err?.message ||
                t("aiAutoResponse.toast.error.generateDescription"),
          variant: "destructive",
        });
      })
      .finally(() => setIsGenerating(false));
  };
  return (
    <div className="space-y-4">
      {/* Toggle Header */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-4 sm:gap-2">
              <h3 className="text-base font-medium text-gray-900">
                {t("aiAutoResponse.header.title")}
              </h3>
              <Badge
                variant="secondary"
                className="bg-purple-600 text-white hover:bg-purple-300 hover:text-black"
              >
                {t("aiAutoResponse.header.badge")}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {t("aiAutoResponse.header.description")}
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      {/* Configuration Panel */}
      {enabled && (
        <div className=" bg-white border border-border/50 rounded-xl shadow-sm animate-fade-in p-2 sm:p-6">
          <div className=" sm:grid 2xl:grid-cols-2">
            <div className="p-4 w-fit sm:w-auto">
              {/* AI Response Style */}
              <div className="space-y-3 group mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <label className="text-sm font-semibold text-foreground">
                    {t("aiAutoResponse.responseStyle.label")}
                  </label>
                </div>
                <Select value={responseStyle} onValueChange={setResponseStyle}>
                  <SelectTrigger className="bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue
                      placeholder={t(
                        "aiAutoResponse.responseStyle.placeholder"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/60 shadow-lg">
                    <SelectItem
                      value="professional"
                      className="hover:bg-muted/80"
                    >
                      <div className="flex items-center gap-2">
                        {t("aiAutoResponse.responseStyle.options.professional")}
                      </div>
                    </SelectItem>
                    <SelectItem value="friendly" className="hover:bg-muted/80">
                      <div className="flex items-center gap-2">
                        {t("aiAutoResponse.responseStyle.options.friendly")}
                      </div>
                    </SelectItem>
                    <SelectItem value="casual" className="hover:bg-muted/80">
                      <div className="flex items-center gap-2">
                        {t("aiAutoResponse.responseStyle.options.casual")}
                      </div>
                    </SelectItem>
                    <SelectItem value="formal" className="hover:bg-muted/80">
                      <div className="flex items-center gap-2">
                        {t("aiAutoResponse.responseStyle.options.formal")}
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="empathetic"
                      className="hover:bg-muted/80"
                    >
                      <div className="flex items-center gap-2">
                        {/* <div className="w-2 h-2 bg-red-500 rounded-full"></div> */}
                        {t("aiAutoResponse.responseStyle.options.empathetic")}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Options Toggle */}
              <div className="space-y-3 group mb-4">
                <Card className="bg-gray-50 border border-gray-200 p-4 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-foreground">
                        {t("aiAutoResponse.advancedOptions.label")}
                      </label>
                    </div>
                    <Switch
                      checked={showAdvanced}
                      onCheckedChange={setShowAdvanced}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </Card>
              </div>

              {/* Apply For Section - Advanced */}
              {showAdvanced && (
                <div className="space-y-4 group">
                  <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                    {t("aiAutoResponse.advancedOptions.note")}
                  </p>

                  {/* Variables Info Card */}
                  <div className="rounded-2xl p-4 bg-blue-900 text-white mb-4">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                      {t("aiAutoResponse.advancedOptions.variables.title")}
                    </label>
                    <p className="text-sm leading-relaxed">
                      {t(
                        "aiAutoResponse.advancedOptions.variables.description"
                      )}
                      <span className="font-medium text-white">
                        {"{full_name}"}, {"{first_name}"}, {"{last_name}"}
                      </span>
                      {t("aiAutoResponse.advancedOptions.variables.descEnd")}
                      <span className="font-medium text-white">
                        {" "}
                        {"{responcetext}"}
                      </span>
                      {t(
                        "aiAutoResponse.advancedOptions.variables.descTextEnd"
                      )}
                    </p>
                  </div>

                  {/* Custom Prompt Section */}
                  <div className="space-y-3 group mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <label className="text-sm font-semibold text-foreground">
                          {t("aiAutoResponse.advancedOptions.customPrompt.label")}
                        </label>
                      </div>
                      <span className={`text-xs ${customPrompt.length > 800 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {customPrompt.length}/800
                      </span>
                    </div>
                    <Textarea
                      placeholder={t(
                        "aiAutoResponse.advancedOptions.customPrompt.placeholder"
                      )}
                      className="min-h-[80px] bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y text-sm"
                      rows={3}
                      value={customPrompt}
                      maxLength={800}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("aiAutoResponse.advancedOptions.customPrompt.hint")}
                    </p>
                  </div>

                  {/* Reply Text Section */}
                  <div className="space-y-3 group mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <label className="text-sm font-semibold text-foreground">
                        {t("aiAutoResponse.advancedOptions.replyText.label")}
                      </label>
                    </div>
                    <Textarea
                      placeholder={t(
                        "aiAutoResponse.advancedOptions.replyText.placeholder"
                      )}
                      className="min-h-[120px] bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y font-mono text-sm"
                      rows={6}
                      value={replyTemplate}
                      onChange={(e) => setReplyTemplate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {t("aiAutoResponse.advancedOptions.starRatings.label")}
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const starKey = `${star}_star`;
                      const isChecked = selectedStarRatings.includes(starKey);
                      return (
                        <Card
                          key={star}
                          className={`p-3 cursor-pointer border-border/60 ${
                            isChecked ? "border-primary bg-primary/10" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor={`checkbox-star-${star}`}
                              className="text-sm text-foreground flex items-center gap-1 cursor-pointer"
                            >
                              {t(
                                "aiAutoResponse.advancedOptions.starRatings.option",
                                {
                                  count: star,
                                }
                              )}
                              {/* {star} Star */}
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
              )}
              <div className="mt-4">
                <ReplyToOldReviewsCard
                  checked={replyToExistingReviews}
                  onToggle={setReplyToExistingReviews}
                  onSave={() => {
                    toast({
                      title: t("aiAutoResponse.replyToOldReviews.savedTitle"),
                      description: t(
                        "aiAutoResponse.replyToOldReviews.savedDescription"
                      ),
                    });
                  }}
                  isAutoResponseMode={false}
                />
              </div>
              {/* AI Response Settings */}
            </div>
            <div className="p-4">
              {/* Latest Review Section */}
              <div className="space-y-4 group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("aiAutoResponse.latestReview.title")}
                  </h4>
                </div>

                <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/60 dark:border-blue-800/60 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {t("aiAutoResponse.latestReview.previewLabel")}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* User Profile Section */}
                      <div className="flex items-start gap-4 p-4 bg-background/60 rounded-lg border border-border/40 flex-wrap">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                          {review?.pro_photo ? (
                            <img
                              src={review.pro_photo}
                              alt="profile"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              } // hide if broken
                            />
                          ) : (
                            // Fallback: Initials
                            <span>
                              {review?.display_name?.[0]?.toUpperCase() || "?"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm font-semibold text-foreground">
                                {review?.display_name}
                              </h4>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4  ${
                                      star <=
                                      parseInt(review?.star_rating || "0")
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}

                                <span className="text-sm text-muted-foreground ml-1">
                                  {review?.star_rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                              {formatToDayMonthYear(review?.review_cdate)}
                            </span>
                          </div>

                          {/* Review Message */}
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <p className="text-sm text-foreground leading-relaxed italic">
                              {review?.comment}
                            </p>
                          </div>
                        </div>
                      </div>

                      {aiResponse && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/60 dark:border-green-800/60 rounded-lg animate-fade-in">
                          <p className="text-sm text-foreground leading-relaxed bg-background/40 p-3 rounded border border-border/40">
                            {isGenerating ? (
                              <Loader2 className=" h-4 w-4 mx-auto animate-spin text-green-400" />
                            ) : (
                              aiResponse
                            )}
                          </p>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateAIResponse}
                          disabled={isGenerating}
                          className="hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          {isGenerating
                            ? t("aiAutoResponse.buttons.generating")
                            : aiResponse
                            ? t("aiAutoResponse.buttons.regenerate")
                            : t("aiAutoResponse.buttons.generate")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="flex justify-end  border-t border-border/30 mb-2">
            <Button
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {t("aiAutoResponse.buttons.saving")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  {t("aiAutoResponse.buttons.save")}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
