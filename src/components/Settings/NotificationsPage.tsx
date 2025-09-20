import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportNotificationsTab } from "./ReportNotificationsTab";
import { CustomNotificationsTab } from "./CustomNotificationsTab";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const NotificationsPage: React.FC = () => {
  const { t } = useI18nNamespace("Settings/notificationsPage");
  const [activeTab, setActiveTab] = useState("report-notifications");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {t("notificationsPage.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("notificationsPage.description")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="report-notifications">
            {t("notificationsPage.tabs.reportNotifications")}
          </TabsTrigger>
          <TabsTrigger value="custom-notifications">
            {t("notificationsPage.tabs.customNotifications")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="report-notifications" className="mt-6">
          <ReportNotificationsTab />
        </TabsContent>

        <TabsContent value="custom-notifications" className="mt-6">
          <CustomNotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
