import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Upload,
  Download,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { FilePreview } from "@/components/ImportCSV/FilePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  csvApi,
  ValidationRow,
  UploadBulkSheetResponse,
  SaveBulkSheetResponse,
} from "@/api/csvApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { count } from "console";

interface WizardFormData {
  selectedListings: string[];
  postType: string;
  uploadedFile: File | null;
  note: string;
  generatedFileUrl: string | null;
  generatedFileName: string | null;
  uploadResponse: UploadBulkSheetResponse | null;
  totalRows: number;
  errorCount: number;
  validatedRows: ValidationRow[];
  uploadedFileUrl: string | null;
  uploadedFileName: string | null;
  saveResponse: SaveBulkSheetResponse | null;
}
export const ImportPostCSVWizard: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingCSV, setIsGeneratingCSV] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSavingBulkSheet, setIsSavingBulkSheet] = useState(false);
  const [formData, setFormData] = useState<WizardFormData>({
    selectedListings: [],
    postType: "",
    uploadedFile: null,
    note: "",
    generatedFileUrl: null,
    generatedFileName: null,
    uploadResponse: null,
    totalRows: 0,
    errorCount: 0,
    validatedRows: [],
    uploadedFileUrl: null,
    uploadedFileName: null,
    saveResponse: null,
  });

  const postTypeOptions = [
    {
      label: t("importPostCSVWizard.selectListings.postTypeOptions.0"),
      value: "0",
    },
    {
      label: t("importPostCSVWizard.selectListings.postTypeOptions.1"),
      value: "1",
    },
    {
      label: t("importPostCSVWizard.selectListings.postTypeOptions.2"),
      value: "2",
    },
    {
      label: t("importPostCSVWizard.selectListings.postTypeOptions.3"),
      value: "3",
    },
  ];

  const steps = [
    {
      number: 1,
      title: t("importPostCSVWizard.steps.1"),
      completed: currentStep > 1,
    },
    {
      number: 2,
      title: t("importPostCSVWizard.steps.2"),
      completed: currentStep > 2,
    },
    {
      number: 3,
      title: t("importPostCSVWizard.steps.3"),
      completed: currentStep > 3,
    },
    {
      number: 4,
      title: t("importPostCSVWizard.steps.4"),
      completed: currentStep > 4,
    },
  ];
  const canProceedFromStep1 =
    formData.selectedListings.length > 0 &&
    formData.postType &&
    formData.postType !== "0";
  const canProceedFromStep2 = formData.uploadedFile !== null;
  const handleNext = async () => {
    if (currentStep === 1) {
      // Generate CSV file when moving from step 1 to step 2
      await generateCSVFile();
    } else if (currentStep === 2) {
      // Upload and validate CSV file when moving from step 2 to step 3
      await uploadBulkSheet();
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const generateCSVFile = async () => {
    setIsGeneratingCSV(true);

    // Validate required data
    if (!formData.selectedListings.length) {
      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: t("importPostCSVWizard.errors.selectListing"),
        variant: "destructive",
      });
      setIsGeneratingCSV(false);
      return;
    }

    if (!formData.postType || formData.postType === "0") {
      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: t("importPostCSVWizard.errors.selectPostType"),
        variant: "destructive",
      });
      setIsGeneratingCSV(false);
      return;
    }

    try {
      const requestData = {
        fileType: formData.postType,
        listingIds: formData.selectedListings,
      };

      const response = await csvApi.generateMultiCSVFile(requestData);

      if (response.code === 200) {
        setFormData((prev) => ({
          ...prev,
          generatedFileUrl: response.data.fileUrl,
          generatedFileName: response.data.fileName,
        }));
        setCurrentStep(currentStep + 1);
        toast({
          title: t("importPostCSVWizard.success.title"),
          description: t("importPostCSVWizard.success.csvGenerated"),
        });
      } else {
        console.error(
          "❌ API returned error code:",
          response.code,
          response.message
        );
        throw new Error(response.message || "Unknown API error");
      }
    } catch (error: any) {
      console.error("❌ Error generating CSV:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });

      // More specific error messages based on error type
      let errorMessage = t("importPostCSVWizard.errors.csvGenerateFailed");

      if (error?.response?.status === 401) {
        errorMessage = t("importPostCSVWizard.errors.authFailed");
      } else if (error?.response?.status === 403) {
        errorMessage = t("importPostCSVWizard.errors.permissionDenied");
      } else if (error?.response?.status === 500) {
        errorMessage = t("importPostCSVWizard.errors.serverError");
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCSV(false);
    }
  };

  const uploadBulkSheet = async () => {
    if (!formData.uploadedFile) {
      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: t("importPostCSVWizard.errors.selectFile"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.postType || formData.postType === "0") {
      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: t("importPostCSVWizard.errors.selectPostType"),
        variant: "destructive",
      });
      return;
    }

    setIsUploadingFile(true);

    try {
      const response = await csvApi.uploadBulkSheet(
        formData.postType,
        formData.uploadedFile
      );

      if (response.code === 200) {
        setFormData((prev) => ({
          ...prev,
          uploadResponse: response,
          totalRows: response.data.totalRows,
          errorCount: response.data.errorCount,
          validatedRows: response.data.rows,
          uploadedFileUrl: response.data.fileUrl,
          uploadedFileName: response.data.fileName,
        }));

        setCurrentStep(currentStep + 1);

        toast({
          title:
            response.data.errorCount === 0
              ? t("importPostCSVWizard.success.title")
              : t("importPostCSVWizard.success.titleUpload"),
          description:
            response.data.errorCount === 0
              ? t("importPostCSVWizard.success.uploadSuccess")
              : t("importPostCSVWizard.success.uploadWithErrors", {
                  count: response.data.errorCount,
                }),
          // `File uploaded with ${response.data.errorCount} validation errors. Please review.`,
          variant: response.data.errorCount === 0 ? "default" : "destructive",
        });
      } else {
        console.error(
          "❌ Upload API returned error code:",
          response.code,
          response.message
        );
        throw new Error(response.message || "Unknown upload error");
      }
    } catch (error: any) {
      console.error("❌ Error uploading file:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });

      let errorMessage = t("importPostCSVWizard.errors.uploadFailed");
      let errorTitle = t("importPostCSVWizard.errors.title");

      if (error?.response?.status === 401) {
        const backendMessage = error?.response?.data?.message || error.message;

        // If there's a backend message, always show it for CSV-related errors
        if (backendMessage) {
          errorTitle = t("importPostCSVWizard.uploadError");
          errorMessage = backendMessage;
        } else {
          // Only default to auth error if no message provided
          errorMessage = t("importPostCSVWizard.errors.authFailed");
        }
      } else if (error?.response?.status === 403) {
        errorMessage = t("importPostCSVWizard.errors.permissionDenied");
      } else if (error?.response?.status === 500) {
        errorMessage = t("importPostCSVWizard.errors.serverError");
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploadingFile(false);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = async () => {
    if (!formData.uploadedFileName) {
      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: t("importPostCSVWizard.errors.noUploadedFile"),
        variant: "destructive",
      });
      return;
    }

    setIsSavingBulkSheet(true);

    try {
      const response = await csvApi.saveBulkSheet({
        fileType: formData.postType,
        fileName: formData.uploadedFileName,
        note: formData.note,
      });

      if (response.code === 200) {
        setFormData((prev) => ({
          ...prev,
          saveResponse: response,
        }));

        setCurrentStep(4);

        toast({
          title: t("importPostCSVWizard.success.title"),
          description: t("importPostCSVWizard.success.bulkSaveSuccess", {
            count: response.data.insertedCount,
          }),
          // `Successfully imported ${response.data.insertedCount} posts`,
        });
      } else {
        console.error(
          "❌ Save API returned error code:",
          response.code,
          response.message
        );
        throw new Error(response.message || "Unknown save error");
      }
    } catch (error: any) {
      console.error("❌ Error saving bulk sheet:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });

      let errorMessage = t("importPostCSVWizard.errors.saveFailed");

      if (error?.response?.status === 401) {
        errorMessage = t("importPostCSVWizard.errors.authFailed");
      } else if (error?.response?.status === 403) {
        errorMessage = t("importPostCSVWizard.errors.permissionDenied");
      } else if (error?.response?.status === 500) {
        errorMessage = t("importPostCSVWizard.errors.serverError");
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSavingBulkSheet(false);
    }
  };
  const handleDownloadSample = () => {
    if (formData.generatedFileUrl) {
      // Use the generated CSV file URL
      const a = document.createElement("a");
      a.href = formData.generatedFileUrl;
      a.download = formData.generatedFileName || "sample_posts.csv";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast({
        title: t("importPostCSVWizard.errors.title"),
        description: t("importPostCSVWizard.errors.sampleNotAvailable"),
        variant: "destructive",
      });
    }
  };
  const renderStepIndicator = () => (
    <div className="w-64 border-r border-gray-200 p-6 hidden lg:block min-h-[80vh]">
      <h3 className="text-lg font-semibold mb-6">
        {t("importPostCSVWizard.title")}
      </h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-center gap-3 bg-gray-50 p-3"
          >
            <div className="">
              {step.completed ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : currentStep === step.number ? (
                <div className="w-6 h-6 rounded-full bg-blue-400"></div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.completed || currentStep === step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
  const renderMobileStepIndicator = () => (
    <div className="lg:hidden border-b border-gray-200 p-4 bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {t("importPostCSVWizard.title")}
        </h3>
        <span className="text-sm text-muted-foreground">
          {t("importPostCSVWizard.stepCount", { currentStep })}
          {/* Step {currentStep} of 4 */}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border transition-all">
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : currentStep === step.number ? (
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {step.number < 4 && (
              <div className="w-4 h-0.5 bg-gray-200 mx-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("importPostCSVWizard.selectListings.heading")}
        </h2>
        <p className="text-muted-foreground">
          {t("importPostCSVWizard.selectListings.description")}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <BulkReplyListingSelector
            selectedListings={formData.selectedListings}
            onListingsChange={(listings) =>
              setFormData((prev) => ({
                ...prev,
                selectedListings: listings,
              }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {" "}
            {t("importPostCSVWizard.selectListings.postTypeLabel")}
          </label>
          <Select
            value={formData.postType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                postType: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "importPostCSVWizard.selectListings.postTypePlaceholder"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {postTypeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.value === "0"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceedFromStep1 || isGeneratingCSV}
        >
          {isGeneratingCSV ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("importPostCSVWizard.selectListings.generatingCSV")}
            </>
          ) : (
            t("importPostCSVWizard.selectListings.next")
          )}
        </Button>
      </div>
    </div>
  );
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {" "}
            {t("importPostCSVWizard.uploadFile.heading")}
          </h2>
          <p className="text-muted-foreground">
            {t("importPostCSVWizard.uploadFile.description")}
          </p>
        </div>
        <Button variant="outline" onClick={handleDownloadSample}>
          <Download className="w-4 h-4 mr-2" />
          {t("importPostCSVWizard.uploadFile.downloadSample")}
        </Button>
      </div>

      <CSVDropzone
        onFileUploaded={(file) =>
          setFormData((prev) => ({
            ...prev,
            uploadedFile: file,
          }))
        }
        uploadedFile={formData.uploadedFile}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          {t("importPostCSVWizard.uploadFile.previous")}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceedFromStep2 || isUploadingFile}
        >
          {isUploadingFile ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("importPostCSVWizard.uploadFile.uploading")}
            </>
          ) : (
            t("importPostCSVWizard.uploadFile.next")
          )}
        </Button>
      </div>
    </div>
  );
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("importPostCSVWizard.qualityControl.heading")}
        </h2>
        <p className="text-muted-foreground">
          {t("importPostCSVWizard.qualityControl.description")}
        </p>
      </div>

      {formData.uploadResponse && (
        <div className="space-y-4">
          <Card
            className={
              formData.errorCount === 0
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {t("importPostCSVWizard.qualityControl.uploadSummary")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("importPostCSVWizard.file")}: {formData.uploadedFileName}{" "}
                    | {t("importPostCSVWizard.totalRows")}: {formData.totalRows}{" "}
                    |{t("importPostCSVWizard.err")}: {formData.errorCount}
                  </p>
                </div>
                {formData.errorCount === 0 ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          {formData.uploadedFile && (
            <FilePreview
              file={formData.uploadedFile}
              validatedRows={formData.validatedRows}
            />
          )}

          {formData.errorCount > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">
                      {t(
                        "importPostCSVWizard.qualityControl.validationErrorsTitle"
                      )}
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            uploadedFile: file,
                          }));
                          setCurrentStep(2); // Go back to upload step
                        }
                        e.target.value = "";
                      }}
                      className="hidden"
                      id="reupload-input"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("reupload-input")?.click()
                      }
                      className="text-orange-700 border-orange-300 hover:bg-orange-100"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t("importPostCSVWizard.qualityControl.reuploadFile")}
                    </Button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {formData.validatedRows
                      .filter((row) => row.errors.length > 0)
                      .map((row, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded border border-red-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-red-700">
                              {t("importPostCSVWizard.row")} {row.row} -{" "}
                              {row.data.business_name}
                            </span>
                            <span className="text-xs text-red-600">
                              {row.errors.length}{" "}
                              {t("importPostCSVWizard.error")}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {row.errors.map((error, errorIndex) => (
                              <div
                                key={errorIndex}
                                className="text-sm text-red-600 bg-red-50 p-2 rounded"
                              >
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.errorCount === 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">
                      {t("importPostCSVWizard.qualityControl.allRowsValid")}
                    </span>
                  </div>
                  <div className="text-sm text-green-600">
                    <p>
                      {t("importPostCSVWizard.qualityControl.processedRows", {
                        count: formData.totalRows,
                      })}
                      ✓ {/* {formData.totalRows} rows processed */}
                    </p>
                    <p>{t("importPostCSVWizard.qualityControl.noErrors")}</p>
                    <p>
                      {t(
                        "importPostCSVWizard.qualityControl.readyForSubmission"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("importPostCSVWizard.qualityControl.notesLabel")}
        </label>
        <Textarea
          placeholder={t("importPostCSVWizard.qualityControl.notesPlaceholder")}
          value={formData.note}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, note: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          {t("importPostCSVWizard.uploadFile.previous")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={formData.errorCount > 0 || isSavingBulkSheet}
          className={
            formData.errorCount > 0 ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          {isSavingBulkSheet ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("importPostCSVWizard.qualityControl.saving")}
            </>
          ) : formData.errorCount > 0 ? (
            t("importPostCSVWizard.qualityControl.fixErrors")
          ) : (
            t("importPostCSVWizard.qualityControl.submit")
          )}
        </Button>
      </div>
    </div>
  );
  const renderStep4 = () => (
    <div className="space-y-6 text-center py-8">
      <div className="text-6xl">🎉</div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("importPostCSVWizard.submit.heading")}
        </h2>
        <p className="text-muted-foreground">
          {t("importPostCSVWizard.submit.description")}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate("/main-dashboard")}>
          {t("importPostCSVWizard.submit.goToDashboard")}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            navigate(
              `/main-dashboard/bulk-import-details/${formData.saveResponse?.data.historyId}`
            )
          }
        >
          {t("importPostCSVWizard.submit.viewPostDetails")}
        </Button>
      </div>
    </div>
  );
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };
  return (
    <div className="min-h-[80vh] bg-background border border-gray-200">
      {renderMobileStepIndicator()}
      <div className="flex">
        {renderStepIndicator()}
        <div className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="w-full ">{renderCurrentStep()}</div>
        </div>
      </div>
    </div>
  );
};
