import React, { useState, useEffect, useRef, Suspense } from "react";
import { Card, CardContent } from "../ui/card";
import {
  MessageCircle,
  Bot,
  Menu,
  X,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  User,
  Loader2,
  Plus,
  Tag,
} from "lucide-react";
import { Button } from "../ui/button";
// import { ScrollArea } from "../ui/scroll-area";
// import { PromptBox } from "../ui/chatgpt-prompt-input";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../ui/alert-dialog";
import { useChat } from "../../hooks/useChat";
// import { ChatMessageRenderer } from "./ChatMessageRenderer";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { lazyImport } from "@/utils/lazyImport";

// Lazy-loaded components
const ScrollArea = lazyImport(() =>
  import("../ui/scroll-area").then((mod) => ({ default: mod.ScrollArea }))
);
const PromptBox = lazyImport(() =>
  import("../ui/chatgpt-prompt-input").then((mod) => ({
    default: mod.PromptBox,
  }))
);
const ChatMessageRenderer = lazyImport(() =>
  import("./ChatMessageRenderer").then((mod) => ({
    default: mod.ChatMessageRenderer,
  }))
);
const AlertDialog = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({ default: mod.AlertDialog }))
);
const AlertDialogContent = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogContent,
  }))
);
const AlertDialogHeader = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogHeader,
  }))
);
const AlertDialogTitle = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogTitle,
  }))
);
const AlertDialogDescription = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogDescription,
  }))
);
const AlertDialogFooter = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogFooter,
  }))
);
const AlertDialogCancel = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogCancel,
  }))
);
const AlertDialogAction = lazyImport(() =>
  import("../ui/alert-dialog").then((mod) => ({
    default: mod.AlertDialogAction,
  }))
);
interface AIChatbotContentProps {
  keyword?: string;
  keywordId?: string;
  projectId?: string;
}
export const AIChatbotContent: React.FC<AIChatbotContentProps> = ({
  keyword,
  keywordId,
  projectId,
}) => {
  const { t } = useI18nNamespace("AIChatbot/aiChatbotContent");
  const [showHistory, setShowHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);
  const {
    messages,
    chatHistory,
    currentSession,
    isLoading,
    isLoadingHistory,
    isLoadingMessages,
    isDeleting,
    sendMessage,
    handleCopy,
    handleGoodResponse,
    handleBadResponse,
    loadChatSession,
    deleteChatHistory,
    startNewChat,
  } = useChat(keywordId, projectId);

  useEffect(() => {
    // Only scroll to bottom when new messages are added, not when existing messages are updated
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Set initial sidebar state on mount
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    setShowHistory(isDesktop);
  }, []);

  // Automatically show sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop) {
        setShowHistory(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleSidebar = () => setShowHistory((prev) => !prev);
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };
  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (sessionToDelete) {
      await deleteChatHistory(sessionToDelete);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };
  return (
    <div className="h-full flex flex-col lg:flex-row relative">
      {/* Chat History Panel */}
      <div
        className={`${
          showHistory ? "lg:w-60 w-full" : "w-0"
        } transition-all duration-300 overflow-hidden lg:border-r border-b lg:border-b-0 bg-white lg:relative absolute lg:z-auto z-50 lg:h-auto h-full`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {t("aiChatbotContent.sidebar.title")}
              </h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewChat}
                  className="h-8 w-8 p-0"
                  title={t("aiChatbotContent.sidebar.newChat")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="p-4 text-center text-gray-500">
                Loading History...
              </div>
            }
          >
            <ScrollArea className="flex-1 p-3 max-h-[85vh] overflow-y-auto ">
              <div className="space-y-2">
                {isLoadingHistory ? (
                  <div className="text-center py-8 text-gray-500">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">
                      {t("aiChatbotContent.sidebar.loadingHistory")}
                    </p>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {t("aiChatbotContent.sidebar.noHistory")}
                    </p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => loadChatSession(chat)}
                      className={`group p-3 rounded-lg hover:bg-gray-50 cursor-pointer border transition-colors ${
                        currentSession?.id === chat.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {chat.timestamp}
                          </p>
                          {chat.lastMessage && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {chat.lastMessage.length > 60
                                ? chat.lastMessage.substring(0, 60) + "..."
                                : chat.lastMessage}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(chat.chat_session_id);
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting &&
                          sessionToDelete === chat.chat_session_id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Suspense>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen lg:h-auto bg-background dark:bg-[#212121]">
        {/* Header Section */}
        <div className="flex-shrink-0 px-4 py-[11px] border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 mr-1 sm:mr-2"
              title={
                showHistory
                  ? t("aiChatbotContent.sidebar.hideHistory")
                  : t("aiChatbotContent.sidebar.showHistory")
              }
            >
              <Menu className="h-4 w-4" />
            </Button>
            {/* {!showHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 w-8 p-0 mr-1 sm:mr-2 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
             )} */}
            <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-1xl font-bold text-gray-900 truncate">
                {t("aiChatbotContent.mainChat.title")}
              </h1>
            </div>
            {keyword && (
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                <Tag className="h-3 w-3" />
                <span className="truncate max-w-20 sm:max-w-none">
                  {decodeURIComponent(keyword)}
                </span>
              </div>
            )}
          </div>
          {/* Mobile keyword display */}
          {keyword && (
            <div className="sm:hidden mt-2 flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium w-fit">
              <Tag className="h-3 w-3" />
              <span className="truncate max-w-32">
                {decodeURIComponent(keyword)}
              </span>
            </div>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 min-h-0">
          <Suspense
            fallback={
              <div className="text-center p-4">Loading Messages...</div>
            }
          >
            <ScrollArea className="h-full">
              <div className="w-[100%] mx-auto p-3 sm:p-4 overflow-auto h-[70vh] lg:p-6 space-y-4 lg:space-y-6">
                {isLoadingMessages ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] text-center">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 animate-spin text-blue-500" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t("aiChatbotContent.mainChat.loadingMessages")}
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] text-center px-4">
                    <Bot className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 mb-3 sm:mb-4" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {t("aiChatbotContent.mainChat.welcomeTitle")}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-sm sm:max-w-md">
                      {t("aiChatbotContent.mainChat.welcomeDescription")}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 sm:gap-4 ${
                        message.type === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}

                      {/* Message Content */}
                      <div
                        className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                          message.type === "user" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-3 sm:p-4 rounded-lg max-w-[600px] ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : message.error
                              ? "bg-destructive/10 text-destructive border border-destructive/20"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.isLoading ? (
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              {t("aiChatbotContent.mainChat.aiThinking")}
                            </div>
                          ) : (
                            <ChatMessageRenderer
                              content={message.content}
                              className="text-xs sm:text-sm leading-5 sm:leading-6"
                            />
                          )}
                        </div>

                        {/* Action Buttons for AI messages */}
                        {message.type === "ai" &&
                          !message.isLoading &&
                          message.id && (
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(message.content)}
                                className="h-8 px-2 text-xs hover:bg-accent"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                {t("aiChatbotContent.actions.copy")}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGoodResponse(message.id)}
                                disabled={message.isSubmittingFeedback}
                                className={`h-8 px-2 text-xs hover:bg-accent ${
                                  message.feedback === "good"
                                    ? "bg-green-100 text-green-600 hover:bg-green-100"
                                    : "hover:text-green-600"
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {t("aiChatbotContent.actions.good")}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBadResponse(message.id)}
                                disabled={message.isSubmittingFeedback}
                                className={`h-8 px-2 text-xs hover:bg-accent ${
                                  message.feedback === "bad"
                                    ? "bg-red-100 text-red-600 hover:bg-red-100"
                                    : "hover:text-red-600"
                                }`}
                              >
                                <ThumbsDown className="w-3 h-3 mr-1" />
                                {t("aiChatbotContent.actions.bad")}
                              </Button>
                            </div>
                          )}

                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.type === "user" ? "text-right" : ""
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                      <div ref={messagesEndRef} />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Suspense>
        </div>

        {/* Chat Input Area */}
        <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-t bg-background dark:bg-[#212121]">
          <div className="w-full max-w-2xl mx-auto">
            <Suspense fallback={<div>Loading Input...</div>}>
              <PromptBox
                onSendMessage={handleSendMessage}
                disabled={isLoading}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Suspense fallback={<div>Loading Dialog...</div>}>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("aiChatbotContent.deleteDialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("aiChatbotContent.deleteDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("aiChatbotContent.deleteDialog.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("aiChatbotContent.deleteDialog.deleting")}
                  </>
                ) : (
                  t("aiChatbotContent.deleteDialog.delete")
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Suspense>
    </div>
  );
};
