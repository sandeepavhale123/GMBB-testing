import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/toast/use-toast";
import { format } from "date-fns";
import type { FeedbackForm } from "../types";

interface FeedbackFormTableProps {
  forms: FeedbackForm[];
  onDelete: (id: string) => void;
}

export const FeedbackFormTable: React.FC<FeedbackFormTableProps> = ({
  forms,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const handleCopyUrl = (formUrl: string, formName: string) => {
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "URL Copied",
      description: `Form URL for "${formName}" copied to clipboard`,
    });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedFormId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFormId) {
      onDelete(selectedFormId);
      toast({
        title: "Form Deleted",
        description: "Feedback form has been deleted successfully",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedFormId(null);
  };

  if (forms.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-12 text-center">
        <p className="text-muted-foreground text-lg">No feedback forms created yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first feedback form to start collecting customer feedback
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">No. of Feedback</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form, index) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{form.name}</TableCell>
                <TableCell>
                  {format(new Date(form.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    {form.feedback_count}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/module/reputation/v1/feedback/${form.id}`)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyUrl(form.form_url, form.name)}
                      title="Copy Form URL"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(form.id)}
                      title="Delete Form"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback form? This action cannot be undone.
              All feedback responses associated with this form will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
