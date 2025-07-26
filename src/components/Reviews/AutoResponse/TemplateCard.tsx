import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Star } from "lucide-react";
import { ReplyTemplate } from "../../../store/slices/reviews/templateTypes";
interface TemplateCardProps {
  starRating: number;
  template?: ReplyTemplate;
  onCreateTemplate: (starRating: number) => void;
  onEditTemplate?: (template: ReplyTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  isRatingOnly?: boolean;
}
export const TemplateCard: React.FC<TemplateCardProps> = ({
  starRating,
  template,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isRatingOnly = false,
}) => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [editContent, setEditContent] = useState("");

  const handleManageClick = () => {
    if (template) {
      let content = "";
      if (Array.isArray(template.content)) {
        content = template.content.join(" | ");
      } else if (template.variations && template.variations.length) {
        content = template.variations.join(" | ");
      } else {
        content = template.content || "";
      }
      setEditContent(content);
      setIsManageOpen(true);
    }
  };
  const handleSave = () => {
    // Here you would typically save the content
    console.log("Saving content:", editContent);
    if (template && onEditTemplate) {
      const updatedTemplate = {
        ...template,
        content: Array.isArray(editContent) ? editContent.map((str) => str.trim()).join(' | ') : editContent,
      };
      onEditTemplate(updatedTemplate);
    }
    setIsManageOpen(false);
  };

  const handleDelete = () => {
    if (template && onDeleteTemplate && !template.isSystem) {
      onDeleteTemplate(template.id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from(
      {
        length: 5,
      },
      (_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      )
    );
  };
  // Get display content
  const getDisplayContent = () => {
    if (!template) return "No template created yet";
    console.log("template data", template);

    let content = "";
    if (Array.isArray(template.content)) {
      content = template.content[0] || "";
    } else {
      content = template.content || "";
    }

    // If it's from variations, get the first one
    if (template.variations && template.variations.length > 0) {
      content = template.variations[0];
    }

    return content;
  };
  const displayContent = getDisplayContent();
  const hasVariations = template?.variations && template.variations.length > 1;

  return (
    <>
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="p-6">
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-2xl font-bold text-gray-900 mr-2">
              {starRating}
            </span>
            <div className="flex">{renderStars(starRating)}</div>
          </div>

          {/* Template Content */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {displayContent}
            </p>
            {hasVariations && (
              <p className="text-xs text-blue-600 font-medium">
                +{template.variations!.length - 1} more variations
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            {template ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageClick}
                className="bg-gray-900 text-white hover:bg-gray-800 hover:text-white border-gray-900 "
              >
                Manage
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreateTemplate(starRating)}
                className="bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
              >
                Create
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manage Modal */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>
                Manage {isRatingOnly ? "Rating Only" : `${starRating}-Star`}{" "}
                Template
              </span>
              <div className="flex">{renderStars(starRating)}</div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Panel - Variables Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Available Variables
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded font-mono">
                    {"{full_name}"}
                  </div>
                  <div className="bg-gray-50 p-2 rounded font-mono">
                    {"{first_name}"}
                  </div>
                  <div className="bg-gray-50 p-2 rounded font-mono">
                    {"{last_name}"}
                  </div>
                </div>
              </div>

              {/* {template?.variations && template.variations.length > 1 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">All Variations</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {template.variations.map((variation, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-2 rounded text-sm"
                      >
                        <strong className="text-xs text-gray-500">
                          Variation {index + 1}:
                        </strong>
                        <p className="mt-1">{variation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Multiple Responses</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Note: If you want to use multiple responses, use a pipe symbol
                  after each response.
                </p>
                <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                  {"{response 1 | response 2}"}
                </div>
              </div>
            </div>

            {/* Right Panel - Template Content */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Template Content
                </label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[300px] resize-y"
                  placeholder="Enter your template response..."
                />
                {template?.isSystem && (
                  <p className="text-xs text-gray-500 mt-1">
                    This is a system template loaded from your settings. Changes
                    should be made through the main settings panel.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsManageOpen(false)}>
              {template?.isSystem ? "Close" : "Cancel"}
            </Button>
            {!template?.isSystem && (
              <Button onClick={handleSave}>Save Template</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
