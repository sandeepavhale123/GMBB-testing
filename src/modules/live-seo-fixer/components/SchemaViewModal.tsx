import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SchemaViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schemaData: string;
  title: string;
}

export const SchemaViewModal: React.FC<SchemaViewModalProps> = ({ open, onOpenChange, schemaData, title }) => {
  const [copied, setCopied] = React.useState(false);

  const formattedSchema = React.useMemo(() => {
    try {
      const parsed = typeof schemaData === "string" ? JSON.parse(schemaData) : schemaData;
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return schemaData;
    }
  }, [schemaData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSchema);
    setCopied(true);
    toast.success("Schema copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
              <DialogDescription>View and copy the JSON schema markup</DialogDescription>
            </div>

            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Schema
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          <div className="flex-1 overflow-auto bg-muted rounded-md p-4">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">{formattedSchema}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
