import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ChannelCard } from "@/modules/Reputation-module/components/ChannelCard";
import { QRCodeSection } from "@/modules/Reputation-module/components/QRCodeSection";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Setting: React.FC = () => {
  const { t } = useI18nNamespace("Reputation/setting");
  const [activeTab, setActiveTab] = useState("integration");
  const isMobile = useIsMobile(1024);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Mock channel data - replace with actual API integration later
  const channels = [
    {
      id: "twilio",
      name: t("integration.channels.twilio"),
      icon: "/lovable-uploads/social-icons/twilio.png",
      status: "not-connected" as const,
    },
    {
      id: "mailgun",
      name: t("integration.channels.mailgun"),
      icon: "/lovable-uploads/social-icons/mailgun.png",
      status: "not-connected" as const,
    },
    {
      id: "google",
      name: t("integration.channels.google"),
      icon: "/lovable-uploads/social-icons/google.png",
      status: "connected" as const,
    },
    {
      id: "facebook",
      name: t("integration.channels.facebook"),
      icon: "/lovable-uploads/social-icons/facebook.png",
      status: "not-connected" as const,
    },
    {
      id: "yelp",
      name: t("integration.channels.yelp"),
      icon: "/lovable-uploads/social-icons/yelp.png",
      status: "not-connected" as const,
    },
    {
      id: "foursquare",
      name: t("integration.channels.foursquare"),
      icon: "/lovable-uploads/social-icons/foursquare.png",
      status: "not-connected" as const,
    },
    {
      id: "airbnb",
      name: t("integration.channels.airbnb"),
      icon: "/lovable-uploads/social-icons/air-bnb.png",
      status: "not-connected" as const,
    },
    {
      id: "tripadvisor",
      name: t("integration.channels.tripadvisor"),
      icon: "/lovable-uploads/social-icons/tripadvisor.png",
      status: "not-connected" as const,
    },
    {
      id: "trustpilot",
      name: t("integration.channels.trustpilot"),
      icon: "/lovable-uploads/social-icons/trustpilot.png",
      status: "not-connected" as const,
    },
    {
      id: "yellowPages",
      name: t("integration.channels.yellowPages"),
      icon: "/lovable-uploads/social-icons/yellowPage.png",
      status: "not-connected" as const,
    },
    {
      id: "opentable",
      name: t("integration.channels.opentable"),
      icon: "/lovable-uploads/social-icons/opentable.png",
      status: "not-connected" as const,
    },
    
  ];

  const handleConnect = (channelName: string) => {
    toast.info(`Connecting to ${channelName}...`, {
      description: "This feature is coming soon",
    });
  };

  const handleDisconnect = (channelName: string) => {
    toast.success(`Disconnected from ${channelName}`);
  };

  const tabItems = [
    { value: "integration", label: t("tabs.integration") },
    { value: "qrCode", label: t("tabs.qrCode") },
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
    if (activeTab === "integration") {
      return (
        <div className="lg:p-5">
          {/* Integration Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {t("integration.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("integration.description")}
            </p>
          </div>

          {/* Channel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                name={channel.name}
                icon={channel.icon}
                status={channel.status}
                onConnect={() => handleConnect(channel.name)}
                onDisconnect={() => handleDisconnect(channel.name)}
                statusText={{
                  connected: t("integration.status.connected"),
                  notConnected: t("integration.status.notConnected"),
                }}
                buttonText={{
                  connect: t("integration.button.connect"),
                  disconnect: t("integration.button.disconnect"),
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "qrCode") {
      return (
        <div className="lg:p-5">
          <QRCodeSection
            title={t("qrCode.title")}
            description={t("qrCode.description")}
            simpleCard={{
              title: t("qrCode.simpleCard.title"),
              description: t("qrCode.simpleCard.description"),
              downloadButton: t("qrCode.simpleCard.downloadButton"),
            }}
            posterCard={{
              title: t("qrCode.posterCard.title"),
              description: t("qrCode.posterCard.description"),
              customizeButton: t("qrCode.posterCard.customizeButton"),
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg lg:hidden">
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
            className="w-48 bg-card border border-border rounded-lg p-4"
            style={{ minWidth: "192px" }}
          >
            <TabNavigation />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 bg-card rounded-lg">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Setting;
