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
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setParseError("File appears to be empty");
        return;
      }

      // Parse headers
      const headerLine = lines[0];
      const parsedHeaders = parseCSVLine(headerLine);
      setHeaders(parsedHeaders);

      // Set total rows count (excluding header)
      const totalDataRows = lines.length - 1;
      setTotalRows(totalDataRows);

      // Parse data rows (limit to first 10 for preview)
      const dataLines = lines.slice(1, 11);
      const parsedData: CSVRow[] = dataLines.map((line, index) => {
        const values = parseCSVLine(line);
        const row: CSVRow = {};
        
        parsedHeaders.forEach((header, i) => {
          row[header] = values[i] || '';
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
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
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