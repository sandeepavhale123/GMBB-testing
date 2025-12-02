import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, MessageSquare, ChevronDown, X, ChevronRight } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAvailableAccounts } from "../../hooks/useSocialPoster";
import { PlatformType } from "../../types";
import { cn } from "@/lib/utils";

const platformIcons: Record<string, React.ElementType> = {
  facebook: FaFacebookF,
  instagram: Instagram,
  twitter: Twitter,
  linkedin_individual: FaLinkedinIn,
  linkedin_organisation: FaLinkedinIn,
  threads: MessageSquare,
};

const platformColors: Record<string, string> = {
  facebook: "bg-[#1877F2]",
  instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
  twitter: "bg-[#1DA1F2]",
  linkedin_individual: "bg-[#0A66C2]",
  linkedin_organisation: "bg-[#0A66C2]",
  threads: "bg-black",
};

const getPlatformDisplayName = (platform: string): string => {
  if (platform === "linkedin_individual") return "LinkedIn (Individual)";
  if (platform === "linkedin_organisation") return "LinkedIn (Organisation)";
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};

interface SelectAccountsCardProps {
  selectedAccounts: string[];
  onSelectionChange: (accountIds: string[]) => void;
}

export const SelectAccountsCard: React.FC<SelectAccountsCardProps> = ({ selectedAccounts, onSelectionChange }) => {
  const [open, setOpen] = useState(false);
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set());
  const { data: accountsResponse, isLoading } = useAvailableAccounts({ status: "healthy" });
  const allAccounts = accountsResponse?.data?.accounts || [];

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
  const groupedAccounts = useMemo(() => {
    return allAccounts.reduce(
      (acc, account) => {
        if (!acc[account.platform]) acc[account.platform] = [];
        acc[account.platform].push(account);
        return acc;
      },
      {} as Record<string, typeof allAccounts>,
    );
  }, [allAccounts]);

  const toggleAccount = (accountId: string) => {
    const newSelection = selectedAccounts.includes(accountId)
      ? selectedAccounts.filter((id) => id !== accountId)
      : [...selectedAccounts, accountId];
    onSelectionChange(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.length === allAccounts.length) {
      // Deselect all
      onSelectionChange([]);
    } else {
      // Select all
      onSelectionChange(allAccounts.map((acc) => acc.id));
    }
  };

  const isAllSelected = allAccounts.length > 0 && selectedAccounts.length === allAccounts.length;

  // Get selected account details for display
  const selectedAccountDetails = useMemo(() => {
    return allAccounts.filter((acc) => selectedAccounts.includes(acc.id));
  }, [allAccounts, selectedAccounts]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading accounts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multi-select dropdown trigger */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-[40px] py-2"
            >
              <span className="text-muted-foreground">
                {selectedAccounts.length === 0
                  ? "Select accounts..."
                  : `${selectedAccounts.length} account${selectedAccounts.length > 1 ? "s" : ""} selected`}
              </span>
              <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 z-50 bg-background"
            align="start"
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <div className="max-h-[300px] overflow-y-auto p-3 space-y-3">
              {/* Select All Option */}
              {allAccounts.length > 0 && (
                <div className="pb-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      Select All Accounts
                    </label>
                  </div>
                </div>
              )}

              {/* Grouped accounts by platform */}
              {Object.entries(groupedAccounts).map(([platform, accounts]) => {
                const Icon = platformIcons[platform];
                const colorClass = platformColors[platform];
                const isExpanded = expandedPlatforms.has(platform);
                return (
                  <div key={platform} className="space-y-2">
                    <div
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => togglePlatform(platform)}
                    >
                      <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                      <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", colorClass)}>
                        {Icon && <Icon className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span>{getPlatformDisplayName(platform)}</span>
                    </div>
                    {isExpanded && (
                      <div className="space-y-2 pl-8">
                        {accounts.map((account) => (
                          <div key={account.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={account.id}
                              checked={selectedAccounts.includes(account.id)}
                              onCheckedChange={() => toggleAccount(account.id)}
                            />
                            <label
                              htmlFor={account.id}
                              className="text-sm flex items-center gap-2 flex-1 cursor-pointer"
                            >
                              <img
                                src={account.profilePicture}
                                alt={account.accountName}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                              <span>{account.accountName}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Selected accounts chips */}
        {selectedAccountDetails.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedAccountDetails.map((account) => {
              const Icon = platformIcons[account.platform];
              const colorClass = platformColors[account.platform];
              return (
                <Badge key={account.id} variant="secondary" className="gap-1.5 pl-1 pr-2">
                  <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", colorClass)}>
                    {Icon && <Icon className="h-3 w-3 text-white" />}
                  </div>
                  <span>{account.accountName}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => toggleAccount(account.id)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
