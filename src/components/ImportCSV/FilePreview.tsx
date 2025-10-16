import React, { useEffect, useState } from "react";
import { FileText, Eye, AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface ValidationRow {
  row: number;
  errors: string[];
  data: Record<string, any>;
}

interface FilePreviewProps {
  file: File;
  validatedRows?: ValidationRow[];
}

interface CSVRow {
  [key: string]: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  validatedRows = [],
}) => {
  const { t } = useI18nNamespace("ImportCSV/FilePreview");
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<CSVRow | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (file) {
      parseCSV(file);
    }
  }, [file]);

  const parseCSV = async (file: File) => {
    setIsLoading(true);
    setParseError(null);

    try {
      let text = await file.text();

      // Remove BOM if present
      if (text.charCodeAt(0) === 0xfeff) {
        text = text.slice(1);
      }

      if (!text.trim()) {
        setParseError(t("filePreview.fileEmpty"));
        return;
      }

      // Parse entire CSV with proper quote handling
      const rows: string[][] = [];
      let currentRow: string[] = [];
      let currentField = "";
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            currentField += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          // Field separator
          currentRow.push(currentField.trim().replace(/[\r\n]+/g, " "));
          currentField = "";
        } else if ((char === "\n" || char === "\r") && !inQuotes) {
          // Row separator
          if (char === "\r" && nextChar === "\n") {
            i++; // Skip \n in \r\n
          }

          // Push current field and row
          currentRow.push(currentField.trim().replace(/[\r\n]+/g, " "));

          // Only add non-empty rows
          if (currentRow.some((field) => field.length > 0)) {
            rows.push(currentRow);
          }

          currentRow = [];
          currentField = "";
        } else {
          currentField += char;
        }
      }

      // Push last field and row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim().replace(/[\r\n]+/g, " "));
        if (currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }
      }

      if (rows.length === 0) {
        setParseError(t("filePreview.fileEmpty"));
        return;
      }

      // Extract headers
      const parsedHeaders = rows[0];
      setHeaders(parsedHeaders);

      // Extract data rows
      const dataRows = rows.slice(1);
      setTotalRows(dataRows.length);

      // Parse data rows (limit to first 10 for preview)
      const parsedData: CSVRow[] = dataRows.slice(0, 10).map((rowValues) => {
        const row: CSVRow = {};

        parsedHeaders.forEach((header, i) => {
          row[header] = rowValues[i] || "";
        });

        return row;
      });

      setCsvData(parsedData);
    } catch (error) {
      setParseError(t("filePreview.parseError"));
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim().replace(/[\r\n]+/g, " "));
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim().replace(/[\r\n]+/g, " "));
    return result;
  };

  const hasErrors = (rowIndex: number) => {
    const validationRow = validatedRows.find((v) => v.row === rowIndex + 2); // +2 because row 1 is header
    return validationRow && validationRow.errors.length > 0;
  };

  const handleViewPost = (row: CSVRow, rowIndex: number) => {
    setSelectedPost(row);
    setSelectedRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-5 h-5 animate-pulse" />
            <span>{t("filePreview.processingFile")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (parseError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>{parseError}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          {t("filePreview.title")}
        </CardTitle>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">{t("filePreview.file")}:</span>{" "}
            {file.name}
          </div>
          <div>
            <span className="font-medium">{t("filePreview.size")}:</span>{" "}
            {(file.size / 1024).toFixed(1)} KB
          </div>
          <div>
            <span className="font-medium">{t("filePreview.type")}:</span> CSV
          </div>
        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          {t("filePreview.rowsPreview", {
            preview: Math.min(10, csvData.length),
            total: totalRows,
            columns: headers.length,
          })}
          {/* Showing {Math.min(10, csvData.length)} of {totalRows} rows •{" "}
          {headers.length} columns */}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
                <TableHead className="whitespace-nowrap">
                  {t("filePreview.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      <div className="max-w-32 truncate" title={row[header]}>
                        {row[header] || "-"}
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="whitespace-nowrap">
                    {!hasErrors(rowIndex) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPost(row, rowIndex)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t("filePreview.viewPost")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {csvData.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            {t("filePreview.noDataRows")}
          </div>
        )}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{t("filePreview.postPreview")}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4 pb-4">
              {/* Post Image */}
              {selectedPost.image_url && (
                <div className="w-full aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.image_url}
                    alt="Post"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Post Content */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("filePreview.description")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-h-40 overflow-y-auto">
                  {selectedPost.text || t("filePreview.noDescription")}
                </p>
              </div>

              {/* CTA Button */}
              {selectedPost.action_type && selectedPost.cta_url && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("filePreview.callToAction")}
                  </h3>
                  <Button
                    className="w-full"
                    onClick={() => window.open(selectedPost.cta_url, "_blank")}
                  >
                    {selectedPost.action_type}
                  </Button>
                </div>
              )}

              {/* Schedule Date */}
              {selectedPost.schedule_date && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {t("filePreview.scheduledFor")}
                  </span>{" "}
                  {selectedPost.schedule_date}
                </div>
              )}

              {/* Row ID */}
              <div className="text-xs text-gray-500 border-t pt-3">
                {t("filePreview.rowId")}: {selectedRowIndex + 2}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
