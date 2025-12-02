import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, RotateCcw, Eye } from "lucide-react";

interface ActionButtonsCardProps {
  scheduleEnabled: boolean;
  onReset: () => void;
  onSubmit: () => void;
  onPreview?: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
  editMode?: boolean;
}

export const ActionButtonsCard: React.FC<ActionButtonsCardProps> = ({
  scheduleEnabled,
  onReset,
  onSubmit,
  onPreview,
  isSubmitting,
  isUploading,
  editMode = false,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-2 sm:gap-3 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onReset} 
            disabled={isSubmitting || isUploading}
            className="flex-1 sm:flex-initial"
          >
            <RotateCcw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          
          {onPreview && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPreview}
              className="flex-1 sm:flex-initial lg:hidden"
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          )}
          
          <Button 
            type="button" 
            onClick={onSubmit} 
            disabled={isSubmitting || isUploading}
            className="flex-1 sm:flex-initial"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">{editMode ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {editMode
                    ? scheduleEnabled
                      ? "Update Schedule"
                      : "Update Post"
                    : scheduleEnabled
                      ? "Schedule"
                      : "Publish Now"}
                </span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
