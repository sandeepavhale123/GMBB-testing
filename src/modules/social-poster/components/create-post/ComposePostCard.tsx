import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smile, Link2, X, Loader2, ImagePlus, Wand2 } from "lucide-react";
import { CharacterCounter, getMinCharacterLimit } from "./CharacterCounter";
import { MediaItem } from "../../types";
import { toast } from "sonner";
import { AIDescriptionModal } from "@/components/Posts/AIDescriptionModal";

interface ComposePostCardProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  uploadedMedia: MediaItem[];
  isUploading: boolean;
  deletingMediaId: string | null;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMediaRemove: (index: number) => void;
  onEmojiClick: () => void;
  onLinkClick: () => void;
}

export const ComposePostCard: React.FC<ComposePostCardProps> = ({
  content,
  onContentChange,
  selectedPlatforms,
  uploadedMedia,
  isUploading,
  deletingMediaId,
  onMediaUpload,
  onMediaRemove,
  onEmojiClick,
  onLinkClick,
}) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const minLimit = getMinCharacterLimit(selectedPlatforms);

    // Only block if trying to ADD characters beyond the limit
    // Allow deletions (backspace) even when over limit
    if (minLimit !== Infinity && newValue.length > minLimit && newValue.length > content.length) {
      toast.error(`Character limit is ${minLimit} characters`);
      return;
    }

    onContentChange(newValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Compose Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Textarea */}
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={handleContentChange}
              className="min-h-[150px] resize-none pr-12"
              maxLength={
                getMinCharacterLimit(selectedPlatforms) === Infinity
                  ? undefined
                  : getMinCharacterLimit(selectedPlatforms)
              }
            />
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAIModalOpen(true)}
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
              title="Generate with AI"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Toolbar row */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("media-upload-input")?.click()}
                className="h-8 w-8 p-0"
                disabled={uploadedMedia.length > 0 || isUploading}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onEmojiClick} className="h-8 w-8 p-0">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <CharacterCounter content={content} platforms={selectedPlatforms} />
          </div>

          {/* Hidden file input */}
          <Input
            id="media-upload-input"
            type="file"
            accept="image/png, image/jpeg, image/jpg, video/*"
            className="hidden"
            onChange={onMediaUpload}
            disabled={uploadedMedia.length > 0 || isUploading}
          />
        </div>

        {/* Instagram media warning */}
        {selectedPlatforms.includes("instagram") && uploadedMedia.length === 0 && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
            <div className="text-chart-4 text-sm">⚠️ Instagram requires at least one image or video</div>
          </div>
        )}

        {/* Uploaded Media Preview */}
        {(uploadedMedia.length > 0 || isUploading) && (
          <div className="space-y-3">
            {uploadedMedia.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedMedia.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.mediaType === "video" ? (
                      <video src={file.preview} className="h-24 w-24 object-cover rounded-md" />
                    ) : (
                      <img src={file.preview} alt={file.name} className="h-24 w-24 object-cover rounded-md" />
                    )}
                    {deletingMediaId === file.id ? (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onMediaRemove(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Uploading media...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <AIDescriptionModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSelect={(description) => {
          onContentChange(description);
          setIsAIModalOpen(false);
        }}
      />
    </Card>
  );
};
