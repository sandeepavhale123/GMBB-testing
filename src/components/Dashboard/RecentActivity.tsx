import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, Star, Image } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { cn } from "../../lib/utils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const RecentActivity: React.FC = () => {
  const { recentActivity } = useAppSelector((state) => state.dashboard);
  const { t } = useI18nNamespace("Dashboard/recentActivity");
  const getIcon = (type: string) => {
    switch (type) {
      case "post":
        return FileText;
      case "review":
        return Star;
      case "media":
        return Image;
      default:
        return FileText;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "post":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "review":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "media":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {" "}
          {t("recentActivity.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("recentActivity.subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div
                  className={cn(
                    "p-2 rounded-full",
                    getIconColor(activity.type)
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
