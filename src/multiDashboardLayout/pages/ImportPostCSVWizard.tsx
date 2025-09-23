import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Upload, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { FilePreview } from "@/components/ImportCSV/FilePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const postTypeOptions = [{
  label: "Select file type",
  value: "0"
}, {
  label: "Regular post file",
  value: "1"
}, {
  label: "Regular post file with silo",
  value: "2"
}, {
  label: "Regular post file silo with spin text",
  value: "3"
}, {
  label: "Event post file",
  value: "4"
}, {
  label: "Event post file with silo",
  value: "5"
}, {
  label: "Event post file silo with spin text",
  value: "6"
}, {
  label: "Offer post file",
  value: "7"
}, {
  label: "Offer post file with silo",
  value: "8"
}, {
  label: "Offer post file silo with spin text",
  value: "9"
}];
interface WizardFormData {
  selectedListings: string[];
  postType: string;
  uploadedFile: File | null;
  note: string;
}
export const ImportPostCSVWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>({
    selectedListings: [],
    postType: "",
    uploadedFile: null,
    note: ""
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
  const handleSubmit = () => {
    // Process the form submission
    console.log("Submitting CSV import:", formData);
    setCurrentStep(4);
  };
  const handleDownloadSample = () => {
    // Create a sample CSV content
    const csvContent = `title,description,post_type,publish_date
"Sample Post Title","This is a sample post description","regular","2024-01-15"
"Another Sample","Another sample description","event","2024-01-16"`;
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_posts.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const renderStepIndicator = () => <div className="w-64 border-r border-gray-200 p-6 hidden lg:block min-h-[80vh]">
      <h3 className="text-lg font-semibold mb-6">Import Post CSV</h3>
      <div className="space-y-4">
        {steps.map(step => <div key={step.number} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all">
              {step.completed ? <CheckCircle2 className="w-5 h-5 text-success" /> : currentStep === step.number ? <div className="w-4 h-4 rounded-full bg-primary"></div> : <Circle className="w-5 h-5 text-muted-foreground" />}
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
          <label className="block text-sm font-medium mb-2">Select Listings</label>
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
        <Button onClick={handleNext} disabled={!canProceedFromStep1}>
          Next
        </Button>
      </div>
    </div>;
  const renderStep2 = () => <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Upload File</h2>
          <p className="text-muted-foreground">Upload your CSV file for bulk post import.</p>
        </div>
        <Button variant="outline" onClick={handleDownloadSample}>
          <Download className="w-4 h-4 mr-2" />
          Download Sample CSV
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
        <Button onClick={handleNext} disabled={!canProceedFromStep2}>
          Next
        </Button>
      </div>
    </div>;
  const renderStep3 = () => <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">QC</h2>
        <p className="text-muted-foreground">Review your uploaded file and make any necessary adjustments.</p>
      </div>

      {formData.uploadedFile && <FilePreview file={formData.uploadedFile} />}

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Please fix the suggested issue and re-upload the file.</span>
            </div>
            <div>
              <input type="file" accept=".csv" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({
                  ...prev,
                  uploadedFile: file
                }));
              }
              e.target.value = "";
            }} className="hidden" id="reupload-input" />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('reupload-input')?.click()} className="text-orange-700 border-orange-300 hover:bg-orange-100">
                <Upload className="w-4 h-4 mr-2" />
                Re-upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <label className="block text-sm font-medium mb-2">Note</label>
        <Textarea placeholder="Add any notes about this import..." value={formData.note} onChange={e => setFormData(prev => ({
        ...prev,
        note: e.target.value
      }))} rows={3} />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          Submit
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
        <Button variant="outline" onClick={() => navigate('/main-dashboard/bulk-post')}>
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
        <div className="flex-1 p-4 lg:p-8 ">
          <div className="w-full max-w-4xl">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>;
};