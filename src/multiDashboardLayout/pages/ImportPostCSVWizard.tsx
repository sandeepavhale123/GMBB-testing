import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Upload, Download, AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { FilePreview } from "@/components/ImportCSV/FilePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { csvApi, ValidationRow, UploadBulkSheetResponse, SaveBulkSheetResponse } from "@/api/csvApi";
import { useToast } from "@/hooks/use-toast";
const postTypeOptions = [
  { label: "Select file type", value: "0" },
  { label: "Regular post file", value: "1" },
  { label: "Event post file", value: "2" },
  { label: "Offer post file", value: "3" }
];

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
    saveResponse: null
  });
  const steps = [{
    number: 1,
    title: "Select Listings",
    completed: currentStep > 1
  }, {
    number: 2,
    title: "Upload File",
    completed: currentStep > 2
  }, {
    number: 3,
    title: "QC",
    completed: currentStep > 3
  }, {
    number: 4,
    title: "Submit",
    completed: currentStep > 4
  }];
  const canProceedFromStep1 = formData.selectedListings.length > 0 && formData.postType && formData.postType !== "0";
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
    
    // Validation and debugging
    console.log('🚀 Starting CSV generation with data:', {
      postType: formData.postType,
      selectedListings: formData.selectedListings,
      listingCount: formData.selectedListings.length
    });

    // Validate required data
    if (!formData.selectedListings.length) {
      toast({
        title: "Error",
        description: "Please select at least one listing.",
        variant: "destructive"
      });
      setIsGeneratingCSV(false);
      return;
    }

    if (!formData.postType || formData.postType === "0") {
      toast({
        title: "Error", 
        description: "Please select a valid post type.",
        variant: "destructive"
      });
      setIsGeneratingCSV(false);
      return;
    }

    try {
      const requestData = {
        fileType: formData.postType,
        listingIds: formData.selectedListings
      };
      
      console.log('📤 Sending API request:', requestData);
      
      const response = await csvApi.generateMultiCSVFile(requestData);
      
      console.log('📥 Received API response:', response);

      if (response.code === 200) {
        setFormData(prev => ({
          ...prev,
          generatedFileUrl: response.data.fileUrl,
          generatedFileName: response.data.fileName
        }));
        setCurrentStep(currentStep + 1);
        toast({
          title: "Success",
          description: "CSV file generated successfully"
        });
        console.log('✅ CSV generation successful');
      } else {
        console.error('❌ API returned error code:', response.code, response.message);
        throw new Error(response.message || 'Unknown API error');
      }
    } catch (error: any) {
      console.error('❌ Error generating CSV:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText
      });

      // More specific error messages based on error type
      let errorMessage = "Failed to generate CSV file. Please try again.";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to generate CSV files.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCSV(false);
    }
  };

  const uploadBulkSheet = async () => {
    if (!formData.uploadedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.postType || formData.postType === "0") {
      toast({
        title: "Error",
        description: "Please select a valid post type.",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingFile(true);

    try {
      console.log('🚀 Starting file upload with:', {
        postType: formData.postType,
        fileName: formData.uploadedFile.name
      });

      const response = await csvApi.uploadBulkSheet(formData.postType, formData.uploadedFile);

      console.log('📥 Received upload response:', response);

      if (response.code === 200) {
        setFormData(prev => ({
          ...prev,
          uploadResponse: response,
          totalRows: response.data.totalRows,
          errorCount: response.data.errorCount,
          validatedRows: response.data.rows,
          uploadedFileUrl: response.data.fileUrl,
          uploadedFileName: response.data.fileName
        }));

        setCurrentStep(currentStep + 1);

        toast({
          title: response.data.errorCount === 0 ? "Success" : "Upload Complete",
          description: response.data.errorCount === 0 
            ? "File uploaded and validated successfully"
            : `File uploaded with ${response.data.errorCount} validation errors. Please review.`,
          variant: response.data.errorCount === 0 ? "default" : "destructive"
        });

        console.log('✅ File upload successful');
      } else {
        console.error('❌ Upload API returned error code:', response.code, response.message);
        throw new Error(response.message || 'Unknown upload error');
      }
    } catch (error: any) {
      console.error('❌ Error uploading file:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText
      });

      let errorMessage = "Failed to upload file. Please try again.";
      let errorTitle = "Error";
      
      if (error?.response?.status === 401) {
        const backendMessage = error?.response?.data?.message || error.message;
        // Check if it's a file validation error
        if (backendMessage?.toLowerCase().includes("invalid file") || 
            backendMessage?.toLowerCase().includes("upload a valid csv") ||
            backendMessage?.toLowerCase().includes("file parameters")) {
          errorTitle = "Invalid File";
          errorMessage = backendMessage || "Please upload a valid CSV file.";
        } else {
          errorMessage = "Authentication failed. Please log in again.";
        }
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to upload files.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
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
        title: "Error",
        description: "No uploaded file found. Please upload a file first.",
        variant: "destructive"
      });
      return;
    }

    setIsSavingBulkSheet(true);

    try {
      console.log('🚀 Starting bulk sheet save with:', {
        fileType: formData.postType,
        fileName: formData.uploadedFileName,
        note: formData.note
      });

      const response = await csvApi.saveBulkSheet({
        fileType: formData.postType,
        fileName: formData.uploadedFileName,
        note: formData.note
      });

      console.log('📥 Received save response:', response);

      if (response.code === 200) {
        setFormData(prev => ({
          ...prev,
          saveResponse: response
        }));

        setCurrentStep(4);

        toast({
          title: "Success",
          description: `Successfully imported ${response.data.insertedCount} posts`,
        });

        console.log('✅ Bulk sheet save successful');
      } else {
        console.error('❌ Save API returned error code:', response.code, response.message);
        throw new Error(response.message || 'Unknown save error');
      }
    } catch (error: any) {
      console.error('❌ Error saving bulk sheet:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText
      });

      let errorMessage = "Failed to save bulk sheet. Please try again.";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to save bulk sheets.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSavingBulkSheet(false);
    }
  };
  const handleDownloadSample = () => {
    if (formData.generatedFileUrl) {
      // Use the generated CSV file URL
      const a = document.createElement('a');
      a.href = formData.generatedFileUrl;
      a.download = formData.generatedFileName || 'sample_posts.csv';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast({
        title: "Error",
        description: "Sample CSV file is not available. Please go back to step 1.",
        variant: "destructive"
      });
    }
  };
  const renderStepIndicator = () => <div className="w-64 border-r border-gray-200 p-6 hidden lg:block min-h-[80vh]">
      <h3 className="text-lg font-semibold mb-6">Import Post CSV</h3>
      <div className="space-y-4">
        {steps.map(step => <div key={step.number} className="flex items-center gap-3 bg-gray-50 p-3">
            <div className="">
              {step.completed ? <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success"><Check className="w-4 h-4 text-white" /></div> : currentStep === step.number ? <div className="w-6 h-6 rounded-full bg-blue-400"></div> : <div className="w-6 h-6 rounded-full bg-gray-300"></div>}
            </div>
            <span className={`text-sm font-medium ${step.completed || currentStep === step.number ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
          </div>)}
      </div>
    </div>;
  const renderMobileStepIndicator = () => <div className="lg:hidden border-b border-gray-200 p-4 bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Import Post CSV</h3>
        <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {steps.map(step => <div key={step.number} className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border transition-all">
              {step.completed ? <CheckCircle2 className="w-4 h-4 text-success" /> : currentStep === step.number ? <div className="w-3 h-3 rounded-full bg-primary"></div> : <Circle className="w-4 h-4 text-muted-foreground" />}
            </div>
            {step.number < 4 && <div className="w-4 h-0.5 bg-gray-200 mx-1"></div>}
          </div>)}
      </div>
    </div>;
  const renderStep1 = () => <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Listings</h2>
        <p className="text-muted-foreground">Choose the listings and post type for your bulk import.</p>
      </div>

      <div className="space-y-4">
        <div>
          
          <BulkReplyListingSelector selectedListings={formData.selectedListings} onListingsChange={listings => setFormData(prev => ({
          ...prev,
          selectedListings: listings
        }))} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Post Type</label>
          <Select value={formData.postType} onValueChange={value => setFormData(prev => ({
          ...prev,
          postType: value
        }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              {postTypeOptions.map(option => <SelectItem key={option.value} value={option.value} disabled={option.value === "0"}>
                  {option.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!canProceedFromStep1 || isGeneratingCSV}>
          {isGeneratingCSV ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating CSV...
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>;
  const renderStep2 = () => <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Upload File</h2>
          <p className="text-muted-foreground">Upload your CSV file for bulk post import.</p>
        </div>
        <Button variant="outline" onClick={handleDownloadSample}>
          <Download className="w-4 h-4 mr-2" />
          Download Generated CSV File
        </Button>
      </div>

      <CSVDropzone onFileUploaded={file => setFormData(prev => ({
      ...prev,
      uploadedFile: file
    }))} uploadedFile={formData.uploadedFile} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!canProceedFromStep2 || isUploadingFile}>
          {isUploadingFile ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>;
  const renderStep3 = () => <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Quality Control</h2>
        <p className="text-muted-foreground">Review your uploaded file validation results.</p>
      </div>

      {formData.uploadResponse && (
        <div className="space-y-4">
          <Card className={formData.errorCount === 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Upload Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    File: {formData.uploadedFileName} | Total Rows: {formData.totalRows} | Errors: {formData.errorCount}
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
                    <span className="font-medium">Validation Errors Found - Please fix and re-upload</span>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, uploadedFile: file }));
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
                      onClick={() => document.getElementById('reupload-input')?.click()} 
                      className="text-orange-700 border-orange-300 hover:bg-orange-100"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Re-upload File
                    </Button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {formData.validatedRows.filter(row => row.errors.length > 0).map((row, index) => (
                      <div key={index} className="p-3 bg-white rounded border border-red-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-red-700">Row {row.row} - {row.data.business_name}</span>
                          <span className="text-xs text-red-600">{row.errors.length} error(s)</span>
                        </div>
                        <div className="space-y-1">
                          {row.errors.map((error, errorIndex) => (
                            <div key={errorIndex} className="text-sm text-red-600 bg-red-50 p-2 rounded">
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
                    <span className="font-medium">All rows validated successfully!</span>
                  </div>
                  <div className="text-sm text-green-600">
                    <p>✓ {formData.totalRows} rows processed</p>
                    <p>✓ No validation errors found</p>
                    <p>✓ Ready for submission</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <Textarea 
          placeholder="Add any notes about this import..." 
          value={formData.note} 
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))} 
          rows={3} 
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={formData.errorCount > 0 || isSavingBulkSheet}
          className={formData.errorCount > 0 ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isSavingBulkSheet ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : formData.errorCount > 0 ? (
            "Fix Errors to Continue"
          ) : (
            "Submit Import"
          )}
        </Button>
      </div>
    </div>;
  const renderStep4 = () => <div className="space-y-6 text-center py-8">
      <div className="text-6xl">🎉</div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Congratulations!</h2>
        <p className="text-muted-foreground">
          All your posts have been successfully imported in bulk.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate('/main-dashboard')}>
          Go to Main Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate(`/main-dashboard/bulk-import-details/${formData.saveResponse?.data.historyId}`)}>
          View Post Details
        </Button>
      </div>
    </div>;
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
  return <div className="min-h-[80vh] bg-background border border-gray-200">
      {renderMobileStepIndicator()}
      <div className="flex">
        {renderStepIndicator()}
        <div className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="w-full ">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>;
};