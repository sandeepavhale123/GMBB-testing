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

interface BulkAISettings {
  tone?: string;
  text_reply?: string;
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
}

export const BulkAIConfigurationManager: React.FC<BulkAIConfigurationManagerProps> = ({
  autoAiSettings,
  onSave,
  isEnabled = false,
  onToggle,
  projectId
}) => {
  const params = useParams();
  const [saveBulkAIAutoReply] = useSaveBulkAIAutoReplyMutation();
  const [responseStyle, setResponseStyle] = useState("professional");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedStarRatings, setSelectedStarRatings] = useState<string[]>(["1_star", "2_star", "3_star", "4_star", "5_star"]);
  const [replyTemplate, setReplyTemplate] = useState(`Hi {full_name},
{responsetext}
Thank you`);
  const [replyToExistingReviews, setReplyToExistingReviews] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [sampleResponse, setSampleResponse] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    }
  }, [autoAiSettings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      const currentProjectId = projectId || parseInt(params.projectId || "1");
      
      // Format reply_text with proper line breaks for API
      const formattedReplyText = replyTemplate.replace(/\n/g, '\r\n');
      
      const response = await saveBulkAIAutoReply({
        projectId: currentProjectId,
        tone: responseStyle,
        reply_text: formattedReplyText,
        specific_star: selectedStarRatings,
        newStatus: 1,
        oldStatus: replyToExistingReviews ? 1 : 0
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
        title: "Success",
        description: `AI Auto Reply settings saved successfully! Updated ${locationCount} location${locationCount !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI Auto Reply settings. Please try again.",
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
      const formattedReplyText = replyTemplate.replace(/\n/g, '\r\n');
      
      const response = await saveBulkAIAutoReply({
        projectId: currentProjectId,
        tone: responseStyle,
        reply_text: formattedReplyText,
        specific_star: selectedStarRatings,
        newStatus: 1,
        oldStatus: replyToExistingReviews ? 1 : 0
      }).unwrap();

      if (onToggle) {
        onToggle(enabled);
      }

      const locationCount = response.data?.ids?.length || 0;
      toast({
        title: "Success",
        description: `AI Auto Reply ${enabled ? "enabled" : "disabled"} successfully! Updated ${locationCount} location${locationCount !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update AI Auto Reply status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleReplyToExisting = async (enabled: boolean) => {
    try {
      const currentProjectId = projectId || parseInt(params.projectId || "1");
      
      // Format reply_text with proper line breaks for API
      const formattedReplyText = replyTemplate.replace(/\n/g, '\r\n');
      
      const response = await saveBulkAIAutoReply({
        projectId: currentProjectId,
        tone: responseStyle,
        reply_text: formattedReplyText,
        specific_star: selectedStarRatings,
        newStatus: 1,
        oldStatus: enabled ? 1 : 0
      }).unwrap();

      setReplyToExistingReviews(enabled);

      const locationCount = response.data?.ids?.length || 0;
      toast({
        title: "Success",
        description: `Reply to existing reviews ${enabled ? "enabled" : "disabled"} successfully! Updated ${locationCount} location${locationCount !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reply to existing reviews setting. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                AI Auto Response
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-600 text-white hover:bg-purple-300 hover:text-black"
                >
                  AI Powered
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Let AI generate personalized, contextual responses based on review
              content and sentiment.
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
              AI Response Style
            </label>
          </div>
          <Select value={responseStyle} onValueChange={setResponseStyle}>
            <SelectTrigger className="bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Choose your response style..." />
            </SelectTrigger>
            <SelectContent className="bg-background border-border/60 shadow-lg">
              <SelectItem value="professional" className="hover:bg-muted/80">
                Professional
              </SelectItem>
              <SelectItem value="friendly" className="hover:bg-muted/80">
                Friendly
              </SelectItem>
              <SelectItem value="casual" className="hover:bg-muted/80">
                Casual
              </SelectItem>
              <SelectItem value="formal" className="hover:bg-muted/80">
                Formal
              </SelectItem>
              <SelectItem value="empathetic" className="hover:bg-muted/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Empathetic
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
          💡 AI will adapt this style to each review's specific content and rating.
        </p>

        

        {/* Advanced Options Toggle */}
        <Card className="bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-foreground">
                Advanced Options
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
                Note:
              </label>
              <p className="text-sm leading-relaxed">
                You can use the following variables in your reply text to
                display the reviewer's name:
                <span className="font-medium text-white">
                  {" "}
                  {"{full_name}"}, {"{first_name}"}, {"{last_name}"}
                </span>
                . To insert the response content, use
                <span className="font-medium text-white">
                  {" "}
                  {"{responsetext}"}
                </span>
                . Don't forget to include it in your template.
              </p>
            </div>

            {/* Reply Text Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <label className="text-sm font-semibold text-foreground">
                  Reply Text
                </label>
              </div>
              <Textarea
                placeholder="Enter your response template..."
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
                  Apply For Star Ratings
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
                          setSelectedStarRatings((prev) => [
                            ...prev,
                            starKey,
                          ]);
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
                Generate Sample AI Response
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Test how AI will respond to a sample review
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
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </div>
              <p className="text-sm text-gray-600">
                "Had an amazing experience! The service was excellent and the staff was very friendly. 
                Everything exceeded my expectations. Will definitely come back again!"
              </p>
            </div>

            <Button
              onClick={() => {
                setIsGeneratingSample(true);
                // Simulate AI response generation
                setTimeout(() => {
                  setSampleResponse(`Hi John Doe,

Thank you so much for taking the time to share your ${responseStyle || 'professional'} experience with us! We're thrilled to hear that you had a great time and that our staff exceeded your expectations.

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
                  Generating Sample Response...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Sample AI Response
                </>
              )}
            </Button>
            
            {sampleResponse && (
              <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-muted-foreground mb-2">AI Generated Response:</p>
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
                Reply to Existing Reviews
              </label>
            </div>
            <Switch
              checked={replyToExistingReviews}
              onCheckedChange={handleToggleReplyToExisting}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enable this to automatically reply to reviews that were posted before enabling AI responses.
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
            Save AI Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};