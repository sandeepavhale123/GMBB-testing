import React, { useEffect, useState } from "react";
import { FileText, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

interface FilePreviewProps {
  file: File;
}

interface CSVRow {
  [key: string]: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);

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
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      
      if (!text.trim()) {
        setParseError("File appears to be empty");
        return;
      }

      // Parse entire CSV with proper quote handling
      const rows: string[][] = [];
      let currentRow: string[] = [];
      let currentField = '';
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
        } else if (char === ',' && !inQuotes) {
          // Field separator
          currentRow.push(currentField.trim().replace(/[\r\n]+/g, ' '));
          currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          // Row separator
          if (char === '\r' && nextChar === '\n') {
            i++; // Skip \n in \r\n
          }
          
          // Push current field and row
          currentRow.push(currentField.trim().replace(/[\r\n]+/g, ' '));
          
          // Only add non-empty rows
          if (currentRow.some(field => field.length > 0)) {
            rows.push(currentRow);
          }
          
          currentRow = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }

      // Push last field and row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim().replace(/[\r\n]+/g, ' '));
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
      }

      if (rows.length === 0) {
        setParseError("File appears to be empty");
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
          row[header] = rowValues[i] || '';
        });
        
        return row;
      });

      setCsvData(parsedData);
    } catch (error) {
      setParseError("Failed to parse CSV file. Please check the file format.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
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
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/[\r\n]+/g, ' '));
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim().replace(/[\r\n]+/g, ' '));
    return result;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-5 h-5 animate-pulse" />
            <span>Processing file...</span>
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
          File Preview
        </CardTitle>
        
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">File:</span> {file.name}
          </div>
          <div>
            <span className="font-medium">Size:</span> {(file.size / 1024).toFixed(1)} KB
          </div>
          <div>
            <span className="font-medium">Type:</span> CSV
          </div>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          Showing {Math.min(10, csvData.length)} of {totalRows} rows • {headers.length} columns
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      <div className="max-w-32 truncate" title={row[header]}>
                        {row[header] || '-'}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        {csvData.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No data rows found in the CSV file
          </div>
        )}
      </CardContent>
    </Card>
  );
};