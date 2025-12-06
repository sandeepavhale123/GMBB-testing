import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Instagram,
  Twitter,
  MessageSquare,
  ImageIcon,
  Youtube,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useConnectedAccounts } from "../../hooks/useSocialPoster";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PlatformType } from "../../types";
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

const platformColors: Record<string, string> = {
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

const platformDisplayNames: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter/X",
  linkedin: "LinkedIn",
  linkedin_individual: "LinkedIn (Individual)",
  linkedin_organisation: "LinkedIn (Organisation)",
  threads: "Threads",
  pinterest: "Pinterest",
  youtube: "YouTube",
};

interface AccountSummary {
  platform: string;
  accountName: string;
  postsCount: number;
  status: string;
}

export const ConnectedAccountsSummary: React.FC = () => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/ConnectedAccountsSummary",
  ]);
  const { data, isLoading } = useConnectedAccounts();

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("connectedAccounts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const accountsResponse = data?.data;
  const accounts = Array.isArray(accountsResponse)
    ? accountsResponse
    : accountsResponse?.accounts || [];

  // Group accounts by platform and create summary
  const accountSummaries: AccountSummary[] = accounts.map((account: any) => ({
    platform: account.platform,
    accountName: account.accountName || account.displayName,
    postsCount: Math.floor(Math.random() * 20) + 1, // Mock posts count
    status: account.status || "healthy",
  }));

  if (accountSummaries.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("connectedAccounts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("noAccounts")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedAccounts = accountSummaries.slice(0, 6);

  return (
    <Card className="bg-card h-full pb-3">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {t("connectedAccounts")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 h-[400px] overflow-y-auto">
        {displayedAccounts.map((account, index) => {
          const Icon = platformIcons[account.platform] || MessageSquare;
          const color =
            platformColors[account.platform] || "hsl(221, 75%, 55%)";
          const displayName =
            platformDisplayNames[account.platform] || account.platform;

          return (
            <React.Fragment key={index}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.accountName}</p>
                    <p className="text-xs text-muted-foreground">
                      {displayName}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                >
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  {t("status.connected")}
                </Badge>
              </div>
              {index < displayedAccounts.length - 1 && <Separator />}
            </React.Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};
