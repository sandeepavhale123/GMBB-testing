import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Search, Eye, Trash2, X } from "lucide-react";
import { KeywordData } from "../../api/geoRankingApi";
import { useToast } from "@/hooks/use-toast";

interface AllKeywordsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keywords: KeywordData[];
  listingId?: number;
  onViewKeyword: (keywordId: string) => void;
  onDeleteSuccess?: () => void;
  loading?: boolean;
}

export const AllKeywordsModal: React.FC<AllKeywordsModalProps> = ({
  open,
  onOpenChange,
  keywords,
  listingId,
  onViewKeyword,
  onDeleteSuccess,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Filter keywords based on search term
  const filteredKeywords = useMemo(() => {
    return keywords.filter((keyword) => keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [keywords, searchTerm]);

  // Check if all visible keywords are selected
  const allSelected = useMemo(() => {
    return filteredKeywords.length > 0 && filteredKeywords.every((k) => selectedKeywords.includes(k.id));
  }, [filteredKeywords, selectedKeywords]);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(filteredKeywords.map((k) => k.id));
    }
  };

  const handleSelectKeyword = (keywordId: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId) ? prev.filter((id) => id !== keywordId) : [...prev, keywordId],
    );
  };

  const handleView = (keywordId: string) => {
    onViewKeyword(keywordId);
    onOpenChange(false);
  };

  const handleDeleteClick = (keywordIds: string[]) => {
    setKeywordToDelete(keywordIds);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!listingId || keywordToDelete.length === 0) return;

    setIsDeleting(true);
    try {
      const { deleteKeywords } = await import("../../api/geoRankingApi");

      await deleteKeywords({
        listingId: listingId,
        keywordIds: keywordToDelete.map((id) => parseInt(id)),
        isDelete: "delete",
      });

      toast({
        title: "Success",
        description: `${keywordToDelete.length} keyword(s) deleted successfully`,
      });

      // Clear selections
      setSelectedKeywords([]);
      setKeywordToDelete([]);
      setDeleteDialogOpen(false);

      // Notify parent to refresh data
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete keywords",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedKeywords.length > 0) {
      handleDeleteClick(selectedKeywords);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] flex flex-col overflow-y-auto"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className="flex flex-row items-center justify-between pr-6">
            <DialogTitle>All Keywords</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDownCapture={(e) => {
                    if (e.key !== "Escape" && e.key !== "Tab") {
                      e.stopPropagation();
                    }
                  }}
                  onMouseDownCapture={(e) => e.stopPropagation()}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  className="pl-10"
                  autoFocus={false}
                />
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedKeywords.length > 0 && (
              <div className="mb-4 p-3 bg-muted rounded-md flex items-center justify-between">
                <span className="text-sm font-medium">{selectedKeywords.length} keyword(s) selected</span>
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto border rounded-md min-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 py-2">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        disabled={filteredKeywords.length === 0}
                      />
                    </TableHead>
                    <TableHead className="w-20 py-2">Sr. No.</TableHead>
                    <TableHead className="py-2">Keyword</TableHead>
                    <TableHead className="w-32 text-right py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Loading keywords...
                      </TableCell>
                    </TableRow>
                  ) : filteredKeywords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No keywords found matching your search" : "No keywords available"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKeywords.map((keyword, index) => (
                      <TableRow key={keyword.id}>
                        <TableCell className="py-2">
                          <Checkbox
                            checked={selectedKeywords.includes(keyword.id)}
                            onCheckedChange={() => handleSelectKeyword(keyword.id)}
                          />
                        </TableCell>
                        <TableCell className="py-2">{index + 1}</TableCell>
                        <TableCell className="font-medium py-2">{keyword.keyword}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(keyword.id)}
                              title="View keyword details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick([keyword.id])}
                              title="Delete keyword"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              document.body.style.removeProperty("pointer-events");
            }, 100);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {keywordToDelete.length} keyword(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
