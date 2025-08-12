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
}

export const BulkAIConfigurationManager: React.FC<BulkAIConfigurationManagerProps> = ({
  autoAiSettings,
  onSave,
  isEnabled = false,
  onToggle
}) => {
  const [responseStyle, setResponseStyle] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedStarRatings, setSelectedStarRatings] = useState<string[]>([]);
  const [replyTemplate, setReplyTemplate] = useState(`Hi {full_name},
{responsetext}
Thank you`);
  const [replyToExistingReviews, setReplyToExistingReviews] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sampleResponse, setSampleResponse] = useState("");

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

  const handleSaveSettings = () => {
    setIsSaving(true);

    const payload = {
      tone: responseStyle,
      text_reply: replyTemplate,
      specific_star: selectedStarRatings,
      oldStatus: replyToExistingReviews ? "1" : "0",
      prompt: additionalInstructions,
    };

    // Call the onSave callback if provided
    if (onSave) {
      onSave(payload);
    }

    // TODO: Implement actual API call for bulk project AI settings
    setTimeout(() => {
      toast({
        title: "Success",
        description: "AI Auto Reply settings saved successfully!",
      });
      setIsSaving(false);
    }, 1000);
  };

  const handleGenerateSample = () => {
    setIsGenerating(true);
    
    // Mock sample response generation based on selected tone
    setTimeout(() => {
      const sampleResponses = {
        professional: "Thank you for taking the time to share your feedback. We value your input and are committed to delivering exceptional service. We appreciate your business and look forward to serving you again.",
        friendly: "Hi there! Thanks so much for your review! We're thrilled to hear about your experience and really appreciate you taking the time to share. Looking forward to seeing you again soon!",
        casual: "Hey! Thanks for the review! We're super happy you had a great time. Catch you next time!",
        formal: "We extend our sincere gratitude for your comprehensive feedback. Your valued opinion assists us in maintaining our commitment to excellence. We look forward to your continued patronage.",
        empathetic: "Thank you for sharing your experience with us. We truly understand how important this is to you, and we're grateful for your trust in our services. Your feedback helps us grow and serve you better."
      };
      
      setSampleResponse(sampleResponses[responseStyle as keyof typeof sampleResponses] || "Please select a response style to generate a sample.");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <CardTitle className="text-base font-medium text-gray-900">
                  AI Auto Response
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-purple-600 text-white hover:bg-purple-300 hover:text-black"
                >
                  AI Powered
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Let AI generate personalized, contextual responses based on review
                content and sentiment.
              </p>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
      </CardHeader>

      {/* Configuration Panel */}
      {isEnabled && (
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
                    className={`p-3 cursor-pointer border-border/60 ${
                      isChecked ? "border-primary bg-primary/10" : ""
                    }`}
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
                onCheckedChange={setReplyToExistingReviews}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enable this to automatically reply to reviews that were posted before enabling AI responses.
            </p>
          </Card>

          {/* Generate Sample AI Response */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <label className="text-sm font-semibold text-foreground">
                Generate Sample AI Response
              </label>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleGenerateSample}
                disabled={isGenerating || !responseStyle}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                <Sparkles className="h-4 w-4" />
                Generate Sample
              </Button>
            </div>
            {sampleResponse && (
              <Card className="p-4 bg-purple-50 border-purple-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {sampleResponse}
                </p>
              </Card>
            )}
          </div>

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
      )}
    </Card>
  );
};