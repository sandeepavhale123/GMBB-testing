import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BuyCreditsModal } from "@/components/credits_modal";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Share,
  Trash2,
  Users,
  Target,
  Calendar,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useGeoProjects } from "../hooks/useGeoProjects";
import type { GeoProject } from "../types";
import {
  comprehensiveCleanup,
  startBodyStyleObserver,
  stopBodyStyleObserver,
} from "@/utils/domUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const Dashboard: React.FC = () => {
  const { t } = useI18nNamespace("Geo-Ranking-module-pages/Dashboard");
  const navigate = useNavigate();
  const {
    projects,
    pagination,
    summary,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
    currentPage,
    searchTerm,
    handlePageChange,
    handleSearchChange,
  } = useGeoProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState<GeoProject | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    notificationEmail: "",
  });
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<GeoProject | null>(
    null
  );
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const handleCreateProject = () => {
    if (isEditMode && editingProject) {
      updateProject({
        projectId: parseInt(editingProject.id),
        projectName: newProject.name,
        emails: newProject.notificationEmail,
      });
    } else {
      createProject({
        projectName: newProject.name,
        emails: newProject.notificationEmail,
      });
    }
    setNewProject({
      name: "",
      notificationEmail: "",
    });
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditingProject(null);
  };
  const handleEditProject = (project: GeoProject) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      notificationEmail: project.notificationEmail,
    });
    setIsEditMode(true);
    setShowCreateModal(true);
  };
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditingProject(null);
    setNewProject({
      name: "",
      notificationEmail: "",
    });
  };
  const handleDeleteClick = (project: GeoProject) => {
    setProjectToDelete(project);
    setDeleteConfirmText("");
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    if (projectToDelete && deleteConfirmText === "delete") {
      deleteProject({
        projectId: parseInt(projectToDelete.id),
        confirm: "delete",
      });
      setShowDeleteDialog(false);
      setProjectToDelete(null);
      setDeleteConfirmText("");
      // Immediate cleanup after successful deletion
      comprehensiveCleanup();
      // Additional delayed cleanup
      setTimeout(() => {
        comprehensiveCleanup();
      }, 300);
    }
  };
  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setProjectToDelete(null);
    setDeleteConfirmText("");
    // Force comprehensive cleanup of body styles after dialog closes
    setTimeout(() => {
      comprehensiveCleanup();
    }, 200);
  };

  // Additional safety cleanup when dialog state changes
  useEffect(() => {
    if (!showDeleteDialog) {
      setTimeout(() => {
        comprehensiveCleanup();
      }, 100);
    }
  }, [showDeleteDialog]);

  // Start MutationObserver as backup cleanup monitor
  useEffect(() => {
    startBodyStyleObserver();
    return () => {
      stopBodyStyleObserver();
    };
  }, []);
  const summaryCards = [
    {
      title: t("dashboard.summary.noOfProject"),
      value: summary?.totalProjects || 0,
      icon: Users,
      color: "text-blue-500",
      iconBgColor: "bg-blue-500",
    },
    {
      title: t("dashboard.summary.noOfKeywords"),
      value: summary?.totalKeywords || 0,
      icon: Target,
      color: "text-green-500",
      iconBgColor: "bg-green-500",
    },
    {
      title: t("dashboard.summary.noOfScheduledScan"),
      value: summary?.scheduledScans || 0,
      icon: Calendar,
      color: "text-orange-500",
      iconBgColor: "bg-orange-500",
    },
    {
      title: t("dashboard.summary.availableCredits"),
      value: summary
        ? t("dashboard.summary.creditsRemaining", {
            remaining: summary.availableCredits.toLocaleString(),
            total: summary.allowedCredits.toLocaleString(),
          })
        : // `${summary.availableCredits.toLocaleString()} remaining of ${summary.allowedCredits.toLocaleString()} total`
          "0 remaining of 0 total",
      icon: CreditCard,
      color: "text-purple-500",
      iconBgColor: "bg-purple-500",
    },
  ];
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.header.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("dashboard.header.description")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Buy Credits Button */}
          <Button
            onClick={() => setShowBuyCreditsModal(true)}
            variant="outline"
            className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-950"
          >
            <CreditCard className="w-4 h-4 mr-1" />
            {t("dashboard.buttons.buy")}
          </Button>

          {/* Create New Project Dialog */}
          <Dialog
            open={showCreateModal}
            onOpenChange={(open) => {
              if (!open) {
                handleCloseModal();
              } else {
                setShowCreateModal(true);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t("dashboard.buttons.createProject")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode
                    ? t("dashboard.dialog.edit")
                    : t("dashboard.dialog.createNew")}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? t("dashboard.dialog.descEdit")
                    : t("dashboard.dialog.descCreate")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">
                    {t("dashboard.dialog.projectName")}
                  </Label>
                  <Input
                    id="project-name"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        name: e.target.value,
                      })
                    }
                    placeholder={t(
                      "dashboard.dialog.placeholder.enterProjectName"
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="notification-email">
                    {" "}
                    {t("dashboard.dialog.notificationEmail")}
                  </Label>
                  <Input
                    id="notification-email"
                    type="email"
                    value={newProject.notificationEmail}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        notificationEmail: e.target.value,
                      })
                    }
                    placeholder={t("dashboard.dialog.placeholder.enterEmails")}
                  />
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCloseModal}>
                    {t("dashboard.buttons.cancel")}
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={
                      !newProject.name ||
                      !newProject.notificationEmail ||
                      isCreating ||
                      isUpdating
                    }
                  >
                    {(isCreating || isUpdating) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEditMode
                      ? t("dashboard.buttons.updateProject")
                      : t("dashboard.buttons.createProject")}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          // Special layout for Credits card
          if (card.title === t("dashboard.summary.availableCredits")) {
            const remainingCredits = summary?.availableCredits || 0;
            const totalCredits = summary?.allowedCredits || 0;
            const progressPercentage =
              totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 0;
            return (
              <div
                key={card.title}
                className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-medium text-gray-600">
                      {t("dashboard.summary.availableCredits")}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {remainingCredits.toLocaleString()}{" "}
                    </div>
                  </div>
                  <div
                    className={`${card.iconBgColor} rounded-lg p-3 flex items-center justify-center ml-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          }

          // Default layout for other cards
          return (
            <div
              key={card.title}
              className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">
                    {card.title}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </div>
                </div>
                <div
                  className={`${card.iconBgColor} rounded-lg p-3 flex items-center justify-center ml-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("dashboard.table.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-border bg-gray-50 ">
                  <th className="text-left py-3 px-4 font-medium ">
                    {t("dashboard.table.projectName")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium ">
                    {t("dashboard.table.noOfKeywords")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium ">
                    {t("dashboard.table.date")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium ">
                    {t("dashboard.table.notificationEmail")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium ">
                    {t("dashboard.table.action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <div className="text-muted-foreground">
                        {isLoading
                          ? t("dashboard.table.loadingProjects")
                          : t("dashboard.table.noProjectsFound")}
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-medium text-primary cursor-pointer hover:text-primary/80 transition-colors"
                            onClick={() =>
                              navigate(
                                `/module/geo-ranking/view-project-keywords/${project.id}`
                              )
                            }
                          >
                            {project.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {project.numberOfChecks}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {project.createdDate}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex flex-col gap-1">
                          {project.notificationEmail &&
                          project.notificationEmail.trim() !== "" &&
                          !project.notificationEmail.includes(
                            "No email provided"
                          ) ? (
                            project.notificationEmail
                              .split(",")
                              .map((email, idx) => (
                                <span key={idx}>{email.trim()}</span>
                              ))
                          ) : (
                            <span>{t("dashboard.table.noEmailProvided")}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/module/geo-ranking/view-project-keywords/${project.id}`
                                )
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {t("dashboard.buttons.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProject(project)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              {t("dashboard.buttons.edit")}
                            </DropdownMenuItem>
                            {project.numberOfChecks > 0 && (
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/sharable-geo-ranking-report/${project.encKey}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Share className="w-4 h-4 mr-1" />
                                {t("dashboard.table.shareablelink")}
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(project)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t("dashboard.alerts.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-6 pt-4 border-t border-border p-4 ">
              <div className="text-sm text-muted-foreground flex-1 max-w[200px]">
                {t("dashboard.pagination.showing", {
                  from: (currentPage - 1) * pagination.limit + 1,
                  to: Math.min(
                    currentPage * pagination.limit,
                    pagination.total
                  ),
                  total: pagination.total,
                })}
                {/* Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
                {pagination.total} projects */}
              </div>

              <Pagination className="flex justify-end max-w-[300px] w-full sm:w-auto overflow-x-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from(
                    {
                      length: Math.min(3, pagination.totalPages),
                    },
                    (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage <= 2) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 1) {
                        pageNum = pagination.totalPages - 2 + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {pagination.totalPages > 3 &&
                    currentPage < pagination.totalPages - 1 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() =>
                              handlePageChange(pagination.totalPages)
                            }
                            className="cursor-pointer"
                          >
                            {pagination.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage >= pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDeleteDialog();
            // Additional cleanup when dialog closes via onOpenChange
            setTimeout(() => {
              comprehensiveCleanup();
            }, 250);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.table.deleteConfirmationTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.table.deleteConfirmationDescription", {
                name: projectToDelete?.name,
              })}
              {/* This action cannot be undone. This will permanently delete the
              project "{projectToDelete?.name}" and all its related data
              including keywords and map points. */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-confirm">
                {t("dashboard.table.typeDeleteToConfirm")}
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t("dashboard.table.placeholderDelete")}
                className="mt-2"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              {t("dashboard.buttons.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteConfirmText !== "delete" || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("dashboard.buttons.deleteProject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Buy Credits Modal */}
      <BuyCreditsModal
        open={showBuyCreditsModal}
        onOpenChange={setShowBuyCreditsModal}
      />
    </div>
  );
};
export default Dashboard;
