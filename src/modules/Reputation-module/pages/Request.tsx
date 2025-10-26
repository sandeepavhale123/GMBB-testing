import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Mail, MessageSquare, Send, Eye, Inbox, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface Campaign {
  id: string;
  name: string;
  channel: "SMS" | "Email";
  status: "sent" | "pending" | "scheduled";
  date: string;
  contacts: number;
  delivered: number | null;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Winter Blvd",
    channel: "SMS",
    status: "sent",
    date: "25/08/2025",
    contacts: 85,
    delivered: 68,
  },
  {
    id: "2",
    name: "Holiday Fee",
    channel: "Email",
    status: "pending",
    date: "25/08/2025",
    contacts: 115,
    delivered: null,
  },
  {
    id: "3",
    name: "Q1 Customer",
    channel: "SMS",
    status: "sent",
    date: "25/08/2025",
    contacts: 352,
    delivered: 70,
  },
  {
    id: "4",
    name: "Spring Rev",
    channel: "SMS",
    status: "scheduled",
    date: "25/08/2025",
    contacts: 21,
    delivered: null,
  },
];

export const Request: React.FC = () => {
  const { t } = useTranslation("Reputation/request");
  const [activeTab, setActiveTab] = useState("campaign");
  const isMobile = useIsMobile(1024);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getChannelIcon = (channel: "SMS" | "Email") => {
    return channel === "SMS" ? (
      <MessageSquare className="w-4 h-4" />
    ) : (
      <Mail className="w-4 h-4" />
    );
  };

  const getStatusBadgeClass = (status: Campaign["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "";
    }
  };

  const calculateDelivered = (delivered: number | null, contacts: number) => {
    if (delivered === null) return "-";
    return `${Math.round((delivered / contacts) * 100)}%`;
  };

  const handleCreateCampaign = () => {
    toast.info("Campaign creation coming soon");
  };

  const handleViewCampaign = (campaignName: string) => {
    toast.info(`Campaign details view coming soon for "${campaignName}"`);
  };

  const tabItems = [
    { value: "campaign", label: t("tabs.campaign") },
    { value: "templates", label: t("tabs.templates") },
    { value: "contacts", label: t("tabs.contacts") },
  ];

  const TabNavigation = () => (
    <nav className="space-y-1">
      {tabItems.map((item) => {
        const isActive = activeTab === item.value;
        return (
          <button
            key={item.value}
            onClick={() => {
              setActiveTab(item.value);
              if (isMobile) setIsSheetOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-start ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  const renderTabContent = () => {
    if (activeTab === "campaign") {
      return mockCampaigns.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Inbox className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {t("empty.title")}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t("empty.description")}
              </p>
              <Button onClick={handleCreateCampaign}>
                {t("empty.button")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">
                      {t("table.name")}
                    </TableHead>
                    <TableHead className="font-medium">
                      {t("table.channel")}
                    </TableHead>
                    <TableHead className="font-medium">
                      {t("table.status")}
                    </TableHead>
                    <TableHead className="font-medium">
                      {t("table.date")}
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      {t("table.contacts")}
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      {t("table.delivered")}
                    </TableHead>
                    <TableHead className="text-center font-medium">
                      {t("table.action")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCampaigns.map((campaign) => (
                    <TableRow
                      key={campaign.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {campaign.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(campaign.channel)}
                          <span>{t(`channel.${campaign.channel.toLowerCase()}`)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(campaign.status)}
                        >
                          {t(`status.${campaign.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.date}</TableCell>
                      <TableCell className="text-right">
                        {campaign.contacts}
                      </TableCell>
                      <TableCell className="text-right">
                        {calculateDelivered(
                          campaign.delivered,
                          campaign.contacts
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCampaign(campaign.name)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t("actions.view")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Templates and Contacts tabs - Coming Soon
    return (
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {t("comingSoon.title")}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("comingSoon.description")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Send className="w-4 h-4 mr-2" />
          {t("createButton")}
        </Button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 bg-white border border-border rounded-lg lg:hidden">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {t("title")}
              </h3>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("title")}
                  </h3>
                </div>
                <TabNavigation />
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            className="w-48 bg-white border border-border rounded-lg p-4"
            style={{ minWidth: "192px" }}
          >
            <TabNavigation />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 bg-white border border-border rounded-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
