import React from "react";
import {
  Users,
  Instagram,
  Twitter,
  RefreshCw,
  Unplug,
  AlertCircle,
  Loader2,
  MessageSquare,
  Youtube,
  ImageIcon,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformType, PlatformAccount } from "../../types";
import { format, formatDistanceToNow } from "date-fns";
import {
  useConnectedAccounts,
  useDisconnectAccount,
  useRefreshAccountToken,
} from "../../hooks/useSocialPoster";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const platformIcons: Record<string, React.ElementType> = {
  facebook: FaFacebookF,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: FaLinkedinIn,
  linkedin_individual: FaLinkedinIn,
  linkedin_organisation: FaLinkedinIn,
  threads: MessageSquare,
  pinterest: ImageIcon,
  youtube: Youtube,
};

const platformBgColors: Record<string, string> = {
  facebook: "hsl(221, 75%, 55%)",
  instagram: "hsl(330, 75%, 50%)",
  twitter: "hsl(0, 0%, 0%)",
  linkedin: "hsl(201, 100%, 35%)",
  linkedin_individual: "hsl(201, 100%, 35%)",
  linkedin_organisation: "hsl(201, 100%, 35%)",
  threads: "hsl(0, 0%, 0%)",
  pinterest: "hsl(0, 78%, 52%)",
  youtube: "hsl(0, 100%, 50%)",
};

const getPlatformDisplayName = (platform: string): string => {
  if (platform.startsWith("linkedin")) {
    return "LinkedIn";
  }
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};

const getAccountTypeBadge = (platform: string): string | null => {
  if (platform === "linkedin_individual") return "Individual";
  if (platform === "linkedin_organisation") return "Organisation";
  return null;
};

const statusColors = {
  healthy: "hsl(var(--chart-2))",
  warning: "hsl(var(--chart-4))",
  error: "hsl(var(--destructive))",
  disconnected: "hsl(var(--muted-foreground))",
};

interface ConnectedAccountsListProps {
  platformFilter?: string;
  statusFilter?: string;
  searchQuery?: string;
}

