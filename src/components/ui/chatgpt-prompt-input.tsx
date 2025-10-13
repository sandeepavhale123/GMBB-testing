// component.tsx
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  XIcon,
  Settings2Icon,
  SendIcon,
  HelpCircleIcon,
  RotateCcwIcon,
} from "./chatgpt-prompt-input/icons";
import { toolsList } from "./chatgpt-prompt-input/tools-data";
import { suggestedQuestionsData as fallbackSuggestedQuestionsData } from "./chatgpt-prompt-input/suggested-questions-data";
import { useChatQuestions } from "../../hooks/useChatQuestions";
import * as LucideIcons from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// --- Utility Function & Radix Primitives (Unchanged) ---
type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    showArrow?: boolean;
  }
>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "relative z-50 max-w-[280px] rounded-md bg-popover text-popover-foreground px-1.5 py-1 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {props.children}
      {showArrow && <TooltipPrimitive.Arrow className="-my-px fill-popover" />}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-xl bg-popover dark:bg-[#303030] p-2 text-popover-foreground dark:text-white shadow-md outline-none animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { t } = useI18nNamespace("UI/chatgpt_prompt_input");
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-transparent p-0 shadow-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        <div className="relative bg-card dark:bg-[#303030] rounded-[28px] overflow-hidden shadow-2xl p-1">
          {children}
          <DialogPrimitive.Close className="absolute right-3 top-3 z-10 rounded-full bg-background/50 dark:bg-[#303030] p-1 hover:bg-accent dark:hover:bg-[#515151] transition-all">
            <XIcon className="h-5 w-5 text-muted-foreground dark:text-gray-200 hover:text-foreground dark:hover:text-white" />
            <span className="sr-only">{t("close")}</span>
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

// --- The Final, Self-Contained PromptBox Component ---
interface PromptBoxProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSendMessage?: (message: string) => void;
}

export const PromptBox = React.forwardRef<HTMLTextAreaElement, PromptBoxProps>(
  ({ className, onSendMessage, ...props }, ref) => {
    const { t } = useI18nNamespace("UI/chatgpt_prompt_input");
    // ... all state and handlers are unchanged ...
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState("");
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
    const [isSuggestedQuestionsOpen, setIsSuggestedQuestionsOpen] =
      React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<
      string | null
    >(null);
    const {
      questions: suggestedQuestionsData,
      isLoading,
      error,
      retry,
    } = useChatQuestions();
    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);
    React.useLayoutEffect(() => {
      const textarea = internalTextareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value]);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      if (props.onChange) props.onChange(e);
    };
    const handlePlusClick = () => {
      fileInputRef.current?.click();
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      event.target.value = "";
    };
    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    const hasValue = value.trim().length > 0 || imagePreview;
    const activeTool = selectedTool
      ? toolsList.find((t) => t.id === selectedTool)
      : null;
    const ActiveToolIcon = activeTool?.icon;

    const handleQuestionSelect = (question: string) => {
      setValue(question);
      setIsSuggestedQuestionsOpen(false);
      setSelectedCategory(null);
    };

    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (hasValue && onSendMessage) {
        onSendMessage(value.trim());
        setValue("");
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleCategorySelect = (categoryTitle: string) => {
      setSelectedCategory(categoryTitle);
    };

    const handleBackToCategories = () => {
      setSelectedCategory(null);
    };

    const getIconComponent = (iconName: string) => {
      const iconKey = iconName
        .split("-")
        .map((word, index) =>
          index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

      const IconComponent = (LucideIcons as any)[iconKey];
      return IconComponent || LucideIcons.HelpCircle;
    };
    return (
      <div
        className={cn(
          "flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-white border dark:bg-[#303030] dark:border-transparent cursor-text",
          className
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {imagePreview && (
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            {" "}
            <div className="relative mb-1 w-fit rounded-[1rem] px-1 pt-1">
              {" "}
              <button
                type="button"
                className="transition-transform"
                onClick={() => setIsImageDialogOpen(true)}
              >
                {" "}
                <img
                  src={imagePreview}
                  alt={t("imagePreviewAlt")}
                  className="h-14.5 w-14.5 rounded-[1rem]"
                />{" "}
              </button>{" "}
              <button
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-white/50 dark:bg-[#303030] text-black dark:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151]"
                aria-label="Remove image"
              >
                {" "}
                <XIcon className="h-4 w-4" />{" "}
              </button>{" "}
            </div>{" "}
            <DialogContent>
              {" "}
              <img
                src={imagePreview}
                alt={t("fullSizePreviewAlt")}
                className="w-full max-h-[95vh] object-contain rounded-[24px]"
              />{" "}
            </DialogContent>{" "}
          </Dialog>
        )}

        <textarea
          ref={internalTextareaRef}
          rows={1}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-300 focus:ring-0 focus-visible:outline-none min-h-12"
          {...props}
        />

        <div className="mt-0.5 p-1 pt-0">
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-2">
              {/* Suggested Questions Button */}
              <Popover
                open={isSuggestedQuestionsOpen}
                onOpenChange={setIsSuggestedQuestionsOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-8 items-center gap-2 rounded-full p-2 text-sm text-foreground dark:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151] focus-visible:outline-none focus-visible:ring-ring"
                  >
                    <HelpCircleIcon className="h-4 w-4" />
                    {t("questions")}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  className="w-96 max-h-[28rem] overflow-y-auto bg-background dark:bg-[#2a2a2a] border border-border dark:border-gray-600 shadow-lg rounded-lg p-4"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {t("loadingQuestions")}
                      </span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-destructive mb-3">{error}</p>
                      <button
                        onClick={retry}
                        className="flex items-center gap-2 mx-auto px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        <RotateCcwIcon className="h-3 w-3" />
                        {t("retry")}
                      </button>
                    </div>
                  ) : !selectedCategory ? (
                    <div className="flex flex-col gap-2">
                      <h3 className="font-medium text-sm mb-2">
                        {t("selectCategory")}
                      </h3>
                      {suggestedQuestionsData.map((category) => {
                        const IconComponent = getIconComponent(category.icon);
                        return (
                          <button
                            key={category.title}
                            onClick={() => handleCategorySelect(category.title)}
                            className="flex w-full items-center gap-3 rounded-md p-3 text-left text-sm hover:bg-accent dark:hover:bg-[#515151] border border-border dark:border-gray-600"
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: category.color }}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {category.title}
                              </div>
                              <div className="text-xs text-muted-foreground dark:text-gray-400">
                                {category.count} questions
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={handleBackToCategories}
                          className="text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                        >
                          {t("back")}
                        </button>
                        <h3 className="font-medium text-sm">
                          {selectedCategory}
                        </h3>
                      </div>
                      {suggestedQuestionsData
                        .find((cat) => cat.title === selectedCategory)
                        ?.questions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuestionSelect(question)}
                            className="text-left text-sm p-2 rounded-md hover:bg-accent dark:hover:bg-[#515151] border border-border dark:border-gray-600"
                          >
                            {question}
                          </button>
                        ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* MODIFIED: Right-aligned buttons container */}
              <div className="ml-auto flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild></TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}>
                    <p>{t("recordVoice")}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!hasValue || props.disabled}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 disabled:bg-black/40 dark:disabled:bg-[#515151]"
                    >
                      <SendIcon className="h-6 w-6 text-bold" />
                      <span className="sr-only">{t("sendMessage")}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}>
                    <p>{t("send")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    );
  }
);
PromptBox.displayName = "PromptBox";
