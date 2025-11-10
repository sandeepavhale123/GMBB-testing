import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Eye } from "lucide-react";
import { toast } from "@/hooks/toast/use-toast";
import { FaGoogle, FaFacebook, FaTripadvisor, FaAirbnb } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";
import { cn } from "@/lib/utils";
import { FormField } from "../../types/formBuilder.types";
import { FormBuilderModal } from "../components/FormBuilderModal";

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

export const CreateFeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formName, setFormName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [title, setTitle] = useState("How was your experience with us?");
  const [subtitle, setSubtitle] = useState("We value your feedback and would love to hear from you.");
  const [positiveFeedbackTitle, setPositiveFeedbackTitle] = useState(
    "We'd love to hear from you! Share your experience by leaving us a review."
  );
  const [reviewSiteUrls, setReviewSiteUrls] = useState<Record<string, string>>({});
  const [successTitle, setSuccessTitle] = useState("Thanks, your feedback has been submitted!");
  const [successSubtitle, setSuccessSubtitle] = useState("We really appreciate your comments.");
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "field-name",
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      required: true,
      order: 0,
    },
    {
      id: "field-email",
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      required: true,
      order: 1,
    },
    {
      id: "field-comment",
      type: "textarea",
      label: "Comment",
      name: "comment",
      placeholder: "Enter your comment",
      required: true,
      order: 2,
    },
  ]);

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

  const handleReviewSiteUrlChange = (siteId: string, url: string) => {
    setReviewSiteUrls((prev) => ({
      ...prev,
      [siteId]: url,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    toast({
      title: "Form Created",
      description: "Your feedback form has been created successfully",
    });
    navigate("/module/reputation/v1/dashboard");
  };

  const stepTitles = [
    "Feedback Form Details",
    "Customization Options",
    "Positive Feedback Redirect",
    "Success Message",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{stepTitles[currentStep - 1]}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
              </div>
            </div>

            {/* Step 1: Feedback Form Details */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="text-sm font-medium">
                      Form Name *
                    </Label>
                    <Input
                      id="form-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g., Restaurant Feedback Form"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      This name is for your internal reference only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="text-sm font-medium">
                      Logo
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  {/* Header with title and edit button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Feedback form</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsFormBuilderOpen(true)}
                    >
                      Edit
                    </Button>
                  </div>
                  
                  {/* Form fields preview */}
                  <div className="space-y-3 bg-muted/30 p-4 rounded-md">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {field.label} {field.required && "*"}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea 
                            placeholder={field.placeholder || ""} 
                            disabled 
                            className="bg-background min-h-[80px] resize-none"
                          />
                        ) : (
                          <Input 
                            type={field.type === "text" || field.type === "email" ? field.type : "text"} 
                            placeholder={field.placeholder || ""} 
                            disabled 
                            className="bg-background"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <FormBuilderModal
                  open={isFormBuilderOpen}
                  onOpenChange={setIsFormBuilderOpen}
                  fields={formFields}
                  onSave={setFormFields}
                />

                <Button onClick={handleNext} className="w-full" size="lg">
                  Next
                </Button>
              </>
            )}

            {/* Step 2: Customization Options (same as step 1 for now) */}
            {currentStep === 2 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Review and adjust your form's branding elements
                </p>

                <div className="space-y-2">
                  <Label htmlFor="title-2" className="text-sm font-medium">
                    Form Title
                  </Label>
                  <Textarea
                    id="title-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle-2" className="text-sm font-medium">
                    Form Subtitle
                  </Label>
                  <Textarea
                    id="subtitle-2"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Positive Feedback Redirect */}
            {currentStep === 3 && (
              <>
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

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Review Sites</Label>
                  <div className="space-y-3">
                    {reviewSites.map((site) => {
                      const IconComponent = site.icon;
                      return (
                        <div
                          key={site.id}
                          className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                        >
                          <span style={{ color: site.color }}>
                            <IconComponent className="w-6 h-6" />
                          </span>
                          <span className="text-sm font-medium text-foreground min-w-[100px]">
                            {site.name}
                          </span>
                          <Input
                            placeholder="Enter review URL"
                            value={reviewSiteUrls[site.id] || ""}
                            onChange={(e) => handleReviewSiteUrlChange(site.id, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                    Previous
                  </Button>
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 4: Success Message */}
            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="success-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Textarea
                    id="success-title"
                    value={successTitle}
                    onChange={(e) => setSuccessTitle(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Enter success message title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="success-subtitle" className="text-sm font-medium">
                    Subtitle
                  </Label>
                  <Textarea
                    id="success-subtitle"
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
                  <Button onClick={handleSave} className="flex-1" size="lg">
                    Save
                  </Button>
                  <Button variant="outline" size="lg">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Preview Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6 hidden lg:block">
            <h3 className="text-sm font-medium text-foreground">Preview</h3>

            <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[500px]">
              <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
                {/* Logo Display */}
                <div className="flex justify-center">
                  {logo ? (
                    <img src={logo} alt="Logo Preview" className="h-20 object-contain" />
                  ) : (
                    <div className="bg-muted px-8 py-6 rounded text-center">
                      <span className="text-lg font-bold text-muted-foreground">LOGO</span>
                    </div>
                  )}
                </div>

                {/* Content based on current step */}
                {(currentStep === 1 || currentStep === 2) && (
                  <>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                    </div>
                    {subtitle && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                      </div>
                    )}
                    <div className="space-y-4">
                      <Input placeholder="Enter name" />
                      <Input placeholder="Enter email or phone" />
                      <Textarea placeholder="Your feedback..." className="min-h-[100px]" />
                      <Button className="w-full">Send Feedback</Button>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-lg font-medium text-foreground">{positiveFeedbackTitle}</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                      {reviewSites
                        .filter((site) => reviewSiteUrls[site.id])
                        .map((site) => {
                          const IconComponent = site.icon;
                          return (
                            <button
                              key={site.id}
                              className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium"
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

                {currentStep === 4 && (
                  <div className="text-center space-y-4 py-8">
                    <h2 className="text-2xl font-bold text-foreground">{successTitle}</h2>
                    <p className="text-base text-muted-foreground">{successSubtitle}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
