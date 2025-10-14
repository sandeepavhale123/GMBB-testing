import React, { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import { Button } from "../ui/button";

interface CSVDropzoneProps {
  onFileUploaded: (file: File) => void;
  uploadedFile: File | null;
  isReupload?: boolean;
}

export const CSVDropzone: React.FC<CSVDropzoneProps> = ({
  onFileUploaded,
  uploadedFile,
  isReupload = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else {
      return `${Math.round(kb)} KB`;
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
    const fileExtension = file.name.toLowerCase().split('.').pop();

    if (!allowedTypes.includes(file.type) && fileExtension !== 'csv') {
      setError("Only CSV files are allowed");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const firstFile = droppedFiles[0];
    
    if (firstFile && validateFile(firstFile)) {
      onFileUploaded(firstFile);
    }
  }, [onFileUploaded]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const firstFile = selectedFiles[0];
    
    if (firstFile && validateFile(firstFile)) {
      onFileUploaded(firstFile);
    }

    // Reset input value
    e.target.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = () => {
    onFileUploaded(null as any);
    setError(null);
  };

  if (uploadedFile && !isReupload) {
    return (
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/25"
          }
          ${isReupload ? "max-w-md mx-auto" : ""}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragging ? "bg-primary/10" : "bg-muted/50"}
            `}>
              <Upload className={`
                w-8 h-8 transition-colors duration-200
                ${isDragging ? "text-primary" : "text-muted-foreground"}
              `} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? "Drop your CSV file here" : 
               isReupload ? "Re-upload file" : "Drag & drop your CSV file"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or{" "}
              <span className="text-primary font-medium cursor-pointer underline">
                choose file from computer
              </span>
            </p>
            <p className="text-sm text-muted-foreground">CSV files only • Max 5MB</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>Supported: .csv</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};