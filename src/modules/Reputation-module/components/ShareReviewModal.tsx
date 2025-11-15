import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Share2,
  X,
  Loader2,
  Eye,
  ChevronLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  captureSquareImage,
  downloadImageBlob,
} from "@/utils/socialMediaImageCapture";
import { cn } from "@/lib/utils";

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
  const authorInitial =
    authorName && authorName.length > 0
      ? authorName.charAt(0).toUpperCase()
      : "A";

  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "google",
  ]);
  const [themeColor, setThemeColor] = useState("#dbd7cf");
  const [description, setDescription] = useState(reviewContent);
  const [postDescription, setPostDescription] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setIsCapturing(true);

    try {
      // Capture the canvas as square image
      if (canvasRef.current) {
        const imageBlob = await captureSquareImage(canvasRef.current, {
          size: 600,
          format: "png",
          quality: 1.0,
          backgroundColor: "#ffffff",
          pixelRatio: 2,
        });

        // Download the image locally
        const fileName = `review-post-${authorName.replace(
          /\s+/g,
          "-"
        )}-${Date.now()}.png`;
        downloadImageBlob(imageBlob, fileName);

        toast({
          title: "Image Downloaded",
          description: "Your review post image has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Image Capture Failed",
        description: "Failed to create post image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
      onClose();
    }
  };

  const svgCode = `<svg width="646" height="646" viewBox="0 0 646 646" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_299_122)">
<rect width="646" height="646" fill="white"/>
<mask id="path-1-inside-1_299_122" fill="white">
<path d="M369.329 -492.573L852.152 59.696L16.2066 808.439L-625 107.793C-625 107.793 -347.765 146.213 -223.672 25.8595C-99.578 -94.4943 -182.28 -279.256 -27.9378 -414.191C126.405 -549.125 369.329 -492.573 369.329 -492.573Z"/>
</mask>
<path d="M369.329 -492.573L852.152 59.696L16.2066 808.439L-625 107.793C-625 107.793 -347.765 146.213 -223.672 25.8595C-99.578 -94.4943 -182.28 -279.256 -27.9378 -414.191C126.405 -549.125 369.329 -492.573 369.329 -492.573Z" fill="url(#paint0_linear_299_122)"/>
<path d="M369.705 -492.902C369.454 -492.683 369.203 -492.464 368.953 -492.244C414.356 -440.338 459.758 -388.432 505.161 -336.526C620.746 -204.383 736.328 -72.238 851.908 59.9094L851.936 59.4546C573.341 309.095 294.736 558.725 16.1208 808.344L16.3014 808.352C-197.466 574.832 -411.225 341.305 -624.976 107.771L-625.005 107.825C-488.477 120.266 -332.032 120.977 -223.665 25.8668C-100.533 -94.9491 -170.369 -305.536 -27.9378 -414.191C-16.4337 -424.246 -4.34636 -433.333 8.43028 -441.61C55.0101 -471.829 108.91 -489.53 163.571 -497.881C231.761 -508.056 301.821 -505.761 369.216 -492.086C369.291 -492.411 369.367 -492.736 369.442 -493.06C301.791 -506.408 231.747 -508.415 163.541 -498.077C108.878 -489.591 55.0092 -471.827 8.43028 -441.61C-4.34636 -433.333 -16.4337 -424.246 -27.9378 -414.191C-170.368 -305.54 -100.547 -94.942 -223.679 25.8522C-332.041 120.945 -488.483 120.219 -624.996 107.761L-625.085 107.748L-625.024 107.815C-411.304 341.378 -197.592 574.948 16.1117 808.526L16.1976 808.62L16.2923 808.535C294.974 558.991 573.666 309.459 852.368 59.9375L852.607 59.7237L852.396 59.4827C736.873 -72.714 621.352 -204.913 505.833 -337.114C460.457 -389.043 415.081 -440.972 369.705 -492.902ZM368.953 -492.244L369.705 -492.902L369.599 -493.024L369.442 -493.06L369.216 -492.086L368.953 -492.244Z" fill="black" mask="url(#path-1-inside-1_299_122)"/>
<mask id="path-3-inside-2_299_122" fill="white">
<path d="M-132.81 774.038L251.934 1238.99L1147.93 511.98L667.012 -104C667.012 -104 632.583 150.227 491.141 257.729C349.7 365.231 201.185 281.464 38.7867 415.845C-123.612 550.227 -132.81 774.038 -132.81 774.038Z"/>
</mask>
<path d="M-132.81 774.038L251.934 1238.99L1147.93 511.98L667.012 -104C667.012 -104 632.583 150.227 491.141 257.729C349.7 365.231 201.185 281.464 38.7867 415.845C-123.612 550.227 -132.81 774.038 -132.81 774.038Z" fill="url(#paint1_linear_299_122)"/>
<path d="M-133.196 774.356C-132.939 774.144 -132.682 773.931 -132.425 773.719C-91.5947 823.091 -50.7639 872.462 -9.93276 921.833C77.4422 1027.48 164.819 1133.13 252.197 1238.78L251.718 1238.73C550.439 996.462 849.149 754.18 1147.85 511.884L1147.83 512.056C987.552 306.707 827.271 101.363 666.982 -103.977L667.049 -103.995C643.323 28.7903 599.407 170.092 491.149 257.738C358.177 361.832 163.391 294.834 38.7868 415.846C23.1013 428.823 8.46473 442.96 -5.06496 458.065C-39.4669 496.435 -66.5733 541.096 -86.804 588.322C-111.837 647.268 -127.782 710.365 -132.311 774.058C-132.644 774.044 -132.977 774.031 -133.31 774.017C-128.397 710.156 -112.18 647.161 -86.9864 588.244C-66.6261 541.053 -39.4662 496.435 -5.06496 458.065C8.46473 442.96 23.1013 428.823 38.7866 415.845C163.387 294.834 358.185 361.817 491.134 257.719C599.374 170.073 643.272 28.7686 666.975 -104.005L666.987 -104.093L667.042 -104.023C827.362 101.291 987.689 306.6 1148.02 511.904L1148.1 512L1148 512.076C849.374 754.457 550.756 996.852 252.149 1239.26L251.886 1239.47L251.67 1239.21C164.241 1133.61 76.8112 1028 -10.6208 922.402C-51.4787 873.053 -92.3369 823.705 -133.196 774.356ZM-132.425 773.719L-133.196 774.356L-133.318 774.208L-133.31 774.017L-132.311 774.058L-132.425 773.719Z" fill="black" mask="url(#path-3-inside-2_299_122)"/>
<mask id="path-5-inside-3_299_122" fill="white">
<path d="M-5.81034 1049.43L378.934 1514.39L1168.68 875.289L685.722 260.999C685.722 260.999 668.66 500.854 543.564 594.831C418.468 688.807 275.572 600.39 132.584 718.71C-10.4034 837.03 -5.81034 1049.43 -5.81034 1049.43Z"/>
</mask>
<path d="M-5.81034 1049.43L378.934 1514.39L1168.68 875.289L685.722 260.999C685.722 260.999 668.66 500.854 543.564 594.831C418.468 688.807 275.572 600.39 132.584 718.71C-10.4034 837.03 -5.81034 1049.43 -5.81034 1049.43Z" fill="url(#paint2_linear_299_122)"/>
<path d="M-6.19556 1049.75C-5.93875 1049.53 -5.68194 1049.32 -5.42513 1049.11C32.598 1095.09 70.6215 1141.07 108.645 1187.05C198.825 1296.09 289.006 1405.13 379.189 1514.17L378.725 1514.13C642.026 1301.16 905.317 1088.18 1168.6 875.19L1168.58 875.367C1007.62 670.579 846.663 465.797 685.694 261.02L685.756 261.002C671.713 381.806 641.811 514.678 543.571 594.84C421.904 687.087 246.447 609.324 132.585 718.71C120.538 728.682 109.404 739.412 98.9688 751.021C66.8781 786.679 43.0259 829.394 26.4633 874.27C5.995 930.276 -4.87716 989.953 -5.31046 1049.42C-5.64371 1049.42 -5.97697 1049.43 -6.31022 1049.44C-5.50416 989.786 5.6463 930.188 26.2771 874.201C42.9718 829.351 66.8791 786.679 98.9688 751.021C109.404 739.412 120.538 728.681 132.584 718.71C246.443 609.324 421.913 687.074 543.557 594.822C641.78 514.662 671.666 381.789 685.687 260.997L685.694 260.907L685.749 260.978C846.751 465.728 1007.76 670.472 1168.78 875.21L1168.85 875.308L1168.76 875.387C905.542 1088.46 642.337 1301.55 379.142 1514.64L378.887 1514.85L378.678 1514.6C288.44 1405.6 198.2 1296.61 107.957 1187.62C69.9067 1141.66 31.8558 1095.7 -6.19556 1049.75ZM-5.42513 1049.11L-6.19556 1049.75L-6.30702 1049.61L-6.31022 1049.44L-5.31046 1049.42L-5.42513 1049.11Z" fill="black" mask="url(#path-5-inside-3_299_122)"/>
</g>
<defs>
<linearGradient id="paint0_linear_299_122" x1="-138.174" y1="-167.33" x2="476.134" y2="535.336" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="0.887175" stop-color="${themeColor}"/>
</linearGradient>
<linearGradient id="paint1_linear_299_122" x1="303.671" y1="340.689" x2="396.453" y2="458.092" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="${themeColor}"/>
</linearGradient>
<linearGradient id="paint2_linear_299_122" x1="374.264" y1="662.755" x2="466.681" y2="780.432" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="${themeColor}"/>
</linearGradient>
<clipPath id="clip0_299_122">
<rect width="646" height="646" fill="white"/>
</clipPath>
</defs>
</svg>
`;

  const postBackground = `data:image/svg+xml;utf8,${encodeURIComponent(
    svgCode
  )}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[56rem] h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden p-0">
        <div className="relative h-full overflow-hidden md:grid md:grid-cols-[40%_60%]">
          {/* Left Panel - Form Controls */}
          <div
            className={cn(
              "p-6 pr-6 overflow-y-auto",
              "absolute inset-0 transition-transform duration-300 ease-in-out bg-background",
              showPreview ? "-translate-x-full" : "translate-x-0",
              "md:relative md:translate-x-0 md:border-r md:border-border"
            )}
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold">
                Share Review
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Channel Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Select the channels
                </Label>
                <div className="flex gap-3">
                  <div className="flex items-center space-x-3 border-2 border-dashed border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 flex-1">
                    <Checkbox
                      id="google"
                      checked={selectedChannels.includes("google")}
                      onCheckedChange={(checked) => {
                        setSelectedChannels((prev) =>
                          checked
                            ? [...prev, "google"]
                            : prev.filter((c) => c !== "google")
                        );
                      }}
                    />
                    <Label
                      htmlFor="google"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <img
                        src="/lovable-uploads/social-icons/google.png"
                        alt="Google"
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium">Google</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border-2 border-dashed border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 flex-1">
                    <Checkbox
                      id="facebook"
                      checked={selectedChannels.includes("facebook")}
                      onCheckedChange={(checked) => {
                        setSelectedChannels((prev) =>
                          checked
                            ? [...prev, "facebook"]
                            : prev.filter((c) => c !== "facebook")
                        );
                      }}
                    />
                    <Label
                      htmlFor="facebook"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <img
                        src="/lovable-uploads/social-icons/facebook.png"
                        alt="Facebook"
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium">Facebook</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Theme Color */}
              <div className="space-y-2">
                <Label
                  htmlFor="themeColor"
                  className="text-sm font-semibold text-foreground"
                >
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
                  <span className="text-sm text-muted-foreground">
                    {themeColor}
                  </span>
                </div>
              </div>

              {/* Post Caption */}
              <div className="space-y-2">
                <Label
                  htmlFor="postDescription"
                  className="text-sm font-semibold text-foreground"
                >
                  Post Caption (optional)
                </Label>
                <Textarea
                  id="postDescription"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Add a caption for your post... (e.g., 'Check out this amazing review!')"
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Schedule Post */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="schedule"
                    className="text-sm font-semibold text-foreground"
                  >
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
                      <Label
                        htmlFor="scheduleDate"
                        className="text-xs text-muted-foreground"
                      >
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
                      <Label
                        htmlFor="scheduleTime"
                        className="text-xs text-muted-foreground"
                      >
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
                <Button
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                  className="md:hidden flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isCapturing}
                  className="flex-1"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Capturing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  disabled={isCapturing}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div
            className={cn(
              "p-2 md:p-6 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 overflow-y-auto",
              "absolute inset-0 transition-transform duration-300 ease-in-out",
              showPreview ? "translate-x-0" : "translate-x-full",
              "md:relative md:translate-x-0",
              "flex flex-col items-center gap-4"
            )}
          >
            {/* Mobile back button */}
            <button
              onClick={() => setShowPreview(false)}
              className="md:hidden self-start p-1.5 rounded-full bg-background/80 hover:bg-background shadow-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Desktop close button */}
            <button
              onClick={onClose}
              className="hidden md:block self-end p-1.5 rounded-full bg-background/80 hover:bg-background shadow-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-w-sm mx-auto scale-[0.85] md:scale-100 origin-top transition-transform">
              {/* Preview Card */}
              <div className="bg-background  rounded-2xl shadow-2xl w-[380px]">
                {/* canvas  */}
                <div
                  ref={canvasRef}
                  className="px-8 py-4 mx-auto"
                  style={{
                    backgroundImage: `url("${postBackground}")`,
                    backgroundSize: "cover",
                    height: "380px",
                    width: "380px",
                  }}
                >
                  {/* Avatar & Author */}
                  <div className="flex flex-col items-center bg-white p-3 rounded-t-lg mt-[50px] ">
                    <Avatar className="w-24 h-24 border-[5px] border-border border-white mt-[-55px] mb-1">
                      <AvatarImage
                        //  src={reviewAvatar}
                        src="/lovable-uploads/avatar-01.jpg"
                        alt="user-profile"
                      />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                        {authorInitial}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold mb-1 text-foreground">
                      {authorName}
                    </h3>
                    {/* Review Text */}
                    <p className="text-sm text-muted-foreground text-center leading-[1.5]">
                      {reviewContent.length > 200
                        ? `${reviewContent.slice(0, 200)}...`
                        : reviewContent}
                    </p>
                  </div>

                  {/* Rating Section */}
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-b-lg py-2 px-6 mb-3">
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

                  {/* Review Source Icon */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
                      {(() => {
                        const getPlatformIcon = (platform: string): string => {
                          const platformLower = platform.toLowerCase();

                          if (platformLower.includes("google"))
                            return "/lovable-uploads/social-icons/google.png";
                          if (platformLower.includes("facebook"))
                            return "/lovable-uploads/social-icons/facebook.png";
                          if (platformLower.includes("yelp"))
                            return "/lovable-uploads/social-icons/yelp.png";
                          if (platformLower.includes("foursquare"))
                            return "/lovable-uploads/social-icons/foursquare.png";
                          if (
                            platformLower.includes("airbnb") ||
                            platformLower.includes("air-bnb")
                          )
                            return "/lovable-uploads/social-icons/air-bnb.png";
                          if (platformLower.includes("tripadvisor"))
                            return "/lovable-uploads/social-icons/tripadvisor.png";
                          if (platformLower.includes("trustpilot"))
                            return "/lovable-uploads/social-icons/trustpilot.png";
                          if (platformLower.includes("yellow"))
                            return "/lovable-uploads/social-icons/yellowPage.png";
                          if (platformLower.includes("opentable"))
                            return "/lovable-uploads/social-icons/OpenTable.png";

                          return "/lovable-uploads/social-icons/google.png"; // Default fallback
                        };

                        const platform =
                          review.platform || review.channel || "";
                        const iconSrc = getPlatformIcon(platform);

                        return (
                          <img
                            src={iconSrc}
                            alt={platform}
                            className="w-6 h-6 object-contain"
                          />
                        );
                      })()}
                    </div>
                  </div>
                </div>
                {/* canvas  */}

                {/* Action Buttons */}
                <div className="flex items-center justify-around pt-4 border-t border-border p-4">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-medium">Like</span>
                  </button>

                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <span className="text-xs font-medium">Comment</span>
                  </button>

                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-5 h-5 text-blue-500" />
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
