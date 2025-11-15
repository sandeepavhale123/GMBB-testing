import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  CheckCircle,
  Clock,
  PlayCircle,
  RefreshCw,
  Star,
  MapPin,
  Image,
  MessageSquare,
  FileText,
  BarChart3,
  Zap,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { PageBreadcrumb } from "../Header/PageBreadcrumb";
import { SafeHtmlRenderer } from "../ui/safe-html-renderer";
import {
  useCompleteAiTask,
  usePendingAiTask,
  useTransformedAiTasks,
} from "../../hooks/useAiTask";
import { AiTask } from "../../api/aitaskApi";
import { useListingContext } from "../../context/ListingContext";
import { toast } from "@/hooks/use-toast";
import { isEqual } from "lodash";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const statusIcons = {
  pending: Clock,
  "in-progress": PlayCircle,
  completed: CheckCircle,
  due: Clock,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  due: "bg-yellow-100 text-yellow-800 border-yellow-200", // fallback
};

const typeColors = {
  "one-time": "bg-purple-100 text-purple-800 border-purple-200",
  recurring: "bg-blue-100 text-blue-800 border-blue-200",
};

const categoryIcons = {
  seo: BarChart3,
  content: FileText,
  reviews: Star,
  insights: BarChart3,
  listings: MapPin,
};

