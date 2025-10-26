import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare, Share2, X } from "lucide-react";

interface ShareReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    customer_name?: string;
    author?: string;
    rating: number;
    comment?: string;
    content?: string;
    platform?: string;
    channel?: string;
    date: string;
    profile_image_url?: string;
    avatar?: string;
  };
}

export const ShareReviewModal: React.FC<ShareReviewModalProps> = ({
  isOpen,
  onClose,
  review,
}) => {
  // Handle both old and new review formats
  const authorName = review.customer_name || review.author || "Anonymous";
  const reviewContent = review.comment || review.content || "";
  const reviewAvatar = review.profile_image_url || review.avatar;
  const authorInitial = authorName && authorName.length > 0 ? authorName.charAt(0).toUpperCase() : "A";
  
  const [selectedChannels, setSelectedChannels] = useState<string>("google");
  const [themeColor, setThemeColor] = useState("#6b7280");
  const [description, setDescription] = useState(reviewContent);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const handleSubmit = () => {
    // TODO: API call to create social media post
    console.log("Submitting post:", {
      channels: selectedChannels,
      themeColor,
      description,
      scheduleEnabled,
      scheduleDate,
      scheduleTime,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] h-full max-h-[85vh]">
          {/* Left Panel - Form Controls */}
          <div className="p-6 pr-6 border-r border-border overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold">Share Review</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Channel Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Select the channels
                </Label>
                <RadioGroup
                  value={selectedChannels}
                  onValueChange={setSelectedChannels}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border-2 border-dashed border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="google" id="google" />
                    <Label htmlFor="google" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        G
                      </div>
                      <span className="text-sm font-medium">Google</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border-2 border-dashed border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="facebook" id="facebook" />
                    <Label htmlFor="facebook" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        f
                      </div>
                      <span className="text-sm font-medium">Facebook</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Theme Color */}
              <div className="space-y-2">
                <Label htmlFor="themeColor" className="text-sm font-semibold text-foreground">
                  Theme color
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="themeColor"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{themeColor}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter post description..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Schedule Post */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="schedule" className="text-sm font-semibold text-foreground">
                    Schedule the Post (optional)
                  </Label>
                  <Switch
                    id="schedule"
                    checked={scheduleEnabled}
                    onCheckedChange={setScheduleEnabled}
                  />
                </div>

                {scheduleEnabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="scheduleDate" className="text-xs text-muted-foreground">
                        Date
                      </Label>
                      <input
                        type="date"
                        id="scheduleDate"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="scheduleTime" className="text-xs text-muted-foreground">
                        Time
                      </Label>
                      <input
                        type="time"
                        id="scheduleTime"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  Submit
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background shadow-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-w-sm mx-auto">
              {/* Preview Card */}
              <div className="bg-background rounded-2xl shadow-2xl p-6 space-y-6">
                {/* Avatar & Author */}
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 border-4 border-border">
                    <AvatarImage src={reviewAvatar} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                      {authorInitial}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mt-3 text-foreground">
                    {authorName}
                  </h3>
                </div>

                {/* Review Text */}
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {description.length > 200 ? `${description.slice(0, 200)}...` : description}
                </p>

                {/* Rating Section */}
                <div className="bg-gray-900 dark:bg-gray-950 rounded-lg py-4 px-6">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Channel Logo */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
                    {selectedChannels === "google" ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        G
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        f
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-around pt-4 border-t border-border">
                  <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <ThumbsUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">Like</span>
                  </button>

                  <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">Comment</span>
                  </button>

                  <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
