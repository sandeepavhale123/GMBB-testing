import React from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSVDropzone } from "@/components/ImportCSV/CSVDropzone";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface Step2UploadFileProps {
  uploadedFile: File | null;
  onFileUploaded: (file: File) => void;
  onDownloadSample: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isUploadingFile: boolean;
  canProceed: boolean;
}

export const Step2UploadFile = React.memo<Step2UploadFileProps>(({
  uploadedFile,
  onFileUploaded,
  onDownloadSample,
  onPrevious,
  onNext,
  isUploadingFile,
  canProceed,
}) => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {t("importPostCSVWizard.uploadFile.heading")}
          </h2>
          <p className="text-muted-foreground">
            {t("importPostCSVWizard.uploadFile.description")}
          </p>
        </div>
        <Button variant="outline" onClick={onDownloadSample}>
          <Download className="w-4 h-4 mr-2" />
          {t("importPostCSVWizard.uploadFile.downloadSample")}
        </Button>
      </div>

      <CSVDropzone onFileUploaded={onFileUploaded} uploadedFile={uploadedFile} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {t("importPostCSVWizard.uploadFile.previous")}
        </Button>
        <Button onClick={onNext} disabled={!canProceed || isUploadingFile}>
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
});

Step2UploadFile.displayName = "Step2UploadFile";
