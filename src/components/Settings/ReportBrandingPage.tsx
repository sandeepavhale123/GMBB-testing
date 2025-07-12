import React, { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Upload,
  Building,
  X,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetReportBranding,
  useUpdateReportBranding,
  useDeleteReportBranding,
} from "@/hooks/useReportBranding";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  reportBrandingSchema,
  type ReportBrandingFormData,
} from "@/schemas/authSchemas";
import { useFormValidation } from "@/hooks/useFormValidation";

export const ReportBrandingPage: React.FC = () => {
  const { toast } = useToast();

  // API hooks
  const { data: brandingData, isLoading: isFetchingBranding } =
    useGetReportBranding();
  const updateBrandingMutation = useUpdateReportBranding();
  const deleteBrandingMutation = useDeleteReportBranding();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<ReportBrandingFormData>({
    companyName: "",
    companyEmail: "",
    companyWebsite: "",
    companyPhone: "",
    companyAddress: "",
  });
  const validation = useFormValidation(reportBrandingSchema);
  // Load existing branding data when available
  useEffect(() => {
    if (brandingData?.data) {
      const data = brandingData.data;
      setFormData({
        companyName: data.company_name || "",
        companyEmail: data.company_email || "",
        companyWebsite: data.company_website || "",
        companyPhone: data.company_phone || "",
        companyAddress: data.company_address || "",
      });
    }
  }, [brandingData]);

  const handleInputChange = (
    field: keyof ReportBrandingFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo file must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, SVG)",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    toast({
      title: "Report logo uploaded",
      description: `${file.name} ready for use`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeLogo = () => {
    setLogoFile(null);
    toast({
      title: "Report logo removed",
      description: "Logo has been removed successfully",
    });
  };

  const handleSaveChanges = async () => {
    const validationResult = validation.validate(formData);
    if (!validationResult.isValid) {
      toast({
        title: "Error",
        description: "Please fix the validation errors",
        variant: "destructive",
      });
      return;
    }
    try {
      // Prepare the payload with correct field names for the API
      const payload = {
        company_name: validationResult.data!.companyName,
        company_email: validationResult.data!.companyEmail,
        company_website: validationResult.data!.companyWebsite,
        company_phone: validationResult.data!.companyPhone,
        company_address: validationResult.data!.companyAddress,
        ...(logoFile && { company_logo: logoFile }),
      };

      // Console logging for debugging
      console.log("Form data being submitted:", payload);
      console.log("Logo file:", logoFile);
      console.log("Original form state:", formData);

      await updateBrandingMutation.mutateAsync(payload);
      validation.clearErrors();
      // Clear the logo file after successful save
      setLogoFile(null);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteBranding = async () => {
    try {
      await deleteBrandingMutation.mutateAsync();
      setShowDeleteDialog(false);

      // Reset form data after successful deletion
      setFormData({
        companyName: "",
        companyEmail: "",
        companyWebsite: "",
        companyPhone: "",
        companyAddress: "",
      });
      setLogoFile(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Report Branding
          </h1>
          <p className="text-muted-foreground">
            Customize your company branding for generated reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          {brandingData?.data && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/5"
              disabled={deleteBrandingMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Branding
            </Button>
          )}
          <Badge variant="outline" className="text-primary border-primary/20">
            White Label
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5" />
                  Company Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="company-name"
                        className="text-sm font-medium"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="company-name"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={(e) => {
                          handleInputChange("companyName", e.target.value);
                          if (validation.hasFieldError("companyName")) {
                            validation.clearFieldError("companyName");
                          }
                        }}
                        className={
                          validation.hasFieldError("companyName")
                            ? "border-destructive"
                            : ""
                        }
                        disabled={updateBrandingMutation.isPending}
                      />
                      {validation.hasFieldError("companyName") && (
                        <p className="text-xs text-destructive">
                          {validation.getFieldError("companyName")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company-email"
                        className="text-sm font-medium"
                      >
                        Company Email
                      </Label>
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="company@example.com"
                        value={formData.companyEmail}
                        onChange={(e) => {
                          handleInputChange("companyEmail", e.target.value);
                          if (validation.hasFieldError("companyEmail")) {
                            validation.clearFieldError("companyEmail");
                          }
                        }}
                        className={
                          validation.hasFieldError("companyEmail")
                            ? "border-destructive"
                            : ""
                        }
                        disabled={updateBrandingMutation.isPending}
                      />
                      {validation.hasFieldError("companyEmail") && (
                        <p className="text-xs text-destructive">
                          {validation.getFieldError("companyEmail")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company-website"
                        className="text-sm font-medium"
                      >
                        Company Website
                      </Label>
                      <Input
                        id="company-website"
                        placeholder="https://www.company.com"
                        value={formData.companyWebsite}
                        onChange={(e) => {
                          handleInputChange("companyWebsite", e.target.value);
                          if (validation.hasFieldError("companyWebsite")) {
                            validation.clearFieldError("companyWebsite");
                          }
                        }}
                        className={
                          validation.hasFieldError("companyWebsite")
                            ? "border-destructive"
                            : ""
                        }
                        disabled={updateBrandingMutation.isPending}
                      />
                      {validation.hasFieldError("companyWebsite") && (
                        <p className="text-xs text-destructive">
                          {validation.getFieldError("companyWebsite")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company-phone"
                        className="text-sm font-medium"
                      >
                        Company Phone
                      </Label>
                      <Input
                        id="company-phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.companyPhone}
                        onChange={(e) => {
                          handleInputChange("companyPhone", e.target.value);
                          if (validation.hasFieldError("companyPhone")) {
                            validation.clearFieldError("companyPhone");
                          }
                        }}
                        className={
                          validation.hasFieldError("companyPhone")
                            ? "border-destructive"
                            : ""
                        }
                        disabled={updateBrandingMutation.isPending}
                      />
                      {validation.hasFieldError("companyPhone") && (
                        <p className="text-xs text-destructive">
                          {validation.getFieldError("companyPhone")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company-address"
                        className="text-sm font-medium"
                      >
                        Company Address
                      </Label>
                      <Input
                        id="company-address"
                        placeholder="123 Business St, City, State 12345"
                        value={formData.companyAddress}
                        onChange={(e) => {
                          handleInputChange("companyAddress", e.target.value);
                          if (validation.hasFieldError("companyAddress")) {
                            validation.clearFieldError("companyAddress");
                          }
                        }}
                        className={
                          validation.hasFieldError("companyAddress")
                            ? "border-destructive"
                            : ""
                        }
                        disabled={updateBrandingMutation.isPending}
                      />
                      {validation.hasFieldError("companyAddress") && (
                        <p className="text-xs text-destructive">
                          {validation.getFieldError("companyAddress")}
                        </p>
                      )}
                    </div>

                    {/* Logo Upload Section */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Company Logo
                        </Label>
                        {logoFile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeLogo}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            disabled={updateBrandingMutation.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        <div
                          className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                            dragOver
                              ? "border-primary bg-primary/5"
                              : "border-border bg-muted/50"
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          {logoFile ? (
                            <img
                              src={URL.createObjectURL(logoFile)}
                              alt="Report logo preview"
                              className="w-full h-full object-contain rounded p-1"
                            />
                          ) : brandingData?.data?.company_logo ? (
                            <img
                              src={brandingData.data.company_logo}
                              alt="Current company logo"
                              className="w-full h-full object-contain rounded p-1"
                            />
                          ) : (
                            <Building className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-3">
                            PNG, JPG, SVG up to 2MB. Recommended: 200x80px
                          </p>

                          <input
                            id="report-logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById("report-logo-upload")
                                ?.click()
                            }
                            className="w-full"
                            disabled={updateBrandingMutation.isPending}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Logo
                          </Button>

                          {logoFile && (
                            <div className="text-sm text-muted-foreground mt-2">
                              <div className="flex items-center justify-between">
                                <span className="truncate mr-2">
                                  Selected: {logoFile.name}
                                </span>
                                <span className="text-xs text-green-600">
                                  ✓ Ready
                                </span>
                              </div>
                            </div>
                          )}

                          {brandingData?.data?.company_logo && !logoFile && (
                            <div className="text-sm text-muted-foreground mt-2">
                              <span className="text-xs text-blue-600">
                                ✓ Current logo uploaded
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {dragOver && (
                        <div className="text-center p-2 bg-primary/5 border border-primary/20 rounded">
                          <p className="text-sm text-primary">
                            Drop logo here to upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveChanges}
                  disabled={
                    updateBrandingMutation.isPending || isFetchingBranding
                  }
                  className="min-w-[120px]"
                >
                  {updateBrandingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column - Report Preview */}
            <div className="bg-muted/30 rounded-lg p-6 min-h-[600px] flex flex-col">
              <h3 className="text-lg font-semibold mb-6">Report Preview</h3>

              <div className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md">
                  <CardContent className="p-6 space-y-6">
                    {/* Report Header */}
                    <div className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {logoFile ? (
                            <img
                              src={URL.createObjectURL(logoFile)}
                              alt="Company logo"
                              className="h-12 object-contain"
                            />
                          ) : brandingData?.data?.company_logo ? (
                            <img
                              src={brandingData.data.company_logo}
                              alt="Company logo"
                              className="h-12 object-contain"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Building className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {formData.companyName || "Your Company Name"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formData.companyWebsite || "www.yourcompany.com"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Report Date
                          </p>
                          <p className="font-medium">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sample Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-700">4.8</p>
                        <p className="text-sm text-muted-foreground">
                          Avg Rating
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-700">
                          1,247
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Reviews
                        </p>
                      </div>
                    </div>

                    {/* Sample Chart Area */}
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">
                        Performance Chart
                      </p>
                      <div className="h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded flex items-end justify-center space-x-1 p-2">
                        {[40, 60, 45, 80, 65, 85, 75].map((height, index) => (
                          <div
                            key={index}
                            className="bg-blue-500 rounded-t"
                            style={{ height: `${height}%`, width: "12px" }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Report Footer */}
                    <div className="border-t pt-4 text-sm text-muted-foreground">
                      <div className="flex justify-between items-center">
                        <div>
                          <p>
                            {formData.companyEmail || "contact@yourcompany.com"}
                          </p>
                          <p>{formData.companyPhone || "+1 (555) 123-4567"}</p>
                        </div>
                        <div className="text-right">
                          <p>
                            {formData.companyAddress ||
                              "123 Business St, City, State"}
                          </p>
                          <p className="flex items-center gap-1 justify-end mt-1">
                            <Calendar className="w-3 h-3" />
                            Generated on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Report Branding</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete all report branding settings? This
              action cannot be undone and will remove your company logo and
              information from all future reports.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteBrandingMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBranding}
              disabled={deleteBrandingMutation.isPending}
            >
              {deleteBrandingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Branding"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
