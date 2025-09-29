import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  ChevronDown,
  Bot,
  FileText,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BulkReplyListingSelector } from "./BulkReplyListingSelector";
import { useCreateBulkTemplateProjectMutation } from "@/api/bulkAutoReplyApi";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export interface CreateAutoReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAutoReplyModal: React.FC<CreateAutoReplyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useI18nNamespace("BulkAutoReply/createAutoReplyModal");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createBulkTemplateProject, { isLoading }] =
    useCreateBulkTemplateProjectMutation();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [replyType, setReplyType] = useState<"ai" | "template" | "dnr">("ai");

  // AI Settings
  const [aiTone, setAiTone] = useState("professional");
  const [aiResponseLength, setAiResponseLength] = useState("medium");
  const [aiIncludePromotions, setAiIncludePromotions] = useState(false);

  // Conflict detection state
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictingListings, setConflictingListings] = useState<
    { name: string; setting_type: string }[]
  >([]);
  const [listingOptions, setListingOptions] = useState<any[]>([]);

  // Listing selection state
  const [listingSearch, setListingSearch] = useState("");
  const [isListingDropdownOpen, setIsListingDropdownOpen] = useState(false);
  const collapsibleRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        collapsibleRef.current &&
        !collapsibleRef.current.contains(event.target as Node)
      ) {
        setIsListingDropdownOpen(false);
      }
    };

    if (isListingDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isListingDropdownOpen]);

  const checkForConflicts = () => {
    const conflicts: { name: string; setting_type: string }[] = [];

    selectedListings.forEach((listingId) => {
      const listing = listingOptions.find((opt) => opt.id === listingId);
      if (listing && listing.setting_type && listing.setting_type !== "") {
        conflicts.push({
          name: listing.name,
          setting_type: listing.setting_type,
        });
      }
    });

    return conflicts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.projectName"),
        variant: "destructive",
      });
      return;
    }

    if (selectedListings.length === 0) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.selectListing"),
        variant: "destructive",
      });
      return;
    }

    // Check for conflicts
    const conflicts = checkForConflicts();
    if (conflicts.length > 0) {
      setConflictingListings(conflicts);
      setShowConflictDialog(true);
      return;
    }

    await createProject();
  };

  const createProject = async () => {
    try {
      const response = await createBulkTemplateProject({
        listingIds: selectedListings,
        project_name: projectName,
        type: replyType,
      }).unwrap();

      toast({
        title: t("toast.success.title"),
        description: t("toast.success.created"),
        variant: "default",
      });

      // Redirect to project details page
      navigate(
        `/main-dashboard/bulk-auto-reply-project-details/${response.data.projectId}`
      );

      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Error creating project:", error);

      // Extract the error message from the API response
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("toast.error.createProject");

      toast({
        title: t("toast.error.title"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRemoveConflictListing = (
    e: React.MouseEvent,
    listingId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove from selected listings
    const updatedSelectedListings = selectedListings.filter(
      (id) => id !== listingId
    );
    setSelectedListings(updatedSelectedListings);

    // Remove from conflicting listings display
    const updatedConflictingListings = conflictingListings.filter((listing) => {
      const listingOption = listingOptions.find(
        (opt) => opt.name === listing.name
      );
      return listingOption?.id !== listingId;
    });
    setConflictingListings(updatedConflictingListings);

    // If no more conflicts, close dialog
    if (updatedConflictingListings.length === 0) {
      setShowConflictDialog(false);
    }
  };

  const handleConflictContinue = async () => {
    setShowConflictDialog(false);
    try {
      await createProject();
      onClose(); // Close the main modal after successful project creation
    } catch (error) {
      // Error is already handled in createProject
    }
  };

  const resetForm = () => {
    setProjectName("");
    setSelectedListings([]);
    setReplyType("ai");
    setAiTone("professional");
    setAiResponseLength("medium");
    setAiIncludePromotions(false);
    setListingSearch("");
    setConflictingListings([]);
    setShowConflictDialog(false);
  };

  return (
    <>
      {/* Conflict Warning Dialog */}
      <AlertDialog open={showConflictDialog}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle className="text-destructive">
                {t("conflictDialog.title")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-foreground">
              <p className="mb-3">{t("conflictDialog.description")}</p>
              <div
                className="bg-muted rounded-md border p-3"
                style={{ maxHeight: "12.5rem", overflowY: "auto" }}
              >
                {conflictingListings.map((listing, index) => {
                  const listingOption = listingOptions.find(
                    (opt) => opt.name === listing.name
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-2 rounded hover:bg-background/50"
                    >
                      <span className="font-medium text-sm flex-1">
                        {listing.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {listing.setting_type.toUpperCase()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) =>
                            handleRemoveConflictListing(e, listingOption?.id)
                          }
                          className="h-6 w-6 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-sm">
                <strong>{t("conflictDialog.overrideInfo")}</strong>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConflictDialog(false)}>
              {t("conflictDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConflictContinue}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("conflictDialog.overrideContinue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Dialog */}
      <Dialog open={isOpen && !showConflictDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{t("dialog.title")}</DialogTitle>
                <DialogDescription>{t("dialog.description")}</DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Multi-select Listing Component */}
            <BulkReplyListingSelector
              selectedListings={selectedListings}
              onListingsChange={setSelectedListings}
              onOptionsChange={setListingOptions}
              error={
                selectedListings.length === 0
                  ? t("toast.error.selectListing")
                  : undefined
              }
            />

            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName">{t("labels.projectName")}</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={t("labels.projectPlaceholder")}
                required
              />
            </div>

            {/* Reply Type Selection */}
            <div className="space-y-3">
              <Label>{t("labels.replyType")}</Label>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                    replyType === "ai"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setReplyType("ai")}
                >
                  <div className="text-center space-y-2">
                    <Bot className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="text-sm font-medium">
                      {t("replyTypes.ai.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground hidden md:block">
                      {t("replyTypes.ai.description")}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                    replyType === "template"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setReplyType("template")}
                >
                  <div className="text-center space-y-2">
                    <FileText className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="text-sm font-medium">
                      {t("replyTypes.template.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground hidden md:block">
                      {t("replyTypes.template.description")}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                    replyType === "dnr"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setReplyType("dnr")}
                >
                  <div className="text-center space-y-2">
                    <Ban className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="text-sm font-medium">
                      {t("replyTypes.dnr.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground hidden md:block">
                      {t("replyTypes.dnr.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("dialog.close")}
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? t("dialog.creating") : t("dialog.createProject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
