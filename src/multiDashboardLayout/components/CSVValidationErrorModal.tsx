import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CSVValidationError } from "@/api/bulkMapRankingApi";

interface CSVValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorCount: number;
  errors: CSVValidationError[];
  onReupload: () => void;
}

export const CSVValidationErrorModal: React.FC<CSVValidationErrorModalProps> = ({
  isOpen,
  onClose,
  errorCount,
  errors,
  onReupload,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">CSV Validation Errors</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Found {errorCount} error{errorCount > 1 ? "s" : ""} in your CSV file. Please fix the issues and re-upload.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4 mt-4">
            {errors.map((error, index) => (
              <div
                key={index}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-red-900 mb-2">
                      Row {error.row}
                    </p>
                    <ul className="space-y-1">
                      {error.errors.map((errorMsg, errIdx) => (
                        <li
                          key={errIdx}
                          className="text-sm text-red-800 pl-4 relative before:content-['•'] before:absolute before:left-0"
                        >
                          {errorMsg}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onReupload} className="gap-2">
            <Upload className="h-4 w-4" />
            Re-upload CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