export const ConnectedAccountsList: React.FC<ConnectedAccountsListProps> = ({
  platformFilter,
  statusFilter,
  searchQuery = "",
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components/ConnectedAccountsList",
  ]);
  const [expandedAccounts, setExpandedAccounts] = React.useState<string[]>([]);
  const [refreshingAccountId, setRefreshingAccountId] = React.useState<
    string | null
  >(null);

  const { data, isLoading, error } = useConnectedAccounts({
    platform: platformFilter !== "all" ? platformFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const disconnectMutation = useDisconnectAccount();
  const refreshMutation = useRefreshAccountToken();

  const accounts = data?.data?.accounts || [];

  // Filter accounts based on search query - must be before any early returns
  const filteredAccounts = React.useMemo(() => {
    if (!searchQuery.trim()) return accounts;

    const query = searchQuery.toLowerCase();
    return accounts.filter((account) => {
      // Search in account display name
      if (account.displayName.toLowerCase().includes(query)) return true;

      // Search in platform name
      if (
        getPlatformDisplayName(account.platform).toLowerCase().includes(query)
      )
        return true;

      // Search in pages/sub-accounts
      if (account.pages && account.pages.length > 0) {
        return account.pages.some(
          (page) =>
            page.accountName.toLowerCase().includes(query) ||
            page.username?.toLowerCase().includes(query)
        );
      }

      return false;
    });
  }, [accounts, searchQuery]);

  const toggleExpanded = (accountId: string) => {
    setExpandedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleDisconnect = (accountId: string) => {
    if (confirm(t("dialogs.confirmDisconnect"))) {
      disconnectMutation.mutate(accountId);
    }
  };

  const handleRefresh = async (account: PlatformAccount) => {
    // For Facebook/Instagram, Twitter, and LinkedIn use OAuth flow
    if (account.platform === "facebook") {
      setRefreshingAccountId(account.id);
      try {
        const frontendOrigin = window.location.origin;
        const response = await axiosInstance.get(
          `/social-poster/accounts/connect/facebook/init?frontend_origin=${frontendOrigin}`
        );

        if (response.data?.data?.auth_url) {
          window.location.href = response.data.data.auth_url;
        }
      } catch (error: any) {
        toast({
          title: t("token.refreshFailedTitle"),
          description:
            error.response?.data?.message || t("token.refreshFailedDesc"),
          variant: "destructive",
        });
        setRefreshingAccountId(null);
      }
    } else if (account.platform === "twitter") {
      setRefreshingAccountId(account.id);
      try {
        const frontendOrigin = window.location.origin;
        const response = await axiosInstance.get(
          `/social-poster/accounts/connect/twitter/init?frontend_origin=${frontendOrigin}`
        );

        if (response.data?.data?.auth_url) {
          window.location.href = response.data.data.auth_url;
        }
      } catch (error: any) {
        toast({
          title: t("token.refreshFailedTitle"),
          description:
            error.response?.data?.message || t("token.refreshFailedDesc"),
          variant: "destructive",
        });
        setRefreshingAccountId(null);
      }
    } else if (account.platform === "linkedin") {
      setRefreshingAccountId(account.id);
      try {
        const frontendOrigin = window.location.origin;
        const response = await axiosInstance.get(
          `/social-poster/accounts/connect/linkedin/init?frontend_origin=${frontendOrigin}`
        );

        if (response.data?.data?.auth_url) {
          window.location.href = response.data.data.auth_url;
        }
      } catch (error: any) {
        toast({
          title: t("token.refreshFailedTitle"),
          description:
            error.response?.data?.message || t("token.refreshFailedDesc"),
          variant: "destructive",
        });
        setRefreshingAccountId(null);
      }
    } else if (account.platform === "threads") {
      // Threads requires manual token refresh (60-day expiry)
      setRefreshingAccountId(account.id);
      try {
        const response = await axiosInstance.post(
          `/social-poster/accounts/threads/refresh-token`,
          { platform_account_id: parseInt(account.id) }
        );

        if (response.data?.code === 200) {
          toast({
            title: t("token.refreshed"),
            description: t("token.refreshSuccessDesc", {
              days: response.data.data.expires_in_days,
            }),
            // `Token will expire in ${response.data.data.expires_in_days} days`,
          });
          // Refetch accounts to update UI
          window.location.reload();
        }
      } catch (error: any) {
        toast({
          title: t("token.refresh"),
          description: error.response?.data?.message || t("token.refreshDesc"),
          variant: "destructive",
        });
      } finally {
        setRefreshingAccountId(null);
      }
    } else {
      // For other platforms that don't support token refresh via this endpoint
      // Use the old mutation with platform_account_id
      refreshMutation.mutate({
        platform_account_id: parseInt(account.id),
        frontend_origin: window.location.origin,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">{t("error.title")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : t("error.description")}
        </p>
      </div>
    );
  }

  if (filteredAccounts.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          {t("empty.noResultsTitle")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("empty.noResultsDescription", { query: searchQuery })}
          {/* No accounts match your search "{searchQuery}" */}
        </p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          {t("empty.noAccountsTitle")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("empty.noAccountsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAccounts.map((account) => {
        const Icon = platformIcons[account.platform] || Users;
        const isExpanded = expandedAccounts.includes(account.id);
        const hasPages = account.pages && account.pages.length > 0;

        return (
          <Card key={account.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        platformBgColors[account.platform] || "hsl(0, 0%, 50%)",
                    }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-sm sm:text-base break-words">
                        {getPlatformDisplayName(account.platform)} -{" "}
                        {account.displayName}
                      </CardTitle>
                      {getAccountTypeBadge(account.platform) && (
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0"
                        >
                          {getAccountTypeBadge(account.platform)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: statusColors[account.status],
                          }}
                        />
                        <span className="text-muted-foreground capitalize">
                          {account.status}
                        </span>
                      </div>
                      {account.tokenExpiresAt && (
                        <span className="text-muted-foreground">
                          {t("account.tokenExpires", {
                            time: formatDistanceToNow(
                              new Date(account.tokenExpiresAt),
                              {
                                addSuffix: true,
                              }
                            ),
                          })}
                          {/* • Token expires{" "}
                          {formatDistanceToNow(
                            new Date(account.tokenExpiresAt),
                            {
                              addSuffix: true,
                            }
                          )} */}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 self-start sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh(account)}
                    disabled={
                      refreshMutation.isPending ||
                      refreshingAccountId === account.id
                    }
                    className="flex-1 sm:flex-initial"
                  >
                    <RefreshCw
                      className={`h-3 w-3 sm:mr-1 ${
                        refreshMutation.isPending ||
                        refreshingAccountId === account.id
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {t("buttons.refresh")}
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisconnect(account.id)}
                    disabled={disconnectMutation.isPending}
                    className="flex-1 sm:flex-initial"
                  >
                    <Unplug className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">
                      {t("buttons.disconnect")}
                    </span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {t("account.connected", {
                      date: format(
                        new Date(account.connectedAt),
                        "MMM d, yyyy"
                      ),
                    })}
                    {/* Connected:{" "}
                    {format(new Date(account.connectedAt), "MMM d, yyyy")} */}
                  </span>
                  {account.lastRefreshedAt && (
                    <span>
                      {t("account.lastRefreshed", {
                        date: format(
                          new Date(account.lastRefreshedAt),
                          "MMM d, yyyy"
                        ),
                      })}
                      {/* Last refreshed:{" "}
                      {format(new Date(account.lastRefreshedAt), "MMM d, yyyy")} */}
                    </span>
                  )}
                </div>

                {hasPages && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => toggleExpanded(account.id)}
                    >
                      {isExpanded ? "▼" : "▶"}
                      {t("buttons.pagesToggle", {
                        count: account.pages.length,
                      })}
                      {/* Pages/Accounts ({account.pages.length}) */}
                    </Button>

                    {isExpanded && (
                      <div className="space-y-2 pl-4 border-l-2 border-muted">
                        {account.pages.map((page) => (
                          <div
                            key={page.id}
                            className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={page.profilePicture}
                                alt={page.accountName}
                                className="h-8 w-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {page.accountName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {page.username}
                                  {page.followerCount > 0 && (
                                    <>
                                      {" "}
                                      • {page.followerCount.toLocaleString()}{" "}
                                      {t("account.followers")}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                page.status === "healthy"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {page.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {account.status === "warning" && (
                  <div className="flex items-center gap-2 rounded-lg bg-chart-4/10 p-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-chart-4" />
                    <span className="text-chart-4">
                      {
                        account.platform === "threads"
                          ? t("token.tokenExpiresSoonThreads")
                          : // "Token expires soon. Click 'Refresh' to manually extend token expiry (60 days)."
                            t("token.tokenExpiresSoon")
                        //  "Token expires soon. Please refresh your connection."
                      }
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
