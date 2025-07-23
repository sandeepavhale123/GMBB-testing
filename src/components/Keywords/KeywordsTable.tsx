
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, Download } from 'lucide-react';
import { Keyword } from '../../types/keywords';
import { format } from 'date-fns';

interface KeywordsTableProps {
  keywords: Keyword[];
  loading: boolean;
  onExport: (format: 'csv' | 'json') => void;
}

export const KeywordsTable: React.FC<KeywordsTableProps> = ({
  keywords,
  loading,
  onExport
}) => {
  const handleView = (keyword: Keyword) => {
    // Navigate to keyword details or show more info
    console.log('View keyword:', keyword);
  };

  const getRankDisplay = (rank: number | null) => {
    if (rank === null) return <Badge variant="secondary">Pending</Badge>;
    if (rank === 0) return <Badge variant="destructive">Not Found</Badge>;
    return <Badge variant="default">#{rank}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="border rounded-md">
          <div className="h-12 bg-muted animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Keywords ({keywords.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('csv')}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('json')}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sr. No</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No keywords found. Add your first keyword to get started.
                </TableCell>
              </TableRow>
            ) : (
              keywords.map((keyword, index) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{keyword.keyword}</TableCell>
                  <TableCell>{getRankDisplay(keyword.rank)}</TableCell>
                  <TableCell>{format(new Date(keyword.addedOn), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(keyword)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
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
