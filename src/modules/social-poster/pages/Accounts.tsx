import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ConnectedAccountsList } from "../components/accounts/ConnectedAccountsList";
import { ConnectPlatformDialog } from "../components/accounts/ConnectPlatformDialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const SocialPosterAccounts: React.FC = () => {
  const { t } = useI18nNamespace(["social-poster-pages/Accounts"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const connectStatus = searchParams.get("connect_status");
    const platform = searchParams.get("platform");
    const error = searchParams.get("error");
    const pages = searchParams.get("pages");
    const instagram = searchParams.get("instagram");
    const accounts = searchParams.get("accounts");
    const accountType = searchParams.get("account_type");

    if (connectStatus && platform) {
      if (connectStatus === "success") {
        const accountsConnected = [];

        // Handle Facebook/Instagram
        if (pages)
          accountsConnected.push(
            `${pages} Facebook page${parseInt(pages) > 1 ? "s" : ""}`
          );
        if (instagram)
          accountsConnected.push(
            `${instagram} Instagram account${
              parseInt(instagram) > 1 ? "s" : ""
            }`
          );

        // Handle LinkedIn
        if (platform === "linkedin" && accounts && accountType) {
          accountsConnected.push(
            `${accounts} LinkedIn ${accountType} account${
              parseInt(accounts) > 1 ? "s" : ""
            }`
          );
        }

        // Handle Twitter
        if (platform === "twitter" && !pages && !instagram) {
          accountsConnected.push("Twitter account");
        }

        // Handle Threads
        if (platform === "threads" && accounts) {
          accountsConnected.push(
            `${accounts} Threads account${parseInt(accounts) > 1 ? "s" : ""}`
          );
        }

        toast({
          title: t("toast.success_title"),
          description:
            accountsConnected.length > 0
              ? `${t("toast.success_desc")} ${accountsConnected.join(" and ")}`
              : t("toast.success_description_default", {
                  platform,
                }),
        });
      } else if (connectStatus === "error") {
        toast({
          title: t("toast.failed_title", { ns: "accounts" }),
          description:
            error ||
            t("toast.failed_description_default", {
              ns: "accounts",
              platform,
            }),
          variant: "destructive",
        });
      }

      // Clean up URL
      searchParams.delete("connect_status");
      searchParams.delete("platform");
      searchParams.delete("error");
      searchParams.delete("pages");
      searchParams.delete("instagram");
      searchParams.delete("accounts");
      searchParams.delete("account_type");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setShowConnectDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("button_connect_new")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("search_placeholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all_platforms")}</SelectItem>
            <SelectItem value="facebook">{t("filters.facebook")}</SelectItem>
            <SelectItem value="instagram">{t("filters.instagram")}</SelectItem>
            <SelectItem value="twitter">{t("filters.twitter")}</SelectItem>
            <SelectItem value="linkedin_individual">
              {t("filters.linkedin_individual")}
            </SelectItem>
            <SelectItem value="linkedin_organisation">
              {t("filters.linkedin_organisation")}
            </SelectItem>
            <SelectItem value="threads">{t("filters.threads")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all_status")}</SelectItem>
            <SelectItem value="healthy">{t("filters.healthy")}</SelectItem>
            <SelectItem value="warning">{t("filters.warning")}</SelectItem>
            <SelectItem value="error">{t("filters.error")}</SelectItem>
            <SelectItem value="disconnected">
              {t("filters.disconnected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Connected Accounts */}
      <ConnectedAccountsList
        platformFilter={platformFilter}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
      />

      {/* Connect Dialog */}
      <ConnectPlatformDialog
        open={showConnectDialog}
        onOpenChange={setShowConnectDialog}
      />
    </div>
  );
};