export const AITaskManagerPage: React.FC = () => {
  const { t } = useI18nNamespace("AITaskManager/AITaskManagerPage");
  const { selectedListing } = useListingContext();
  const { tasks, stats, isLoading, error, refetch } = useTransformedAiTasks({
    listingId: selectedListing?.id ? Number(selectedListing.id) : undefined,
  });
  const { mutateAsync: completeTask } = useCompleteAiTask();
  const { mutateAsync: pendingTask } = usePendingAiTask();
  const [localTasks, setLocalTasks] = useState<AiTask[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  //  Update local tasks when API data changes
  React.useEffect(() => {
    const normalizedTasks = tasks.map((t) =>
      t.status === "due" ? { ...t, status: "pending" as const } : t
    );

    if (!isEqual(localTasks, normalizedTasks)) {
      setLocalTasks(normalizedTasks);
    }
  }, [tasks]);

  const handleMarkCompleted = async (taskId: string | number) => {
    if (!selectedListing?.id) return;

    try {
      const response = await completeTask({
        taskId,
        listingId: Number(selectedListing.id),
      });
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "completed" as const } : t
        )
      );
      if (!response.ok) {
        toast({
          title: t("AITaskManagerPage.toasts.error.title"),
          description: response.message || response.data.message,
          variant: "default",
        });
      }
      toast({
        title: t("AITaskManagerPage.toasts.success.title"),
        description: response.message,
      });
    } catch (err) {
      // console.error("Failed to complete task", err);
    }
  };
  const handleRevertTask = async (taskId: string | number) => {
    if (!selectedListing?.id) return;
    try {
      const response = await pendingTask({
        taskId,
        listingId: Number(selectedListing.id),
      });
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "pending" as const } : t
        )
      );
      if (!response.ok) {
        toast({
          title: t("AITaskManagerPage.toasts.error.title"),
          description:
            response.message ||
            response.data.message ||
            t("AITaskManagerPage.toasts.error.default"),
          variant: "destructive",
        });
      }
      toast({
        title: t("AITaskManagerPage.toasts.reverted.title"),
        description:
          response.message || t("AITaskManagerPage.toasts.reverted.message"),
      });
    } catch (error) {
      //
    }
  };

  const handleFixTask = (url: string, target: string) => {
    if (!url) return;

    const isExternalUrl =
      url.startsWith("http://") || url.startsWith("https://");

    if (isExternalUrl) {
      if (target === "_blank") {
        window.open(url, "_blank");
      } else {
        window.location.href = url; // full page redirect for same tab external
      }
    } else {
      navigate(url); // internal routing
    }
  };
  const filterTasks = (filter: string) => {
    switch (filter) {
      case "pending":
        return localTasks.filter((task) => task.status === "pending");
      case "in-progress":
        return localTasks.filter((task) => task.status === "in-progress");
      case "completed":
        return localTasks.filter((task) => task.status === "completed");
      case "recurring":
        return localTasks.filter((task) => task.type === "recurring");
      case "high-priority":
        return localTasks.filter((task) => task.priority === "high");
      default:
        return localTasks;
    }
  };

  const filteredTasks = filterTasks(activeTab);

  const TaskCard: React.FC<{ task: AiTask }> = ({ task }) => {
    const StatusIcon = statusIcons[task.status] ?? AlertCircle; // fallback
    const CategoryIcon = categoryIcons[task.category] ?? FileText; // fallback

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Title and Description Row */}
          <div className="flex items-start gap-3 mb-3">
            <CategoryIcon className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {task.task_name}
              </h3>
              <SafeHtmlRenderer
                html={task.task_description}
                className="text-gray-600 text-sm leading-relaxed"
              />
              {task.frequency && (
                <p className="text-xs text-gray-500 mt-1">
                  {t("AITaskManagerPage.task.frequency", {
                    value: task.frequency,
                  })}
                  {/* Frequency: {task.frequency} */}
                </p>
              )}
            </div>
          </div>

          {/* Status, Type and Actions Row */}
          <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[task.status]} variant="outline">
                <StatusIcon className="w-3 h-3 mr-1" />
                {t(`AITaskManagerPage.task.status.${task.status}`)}
                {/* {task.status.replace("-", " ")} */}
              </Badge>
              <Badge className={typeColors[task.type]} variant="outline">
                {t(`AITaskManagerPage.task.type.${task.type}`)}
                {/* {task.type}... */}
              </Badge>
              {task.priority === "high" && (
                <Badge variant="destructive" className="text-xs">
                  {t("AITaskManagerPage.task.priority.high")}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {task.status !== "completed" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFixTask(task.url, task.target)}
                    disabled={task.status === "in-progress"}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    {task.status === "in-progress"
                      ? t("AITaskManagerPage.task.actions.inProgress")
                      : t("AITaskManagerPage.task.actions.fix")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleMarkCompleted(task.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t("AITaskManagerPage.task.actions.markCompleted")}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleRevertTask(task.id)}
                  className="bg-red-200 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  {t("AITaskManagerPage.task.actions.revert")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("AITaskManagerPage.loading.title")}
            </h3>
            <p className="text-gray-500">
              {" "}
              {t("AITaskManagerPage.loading.description")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No listing ID
  if (!selectedListing) {
    return (
      <div className="space-y-6">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {t("AITaskManagerPage.noListing.message")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const pendingCount = localTasks.filter((t) => t.status === "pending").length;
  const inProgressCount = localTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const completedCount = localTasks.filter(
    (t) => t.status === "completed"
  ).length;
  const oneTimeCount = localTasks.filter((t) => t.type === "one-time").length;
  const recurringCount = localTasks.filter(
    (t) => t.type === "recurring"
  ).length;
  const highPriorityCount = localTasks.filter(
    (t) => t.priority === "high" && t.status !== "completed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              {t("AITaskManagerPage.summaryCards.pending")}
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {stats.due}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              {t("AITaskManagerPage.summaryCards.completed")}
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-green-500 to-green-600">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              {t("AITaskManagerPage.summaryCards.oneTime")}
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-purple-500 to-purple-600">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {stats["one-time"]}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              {t("AITaskManagerPage.summaryCards.recurring")}
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {stats.recurring}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-max">
          <TabsTrigger value="pending">
            {t("AITaskManagerPage.tabs.pending", { count: pendingCount })}
            {/* Pending ({pendingCount}) */}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t("AITaskManagerPage.tabs.completed", { count: completedCount })}
            {/* Completed ({completedCount}) */}
          </TabsTrigger>
          <TabsTrigger value="all">
            {t("AITaskManagerPage.tabs.all", { count: localTasks.length })}
            {/* All Tasks ({localTasks.length}) */}
          </TabsTrigger>
          <TabsTrigger value="recurring">
            {t("AITaskManagerPage.tabs.recurring", { count: recurringCount })}
            {/* Recurring ({recurringCount}) */}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("AITaskManagerPage.emptyState.title")}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "completed"
                    ? t("AITaskManagerPage.emptyState.completedMessage")
                    : t("AITaskManagerPage.emptyState.defaultMessage")}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
