import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data interface
interface CSVImportRecord {
  id: number;
  fileName: string;
  note: string;
  totalPosts: number;
  listingsApplied: string;
  status: 'completed' | 'processing' | 'failed';
}

// Sample data - this would come from your API in the future
const mockCSVImports: CSVImportRecord[] = [
  {
    id: 1,
    fileName: "bulk_posts_oct.xlsx",
    note: "October SEO campaign posts",
    totalPosts: 10,
    listingsApplied: "12 Listings",
    status: "completed"
  }
];

const getStatusVariant = (status: CSVImportRecord['status']) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusColor = (status: CSVImportRecord['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'failed':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export const ImportPostCSV: React.FC = () => {
  const handleImport = () => {
    // TODO: Implement CSV import functionality
    console.log('Import CSV clicked');
  };

  const handleView = (id: number) => {
    // TODO: Navigate to CSV import details
    console.log('View CSV import:', id);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete functionality
    console.log('Delete CSV import:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bulk Post Management
          </h1>
        </div>
        <Button 
          onClick={handleImport}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Import
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground font-medium">File name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Note</TableHead>
              <TableHead className="text-muted-foreground font-medium">Total Posts</TableHead>
              <TableHead className="text-muted-foreground font-medium">Listings Applied</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCSVImports.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No CSV imports found. Click "Import" to get started.
                </TableCell>
              </TableRow>
            ) : (
              mockCSVImports.map((record, index) => (
                <TableRow key={record.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    <span className="text-muted-foreground mr-2">{index + 1}</span>
                    {record.fileName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.note}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {record.totalPosts}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {record.listingsApplied}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(record.status)}
                      className={getStatusColor(record.status)}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(record.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};