import React, { useState, useMemo, useCallback } from "react";
import { csvApi } from "@/api/csvApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { WizardFormData } from "./types";
import { StepIndicator } from "./components/StepIndicator";
import { MobileStepIndicator } from "./components/MobileStepIndicator";
import { Step1SelectListings } from "./components/Step1SelectListings";
import { Step2UploadFile } from "./components/Step2UploadFile";
import { Step3QualityControl } from "./components/Step3QualityControl";
import { Step4Complete } from "./components/Step4Complete";

export const ImportPostCSVWizard: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");
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

  // Memoized static data
  const postTypeOptions = useMemo(() => [
    { label: t("importPostCSVWizard.selectListings.postTypeOptions.0"), value: "0" },
    { label: t("importPostCSVWizard.selectListings.postTypeOptions.1"), value: "1" },
    { label: t("importPostCSVWizard.selectListings.postTypeOptions.2"), value: "2" },
    { label: t("importPostCSVWizard.selectListings.postTypeOptions.3"), value: "3" },
  ], [t]);

  const steps = useMemo(() => [
    { number: 1, title: t("importPostCSVWizard.steps.1"), completed: currentStep > 1 },
    { number: 2, title: t("importPostCSVWizard.steps.2"), completed: currentStep > 2 },
    { number: 3, title: t("importPostCSVWizard.steps.3"), completed: currentStep > 3 },
    { number: 4, title: t("importPostCSVWizard.steps.4"), completed: currentStep > 4 },
  ], [currentStep, t]);

  // Memoized form handlers
  const handleListingsChange = useCallback((listings: string[]) => {
    setFormData(prev => ({ ...prev, selectedListings: listings }));
  }, []);

  const handlePostTypeChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, postType: value }));
  }, []);

  const handleFileUploaded = useCallback((file: File) => {
    setFormData(prev => ({ ...prev, uploadedFile: file }));
  }, []);

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, note: e.target.value }));
  }, []);

  const handleReuploadFile = useCallback((file: File) => {
    setFormData(prev => ({ ...prev, uploadedFile: file }));
    setCurrentStep(2);
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Computed values
  const canProceedFromStep1 = formData.selectedListings.length > 0 && formData.postType && formData.postType !== "0";
  const canProceedFromStep2 = formData.uploadedFile !== null;

  // API handlers
  const generateCSVFile = async () => {
    setIsGeneratingCSV(true);

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
      const response = await csvApi.generateMultiCSVFile({
        fileType: formData.postType,
        listingIds: formData.selectedListings,
      });

      if (response.code === 200) {
        setFormData(prev => ({
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
        throw new Error(response.message || "Unknown API error");
      }
    } catch (error: any) {
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
      const response = await csvApi.uploadBulkSheet(formData.postType, formData.uploadedFile);

      if (response.code === 200) {
        setFormData(prev => ({
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
          title: response.data.errorCount === 0
            ? t("importPostCSVWizard.success.title")
            : t("importPostCSVWizard.success.titleUpload"),
          description: response.data.errorCount === 0
            ? t("importPostCSVWizard.success.uploadSuccess")
            : t("importPostCSVWizard.success.uploadWithErrors", { count: response.data.errorCount }),
          variant: response.data.errorCount === 0 ? "default" : "destructive",
        });
      } else {
        throw new Error(response.message || "Unknown upload error");
      }
    } catch (error: any) {
      let errorMessage = t("importPostCSVWizard.errors.uploadFailed");
      let errorTitle = t("importPostCSVWizard.errors.title");

      if (error?.response?.status === 401) {
        const backendMessage = error?.response?.data?.message || error.message;
        if (backendMessage) {
          errorTitle = t("importPostCSVWizard.uploadError");
          errorMessage = backendMessage;
        } else {
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
        setFormData(prev => ({ ...prev, saveResponse: response }));
        setCurrentStep(4);
        toast({
          title: t("importPostCSVWizard.success.title"),
          description: t("importPostCSVWizard.success.bulkSaveSuccess", { count: response.data.insertedCount }),
        });
      } else {
        throw new Error(response.message || "Unknown save error");
      }
    } catch (error: any) {
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

  const handleDownloadSample = useCallback(() => {
    if (formData.generatedFileUrl) {
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
  }, [formData.generatedFileUrl, formData.generatedFileName, toast, t]);

  const handleNext = async () => {
    if (currentStep === 1) {
      await generateCSVFile();
    } else if (currentStep === 2) {
      await uploadBulkSheet();
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SelectListings
            selectedListings={formData.selectedListings}
            postType={formData.postType}
            postTypeOptions={postTypeOptions}
            onListingsChange={handleListingsChange}
            onPostTypeChange={handlePostTypeChange}
            onNext={handleNext}
            isGeneratingCSV={isGeneratingCSV}
            canProceed={canProceedFromStep1}
          />
        );
      case 2:
        return (
          <Step2UploadFile
            uploadedFile={formData.uploadedFile}
            onFileUploaded={handleFileUploaded}
            onDownloadSample={handleDownloadSample}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isUploadingFile={isUploadingFile}
            canProceed={canProceedFromStep2}
          />
        );
      case 3:
        return (
          <Step3QualityControl
            uploadResponse={formData.uploadResponse}
            uploadedFile={formData.uploadedFile}
            uploadedFileName={formData.uploadedFileName}
            totalRows={formData.totalRows}
            errorCount={formData.errorCount}
            validatedRows={formData.validatedRows}
            note={formData.note}
            onNoteChange={handleNoteChange}
            onReuploadFile={handleReuploadFile}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isSavingBulkSheet={isSavingBulkSheet}
          />
        );
      case 4:
        return <Step4Complete historyId={formData.saveResponse?.data.historyId} />;
      default:
        return (
          <Step1SelectListings
            selectedListings={formData.selectedListings}
            postType={formData.postType}
            postTypeOptions={postTypeOptions}
            onListingsChange={handleListingsChange}
            onPostTypeChange={handlePostTypeChange}
            onNext={handleNext}
            isGeneratingCSV={isGeneratingCSV}
            canProceed={canProceedFromStep1}
          />
        );
    }
  };

  return (
    <div className="min-h-[80vh] bg-background border border-gray-200">
      <MobileStepIndicator steps={steps} currentStep={currentStep} />
      <div className="flex">
        <StepIndicator steps={steps} currentStep={currentStep} />
        <div className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="w-full">{renderCurrentStep()}</div>
        </div>
      </div>
    </div>
  );
};
