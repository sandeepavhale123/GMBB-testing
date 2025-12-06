import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SelectAccountsCard } from "../components/create-post/SelectAccountsCard";
import { ComposePostCard } from "../components/create-post/ComposePostCard";
import { ScheduleOptionsCard } from "../components/create-post/ScheduleOptionsCard";
import { ActionButtonsCard } from "../components/create-post/ActionButtonsCard";
import { LivePreviewPanel } from "../components/create-post/LivePreviewPanel";
import { getMinCharacterLimit } from "../components/create-post/CharacterCounter";
import {
  useUploadMedia,
  useDeleteMedia,
  useCreatePost,
  useUpdatePost,
  useAvailableAccounts,
} from "../hooks/useSocialPoster";
import { Post } from "../types";
import { MediaItem } from "../types";
import { useProfile } from "@/hooks/useProfile";
import {
  convertUTCToUserTimezone,
  convertUserTimezoneToUTC,
} from "@/utils/dateUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface CreatePostProps {
  editMode?: boolean;
  postData?: any;
  postId?: string;
}
export const SocialPosterCreatePost: React.FC<CreatePostProps> = ({
  editMode = false,
  postData,
  postId,
}) => {
  const { t } = useI18nNamespace(["social-poster-pages/CreatePost"]);
  const navigate = useNavigate();
  const uploadMediaMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const [content, setContent] = useState(
    editMode && postData ? postData.content : ""
  );
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    editMode && postData
      ? postData.targets.map((t: any) => t.socialAccountId)
      : []
  );
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";
  const [scheduleEnabled, setScheduleEnabled] = useState(
    editMode && postData ? !!postData.scheduledFor : false
  );
  const [scheduledDate, setScheduledDate] = useState(
    editMode && postData && postData.scheduledFor
      ? (() => {
          const zonedDate = convertUTCToUserTimezone(
            postData.scheduledFor,
            userTimezone
          );
          return zonedDate.toISOString().split("T")[0];
        })()
      : ""
  );
  const [scheduledTime, setScheduledTime] = useState(
    editMode && postData && postData.scheduledFor
      ? (() => {
          const zonedDate = convertUTCToUserTimezone(
            postData.scheduledFor,
            userTimezone
          );
          return zonedDate.toISOString().split("T")[1].substring(0, 5);
        })()
      : ""
  );
  const [platformOptions, setPlatformOptions] = useState<
    Post["platformOptions"]
  >(editMode && postData ? postData.platformOptions || {} : {});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>(
    editMode && postData && postData.media
      ? postData.media.map((m: any) => ({
          id: m.id,
          mediaUrl: m.mediaUrl,
          mediaType: m.mediaType,
          thumbnailUrl: m.thumbnailUrl,
          preview: m.mediaUrl,
          name: "",
          fileSize: m.fileSize,
          mimeType: m.mimeType,
          width: m.width,
          height: m.height,
        }))
      : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const emojis = [
    "😀",
    "😂",
    "🥰",
    "😍",
    "🤩",
    "😎",
    "🔥",
    "💯",
    "👍",
    "🎉",
    "❤️",
    "💪",
    "🙌",
    "✨",
    "🌟",
    "⭐",
  ];

  // Fetch accounts to derive platforms
  const { data: accountsResponse } = useAvailableAccounts({
    status: "healthy",
  });
  const allAccounts = accountsResponse?.data?.accounts || [];

  // Derive selected platforms from selected accounts
  const selectedPlatforms = useMemo(() => {
    const platforms = allAccounts
      .filter((account) => selectedAccounts.includes(account.id))
      .map((account) => account.platform);
    return [...new Set(platforms)]; // Remove duplicates
  }, [selectedAccounts, allAccounts]);
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (uploadedMedia.length > 0) {
        toast.error(t("createPost.errors.onlyOneMedia"));
        e.target.value = "";
        return;
      }
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        toast.error(t("createPost.errors.invalidFile"));
        e.target.value = "";
        return;
      }
      setIsUploading(true);
      try {
        const response = await uploadMediaMutation.mutateAsync(file);
        const uploadedFile: MediaItem = {
          id: response.data.id,
          mediaUrl: response.data.mediaUrl,
          mediaType: response.data.mediaType,
          thumbnailUrl: response.data.thumbnailUrl,
          preview: URL.createObjectURL(file),
          name: file.name,
          fileSize: response.data.fileSize,
          mimeType: response.data.mimeType,
          width: response.data.width,
          height: response.data.height,
        };
        setUploadedMedia([uploadedFile]);
        toast.success(t("createPost.success.mediaUploaded"));
      } catch (error) {
        console.error("Failed to upload media:", error);
        toast.error(t("createPost.errors.uploadFailed"));
      } finally {
        setIsUploading(false);
      }
      e.target.value = "";
    }
  };
  const removeMedia = async (index: number) => {
    const mediaToRemove = uploadedMedia[index];
    if (mediaToRemove.id) {
      setDeletingMediaId(mediaToRemove.id);
    }
    if (mediaToRemove.id) {
      try {
        await deleteMediaMutation.mutateAsync(mediaToRemove.id);
        toast.success(t("createPost.success.mediaRemoved"));
      } catch (error) {
        console.error("Failed to delete media from backend:", error);
        toast.error(t("createPost.errors.removeFailed"));
      } finally {
        setDeletingMediaId(null);
      }
    }
    setUploadedMedia(uploadedMedia.filter((_, i) => i !== index));
    if (mediaToRemove.preview) {
      URL.revokeObjectURL(mediaToRemove.preview);
    }
  };
  const insertEmoji = (emoji: string) => {
    setContent(content + emoji);
    setShowEmojiPicker(false);
  };
  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      setContent(content + " " + linkMarkdown);
      setLinkUrl("");
      setLinkText("");
      setShowLinkDialog(false);
    }
  };
  const handleReset = () => {
    setContent("");
    setSelectedAccounts([]);
    setScheduleEnabled(false);
    setScheduledDate("");
    setScheduledTime("");
    setUploadedMedia([]);
    toast.success("Form reset");
  };
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error(t("createPost.errors.enterContent"));
      return;
    }
    if (selectedAccounts.length === 0) {
      toast.error(t("createPost.errors.selectAccount"));
      return;
    }
    const minLimit = getMinCharacterLimit(selectedPlatforms);
    if (minLimit !== Infinity && content.length > minLimit) {
      toast.error(
        t("createPost.errors.exceedsLimit", {
          limit: minLimit,
        })
      );
      return;
    }
    if (selectedPlatforms.includes("instagram") && uploadedMedia.length === 0) {
      toast.error(t("createPost.errors.instagramMediaRequired"));
      return;
    }
    if (scheduleEnabled && (!scheduledDate || !scheduledTime)) {
      toast.error(t("createPost.errors.scheduleMissing"));
      return;
    }
    try {
      let scheduledFor: string | undefined;
      if (scheduleEnabled && scheduledDate && scheduledTime) {
        const localDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const utcDateTime = convertUserTimezoneToUTC(
          localDateTime,
          userTimezone
        );
        scheduledFor = utcDateTime.toISOString();
      }
      const mediaIds = uploadedMedia
        .map((m) => m.id)
        .filter((id): id is string => id !== undefined);
      if (editMode && postId) {
        await updatePostMutation.mutateAsync({
          postId,
          data: {
            content,
            mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
            targetAccountIds: selectedAccounts,
            scheduledFor,
            platformOptions:
              Object.keys(platformOptions).length > 0
                ? platformOptions
                : undefined,
          },
        });
      } else {
        await createPostMutation.mutateAsync({
          content,
          mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
          targetAccountIds: selectedAccounts,
          scheduledFor,
          platformOptions:
            Object.keys(platformOptions).length > 0
              ? platformOptions
              : undefined,
        });
      }
      navigate("/social-poster/posts");
    } catch (error) {
      console.error(`Failed to ${editMode ? "update" : "create"} post:`, error);
    }
  };
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {editMode ? t("createPost.titleEdit") : t("createPost.titleCreate")}
          </h1>
          <p className="text-muted-foreground">{t("createPost.subtitle")}</p>
        </div>
      </div>

      {/* Two-panel Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Panel (70% - 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <SelectAccountsCard
            selectedAccounts={selectedAccounts}
            onSelectionChange={setSelectedAccounts}
          />

          <ComposePostCard
            content={content}
            onContentChange={setContent}
            selectedPlatforms={selectedPlatforms}
            uploadedMedia={uploadedMedia}
            isUploading={isUploading}
            deletingMediaId={deletingMediaId}
            onMediaUpload={handleMediaUpload}
            onMediaRemove={removeMedia}
            onEmojiClick={() => setShowEmojiPicker(true)}
            onLinkClick={() => setShowLinkDialog(true)}
          />

          <ScheduleOptionsCard
            enabled={scheduleEnabled}
            onEnabledChange={setScheduleEnabled}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            onDateChange={setScheduledDate}
            onTimeChange={setScheduledTime}
          />

          <ActionButtonsCard
            scheduleEnabled={scheduleEnabled}
            onReset={handleReset}
            onSubmit={handleSubmit}
            onPreview={() => setShowPreviewModal(true)}
            isSubmitting={
              createPostMutation.isPending || updatePostMutation.isPending
            }
            isUploading={isUploading}
            editMode={editMode}
          />
        </div>

        {/* Right Panel (30% - 4 columns) - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-4">
          <LivePreviewPanel
            content={content}
            media={uploadedMedia}
            selectedPlatforms={selectedPlatforms}
          />
        </div>
      </div>

      {/* Preview Modal (Mobile only) */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t("createPost.dialogs.previewTitle")}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <LivePreviewPanel
              content={content}
              media={uploadedMedia}
              selectedPlatforms={selectedPlatforms}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Emoji Picker Dialog */}
      <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createPost.dialogs.emojiPicker")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="lg"
                className="text-2xl h-12 w-12"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createPost.dialogs.linkDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("createPost.dialogs.linkDialogDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-text">
                {t("createPost.labels.linkText")}
              </Label>
              <Input
                id="link-text"
                placeholder={t("createPost.labels.placeholder")}
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="link-url">{t("createPost.labels.url")}</Label>
              <Input
                id="link-url"
                placeholder={t("createPost.labels.url-place")}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              {t("createPost.buttons.cancel")}
            </Button>
            <Button onClick={insertLink} disabled={!linkUrl || !linkText}>
              {t("createPost.buttons.insertLink")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
