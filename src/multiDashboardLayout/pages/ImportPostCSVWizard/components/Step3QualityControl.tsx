import React from "react";
import { CheckCircle2, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FilePreview } from "@/components/ImportCSV/FilePreview";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { ValidationRow, UploadBulkSheetResponse } from "@/api/csvApi";

interface Step3QualityControlProps {
  uploadResponse: UploadBulkSheetResponse | null;
  uploadedFile: File | null;
  uploadedFileName: string | null;
  totalRows: number;
  errorCount: number;
  validatedRows: ValidationRow[];
  note: string;
  onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onReuploadFile: (file: File) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSavingBulkSheet: boolean;
}

export const Step3QualityControl = React.memo<Step3QualityControlProps>(({
  uploadResponse,
  uploadedFile,
  uploadedFileName,
  totalRows,
  errorCount,
  validatedRows,
  note,
  onNoteChange,
  onReuploadFile,
  onPrevious,
  onSubmit,
  isSavingBulkSheet,
}) => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReuploadFile(file);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("importPostCSVWizard.qualityControl.heading")}
        </h2>
        <p className="text-muted-foreground">
          {t("importPostCSVWizard.qualityControl.description")}
        </p>
      </div>

      {uploadResponse && (
        <div className="space-y-4">
          <Card
            className={
              errorCount === 0
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
                    {t("importPostCSVWizard.file")}: {uploadedFileName}{" "}
                    | {t("importPostCSVWizard.totalRows")}: {totalRows}{" "}
                    |{t("importPostCSVWizard.err")}: {errorCount}
                  </p>
                </div>
                {errorCount === 0 ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          {uploadedFile && (
            <FilePreview file={uploadedFile} validatedRows={validatedRows} />
          )}

          {errorCount > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">
                      {t("importPostCSVWizard.qualityControl.validationErrorsTitle")}
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="reupload-input"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("reupload-input")?.click()}
                      className="text-orange-700 border-orange-300 hover:bg-orange-100"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t("importPostCSVWizard.qualityControl.reuploadFile")}
                    </Button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {validatedRows
                      .filter((row) => row.errors.length > 0)
                      .map((row, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded border border-red-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-red-700">
                              {t("importPostCSVWizard.row")} {row.row} - {row.data.business_name}
                            </span>
                            <span className="text-xs text-red-600">
                              {row.errors.length} {t("importPostCSVWizard.error")}
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

          {errorCount === 0 && (
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
                      {t("importPostCSVWizard.qualityControl.processedRows", { count: totalRows })}✓
                    </p>
                    <p>{t("importPostCSVWizard.qualityControl.noErrors")}</p>
                    <p>{t("importPostCSVWizard.qualityControl.readyForSubmission")}</p>
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
          value={note}
          onChange={onNoteChange}
          rows={3}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {t("importPostCSVWizard.uploadFile.previous")}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={errorCount > 0 || isSavingBulkSheet}
          className={errorCount > 0 ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isSavingBulkSheet ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("importPostCSVWizard.qualityControl.saving")}
            </>
          ) : errorCount > 0 ? (
            t("importPostCSVWizard.qualityControl.fixErrors")
          ) : (
            t("importPostCSVWizard.qualityControl.submit")
          )}
        </Button>
      </div>
    </div>
  );
});

Step3QualityControl.displayName = "Step3QualityControl";
