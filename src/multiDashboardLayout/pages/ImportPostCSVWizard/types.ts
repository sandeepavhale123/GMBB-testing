import { ValidationRow, UploadBulkSheetResponse, SaveBulkSheetResponse } from "@/api/csvApi";

export interface WizardFormData {
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

export interface WizardStep {
  number: number;
  title: string;
  completed: boolean;
}

export interface PostTypeOption {
  label: string;
  value: string;
}
