import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Plus,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PostManagementWidget: React.FC = () => {
  const { postStatus } = useAppSelector((state) => state.dashboard);
  const { t } = useI18nNamespace("Dashboard/postManagementWidget");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("postManagement.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("postManagement.description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Post Status Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {postStatus.live}
              </div>
              <div className="text-sm text-muted-foreground">
                {" "}
                {t("postManagement.status.live")}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {postStatus.scheduled}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("postManagement.status.scheduled")}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                {postStatus.failed}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("postManagement.status.failed")}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              {t("postManagement.actions.create")}
            </Button>
            <Button variant="outline" className="flex-1">
              <Settings className="w-4 h-4 mr-1" />
              {t("postManagement.actions.manage")}
            </Button>
          </div>

          {/* Status Indicators */}
          {postStatus.failed > 0 && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  {t("postManagement.alerts.failedPosts", {
                    count: postStatus.failed,
                  })}
                </span>
                <Badge variant="destructive" className="ml-auto">
                  {t("postManagement.alerts.actionRequired")}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
