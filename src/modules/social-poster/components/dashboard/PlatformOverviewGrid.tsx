import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Twitter, Linkedin, ImageIcon, Youtube, MessageSquare, Loader2 } from "lucide-react";
import { PlatformType } from "../../types";
import { usePlatformStats } from "../../hooks/useSocialPoster";

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  accountCount: number;
  status: "healthy" | "warning" | "error" | "disconnected";
  enabled: boolean;
}

const platformIcons: Record<PlatformType, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  linkedin_individual: Linkedin,
  linkedin_organisation: Linkedin,
  threads: MessageSquare,
  pinterest: ImageIcon,
  youtube: Youtube,
};

const platformColors: Record<PlatformType, string> = {
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

const platformNames: Record<PlatformType, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter/X",
  linkedin: "LinkedIn",
  linkedin_individual: "LinkedIn",
  linkedin_organisation: "LinkedIn",
  threads: "Threads",
  pinterest: "Pinterest",
  youtube: "YouTube",
};

const enabledPlatforms: PlatformType[] = ["facebook", "instagram", "twitter", "linkedin", "linkedin_individual", "linkedin_organisation", "threads"];

const statusConfig = {
  healthy: { color: "hsl(var(--chart-2))", label: "Active" },
  warning: { color: "hsl(var(--chart-4))", label: "Warning" },
  error: { color: "hsl(var(--destructive))", label: "Error" },
  disconnected: { color: "hsl(var(--muted-foreground))", label: "Not Connected" },
};

export const PlatformOverviewGrid: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = usePlatformStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load platform stats</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const platformStats = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {platformStats.map((platformStat) => {
        const Icon = platformIcons[platformStat.platform];
        const color = platformColors[platformStat.platform];
        const name = platformNames[platformStat.platform];
        const statusInfo = statusConfig[platformStat.status];
        const isEnabled = enabledPlatforms.includes(platformStat.platform);
        const isConnected = platformStat.connectedAccounts > 0;
        
        // Determine LinkedIn account type badge
        const isLinkedInIndividual = platformStat.platform === "linkedin_individual";
        const isLinkedInOrganisation = platformStat.platform === "linkedin_organisation";
        const showLinkedInBadge = isLinkedInIndividual || isLinkedInOrganisation;

        return (
          <Card key={platformStat.platform} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{name}</h3>
                      {showLinkedInBadge && (
                        <Badge variant="outline" className="text-xs">
                          {isLinkedInIndividual ? "Individual" : "Organisation"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {isConnected ? (
                  <>
                    <p className="text-2xl font-bold">{platformStat.connectedAccounts}</p>
                    <p className="text-xs text-muted-foreground">Connected Accounts</p>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/social-poster/accounts")}
                    disabled={!isEnabled}
                  >
                    {isEnabled ? "Connect" : "Coming Soon"}
                  </Button>
                )}
              </div>

              {!isEnabled && (
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  Coming Soon
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
