import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Upload, Check, Info, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FaGoogle, FaFacebook, FaTripadvisor, FaAirbnb } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";

type ReviewSite = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
};

const reviewSites: ReviewSite[] = [
  { id: "google", name: "Google", icon: FaGoogle, color: "#4285F4", textColor: "#fff" },
  { id: "facebook", name: "Facebook", icon: FaFacebook, color: "#1877F2", textColor: "#fff" },
  { id: "tripadvisor", name: "Tripadvisor", icon: FaTripadvisor, color: "#00AF87", textColor: "#fff" },
  { id: "trustpilot", name: "Trustpilot", icon: SiTrustpilot, color: "#00B67A", textColor: "#fff" },
  { id: "airbnb", name: "Airbnb", icon: FaAirbnb, color: "#FF385C", textColor: "#fff" },
];

const ReviewLink: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [title, setTitle] = useState("How would you rate your overall experience with us?");
  const [subtitle, setSubtitle] = useState("Please click below to review your experience.");
  const [positiveFeedbackTitle, setPositiveFeedbackTitle] = useState(
    "We'd love to hear from you! Share your experience by leaving us a review.",
  );
  const [selectedReviewSites, setSelectedReviewSites] = useState<string[]>(["google", "facebook"]);
  const [feedbackFormTitle, setFeedbackFormTitle] = useState(
    "We'd love your private feedback to help us improve. Leave your phone number so we can reach out and resolve any issue if needed.",
  );
  const [namePlaceholder, setNamePlaceholder] = useState("Enter name");
  const [emailPhonePlaceholder, setEmailPhonePlaceholder] = useState("Enter email or phone no.");
  const [commentPlaceholder, setCommentPlaceholder] = useState("Comment");
  const [successTitle, setSuccessTitle] = useState("Thanks, your feedback has been submitted!");
  const [successSubtitle, setSuccessSubtitle] = useState("We really appreciate your comments.");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleReviewSite = (siteId: string) => {
    setSelectedReviewSites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // From Step 1, always go to Step 2
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // From Step 2, go to Step 4 (success)
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // From Step 3, go to Step 4 (success)
      setCurrentStep(4);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 4) {
      // From Step 4, check where we came from based on rating
      if (selectedRating <= 3) {
        // Came from feedback form (Step 3)
        setCurrentStep(3);
      } else {
        // Came from positive feedback (Step 2)
        setCurrentStep(2);
      }
    } else if (currentStep === 3) {
      // From Step 3, go back to Step 1
      setCurrentStep(1);
    } else if (currentStep === 2) {
      // From Step 2, go back to Step 1
      setCurrentStep(1);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Form Section */}
            <div className="bg-card rounded-lg border p-8 space-y-6">
              <h1 className="text-2xl font-bold text-foreground">
                {currentStep === 1 && "Review Link"}
                {currentStep === 2 && "Review Link - Positive Feedback"}
                {currentStep === 3 && "Review Link - Feedback Form"}
                {currentStep === 4 && "Review Link - Success Message"}
              </h1>

              {/* Step 1: Initial Review Request */}
              {currentStep === 1 && (
                <>
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="text-sm font-medium">
                      Logo
                    </Label>
                    <div className="relative">
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {logo ? (
                          <img src={logo} alt="Logo" className="h-full object-contain" />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Logo</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Textarea
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="min-h-[80px] resize-none"
                      placeholder="Enter title..."
                    />
                  </div>

                  {/* Subtitle Input */}
                  <div className="space-y-2">
                    <Label htmlFor="subtitle" className="text-sm font-medium">
                      Subtitle
                    </Label>
                    <Textarea
                      id="subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="min-h-[80px] resize-none"
                      placeholder="Enter subtitle..."
                    />
                  </div>

                  {/* Next Button */}
                  <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                    Next
                  </Button>
                </>
              )}

              {/* Step 2: Positive Feedback */}
              {currentStep === 2 && (
                <>
                  {/* Positive Feedback Title */}
                  <div className="space-y-2">
                    <Label htmlFor="positive-title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Textarea
                      id="positive-title"
                      value={positiveFeedbackTitle}
                      onChange={(e) => setPositiveFeedbackTitle(e.target.value)}
                      className="min-h-[80px] resize-none"
                      placeholder="Enter positive feedback title..."
                    />
                  </div>

                  {/* Review Sites Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Review Sites</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reviewSites.map((site) => {
                        const IconComponent = site.icon;
                        const isSelected = selectedReviewSites.includes(site.id);
                        return (
                          <button
                            key={site.id}
                            onClick={() => toggleReviewSite(site.id)}
                            className={cn(
                              "relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-border bg-background hover:bg-muted/50",
                            )}
                          >
                            <span style={{ color: site.color }}>
                              <IconComponent className="w-6 h-6" />
                            </span>
                            <span className="text-sm font-medium text-foreground">{site.name}</span>
                            {isSelected && <Check className="w-5 h-5 text-blue-600 absolute top-2 right-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                      Previous
                    </Button>
                    <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                      Next
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Feedback Form Configuration */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="feedbackFormTitle" className="text-sm font-medium">
                      Title
                    </Label>
                    <Textarea
                      id="feedbackFormTitle"
                      value={feedbackFormTitle}
                      onChange={(e) => setFeedbackFormTitle(e.target.value)}
                      className="min-h-[100px] resize-none"
                      placeholder="Enter feedback form title"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Form</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit the form field placeholders below to customize how they appear in your review form</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                      <div className="space-y-2">
                        <Label className="text-sm">Name field</Label>
                        <Input
                          value={namePlaceholder}
                          onChange={(e) => setNamePlaceholder(e.target.value)}
                          placeholder="Enter name placeholder"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Email/Phone field</Label>
                        <Input
                          value={emailPhonePlaceholder}
                          onChange={(e) => setEmailPhonePlaceholder(e.target.value)}
                          placeholder="Enter email/phone placeholder"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Comment field</Label>
                        <Textarea
                          value={commentPlaceholder}
                          onChange={(e) => setCommentPlaceholder(e.target.value)}
                          placeholder="Enter comment placeholder"
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                      Previous
                    </Button>
                    <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                      Next
                    </Button>
                  </div>
                </>
              )}

              {/* Step 4: Success Message Configuration */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="successTitle" className="text-sm font-medium">
                      Title
                    </Label>
                    <Textarea
                      id="successTitle"
                      value={successTitle}
                      onChange={(e) => setSuccessTitle(e.target.value)}
                      className="min-h-[80px] resize-none"
                      placeholder="Enter success message title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="successSubtitle" className="text-sm font-medium">
                      Sub title
                    </Label>
                    <Textarea
                      id="successSubtitle"
                      value={successSubtitle}
                      onChange={(e) => setSuccessSubtitle(e.target.value)}
                      className="min-h-[60px] resize-none"
                      placeholder="Enter success message subtitle"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                      Previous
                    </Button>
                    <Button
                      onClick={() => navigate(`/review-feedback?rating=${selectedRating}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      Save
                    </Button>

                    <Button
                      onClick={() => navigate(`/review-feedback?rating=${selectedRating}`)}
                      className=""
                      variant="outline"
                      size="lg"
                    >
                      Preview
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Right Panel - Preview Section */}
            <div className="bg-card rounded-lg border p-8 space-y-6 hidden lg:block">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/review-feedback?rating=${selectedRating}`)}
                  title="View Public Page"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
                  {/* Logo Display */}
                  <div className="flex justify-center">
                    {logo ? (
                      <img src={logo} alt="Logo Preview" className="h-20 object-contain" />
                    ) : (
                      <div className="bg-yellow-400 px-8 py-6 rounded text-center">
                        <span className="text-lg font-bold text-black">LOGO</span>
                      </div>
                    )}
                  </div>

                  {/* Step 1 Preview */}
                  {currentStep === 1 && (
                    <>
                      {/* Title Display */}
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                      </div>

                      {/* Subtitle Display */}
                      {subtitle && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{subtitle}</p>
                        </div>
                      )}

                      {/* Star Rating */}
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-8 h-8 cursor-pointer transition-all hover:scale-110",
                              selectedRating >= star ? "text-orange-400 fill-orange-400" : "text-gray-300",
                            )}
                            strokeWidth={1.5}
                            onClick={() => setSelectedRating(star)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Step 2 Preview */}
                  {currentStep === 2 && (
                    <>
                      {/* Positive Feedback Title */}
                      <div className="text-center">
                        <h2 className="text-lg font-medium text-foreground">{positiveFeedbackTitle}</h2>
                      </div>

                      {/* Selected Review Site Buttons */}
                      <div className="flex flex-col gap-3">
                        {reviewSites
                          .filter((site) => selectedReviewSites.includes(site.id))
                          .map((site) => {
                            const IconComponent = site.icon;
                            return (
                              <button
                                key={site.id}
                                className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
                                style={{
                                  backgroundColor: site.color,
                                  color: site.textColor,
                                }}
                              >
                                <IconComponent className="w-5 h-5" />
                                <span>Review on {site.name}</span>
                              </button>
                            );
                          })}
                      </div>
                    </>
                  )}

                  {/* Step 3 Preview - Feedback Form */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground px-2">{feedbackFormTitle}</p>
                      </div>

                      <div className="space-y-4">
                        <Input placeholder={namePlaceholder} className="w-full" />
                        <Input placeholder={emailPhonePlaceholder} className="w-full" />
                        <Textarea placeholder={commentPlaceholder} className="w-full min-h-[100px] resize-none" />

                        <div className="flex gap-3 pt-2">
                          <Button variant="outline" className="flex-1">
                            Clear
                          </Button>
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Send</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Preview - Success Message */}
                  {currentStep === 4 && (
                    <div className="text-center space-y-4 py-8">
                      <h2 className="text-2xl font-bold text-foreground">{successTitle}</h2>

                      <p className="text-base text-muted-foreground">{successSubtitle}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center pt-4 border-t">
                    <p className="text-xs text-muted-foreground">Powered by My Agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ReviewLink;
