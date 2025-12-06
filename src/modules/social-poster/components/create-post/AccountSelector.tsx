import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ChevronDown,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { PlatformType } from "../../types";
import { useAvailableAccounts } from "../../hooks/useSocialPoster";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const platformIcons: Record<PlatformType, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  linkedin_individual: Linkedin,
  linkedin_organisation: Linkedin,
  threads: MessageSquare,
  pinterest: Facebook,
  youtube: Facebook,
};

interface AccountSelectorProps {
  platforms: string[];
  selectedAccounts?: string[];
  onSelectionChange?: (accountIds: string[]) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  platforms,
  selectedAccounts: externalSelectedAccounts,
  onSelectionChange,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-createpost/AccountSelector",
  ]);

  const getPlatformDisplayName = (platform: string): string => {
    if (platform === "linkedin_individual")
      return t("platform.linkedinIndividual");
    if (platform === "linkedin_organisation")
      return t("platform.linkedinOrganisation");
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };
  const [internalSelectedAccounts, setInternalSelectedAccounts] =
    React.useState<string[]>([]);
  const selectedAccounts = externalSelectedAccounts ?? internalSelectedAccounts;
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(
    new Set()
  );

  const { data: accountsResponse, isLoading } = useAvailableAccounts({
    status: "healthy",
  });
  const allAccounts = accountsResponse?.data?.accounts || [];

  const toggleAccount = (accountId: string) => {
    const newSelection = selectedAccounts.includes(accountId)
      ? selectedAccounts.filter((id) => id !== accountId)
      : [...selectedAccounts, accountId];

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedAccounts(newSelection);
    }
  };

  const selectAllForPlatform = (platform: PlatformType) => {
    const platformAccounts = groupedAccounts[platform].map((acc) => acc.id);
    const allSelected = platformAccounts.every((id) =>
      selectedAccounts.includes(id)
    );

    const newSelection = allSelected
      ? selectedAccounts.filter((id) => !platformAccounts.includes(id))
      : [...new Set([...selectedAccounts, ...platformAccounts])];

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedAccounts(newSelection);
    }
  };

  const togglePlatform = (platform: string) => {
    setExpandedPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  // Group accounts by platform
  const groupedAccounts = allAccounts.reduce((acc, account) => {
    if (!acc[account.platform]) acc[account.platform] = [];
    acc[account.platform].push(account);
    return acc;
  }, {} as Record<PlatformType, typeof allAccounts>);

  // Filter accounts based on selected platforms
  const filteredGroupedAccounts = useMemo(() => {
    const filtered: Record<PlatformType, typeof allAccounts> = {} as any;

    // Create set of allowed platforms - for LinkedIn, include both individual and organisation
    const allowedPlatforms = new Set<string>();
    platforms.forEach((platform) => {
      if (platform === "linkedin") {
        // When LinkedIn is selected, show both individual and organisation accounts
        allowedPlatforms.add("linkedin_individual");
        allowedPlatforms.add("linkedin_organisation");
      } else {
        allowedPlatforms.add(platform);
      }
    });

    Object.entries(groupedAccounts).forEach(([platform, accounts]) => {
      // Filter by selected platforms first
      if (!allowedPlatforms.has(platform)) return;

      // Then filter by dropdown platform filter
      if (platformFilter !== "all" && platform !== platformFilter) return;

      // Finally filter by search query
      const matchedAccounts = accounts.filter((account) =>
        account.accountName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedAccounts.length > 0) {
        filtered[platform as PlatformType] = matchedAccounts;
      }
    });

    return filtered;
  }, [groupedAccounts, searchQuery, platformFilter, platforms]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("loading.title")}</CardTitle>
          <CardDescription>{t("loading.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("loading.message")}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (platforms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("noPlatforms.title")}</CardTitle>
          <CardDescription>{t("noPlatforms.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("noPlatforms.message")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>{t("titles.targetAccounts")}</CardTitle>
          <Badge variant="secondary">
            {selectedAccounts.length} {t("titles.selected")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-2">
          <Input
            placeholder={t("filters.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.filterByPlatform")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allPlatforms")}</SelectItem>
              {Object.keys(groupedAccounts).map((platform) => (
                <SelectItem
                  key={platform}
                  value={platform}
                  className="capitalize"
                >
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Collapsible Platform Groups */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(filteredGroupedAccounts).map(
            ([platform, accounts]) => {
              const Icon = platformIcons[platform as PlatformType];
              const isExpanded = expandedPlatforms.has(platform);
              const platformAccountIds = accounts.map((acc) => acc.id);
              const allSelected = platformAccountIds.every((id) =>
                selectedAccounts.includes(id)
              );

              return (
                <Collapsible
                  key={platform}
                  open={isExpanded}
                  onOpenChange={() => togglePlatform(platform)}
                >
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">
                              {getPlatformDisplayName(platform)}
                            </span>
                            <Badge variant="outline" className="ml-2">
                              {accounts.length}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectAllForPlatform(platform as PlatformType);
                            }}
                          >
                            {allSelected
                              ? t("buttons.deselectAll")
                              : t("buttons.selectAll")}
                          </Button>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-2">
                        {accounts.map((account) => (
                          <div
                            key={account.id}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-muted"
                          >
                            <Checkbox
                              id={account.id}
                              checked={selectedAccounts.includes(account.id)}
                              onCheckedChange={() => toggleAccount(account.id)}
                              disabled={account.status !== "healthy"}
                            />
                            <Label
                              htmlFor={account.id}
                              className="text-sm flex items-center gap-2 flex-1 cursor-pointer"
                            >
                              <img
                                src={account.profilePicture}
                                alt={account.accountName}
                                className="h-6 w-6 rounded-full"
                              />
                              <span>{account.accountName}</span>
                              {account.followerCount && (
                                <span className="text-xs text-muted-foreground">
                                  ({account.followerCount.toLocaleString()})
                                </span>
                              )}
                              {account.status !== "healthy" && (
                                <Badge variant="outline" className="text-xs">
                                  {t(`status.${account.status}`)}
                                </Badge>
                              )}
                            </Label>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
};
