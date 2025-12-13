import React from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CharacterCounterProps {
  content: string;
  platforms: string[];
  singlePlatformMode?: boolean; // New prop for channel tabs
}

const platformLimits: Record<string, { limit: number; nameKey: string }> = {
  facebook: { limit: 63206, nameKey: "platforms.facebook" },
  instagram: { limit: 2200, nameKey: "platforms.instagram" },
  twitter: { limit: 280, nameKey: "platforms.twitter" },
  linkedin: { limit: 3000, nameKey: "platforms.linkedin" },
  linkedin_individual: { limit: 3000, nameKey: "platforms.linkedin" },
  linkedin_organisation: { limit: 3000, nameKey: "platforms.linkedin" },
  threads: { limit: 500, nameKey: "platforms.threads" },
  pinterest: { limit: 500, nameKey: "platforms.pinterest" },
  youtube: { limit: 5000, nameKey: "platforms.youtube" },
};

// Export for external use
export const getPlatformLimits = () => platformLimits;

// Get limit for a single platform
export const getCharacterLimit = (platform: string): number => {
  return platformLimits[platform]?.limit ?? Infinity;
};

export const getMinCharacterLimit = (platforms: string[]): number => {
  if (platforms.length === 0) return Infinity;

  const limits = platforms
    .map((platform) => platformLimits[platform]?.limit)
    .filter((limit) => limit !== undefined && limit !== Infinity);

  return limits.length > 0 ? Math.min(...limits) : Infinity;
};

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  content,
  platforms,
  singlePlatformMode = false,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-createpost/CharacterCounter",
  ]);
  const length = content.length;

  if (platforms.length === 0) {
    return null;
  }

  // Single platform mode (for channel tabs) - informational only
  if (singlePlatformMode && platforms.length === 1) {
    const platform = platforms[0];
    const info = platformLimits[platform];
    if (!info) return null;

    const limit = info.limit;
    const percentage = limit !== Infinity ? (length / limit) * 100 : 0;

    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-foreground">
          {t(info.nameKey)}:
        </span>
        <span className="text-muted-foreground">
          {length}/{limit}
        </span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
          <div
            className="h-full transition-all bg-chart-2"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  // Multi-platform mode (for draft tab) - informational only
  const minLimit = getMinCharacterLimit(platforms);

  return (
    <div className="space-y-2">
      {/* Main limit info */}
      {minLimit !== Infinity && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">
            {t("labels.character_limit")}:
          </span>
          <span className="text-muted-foreground">
            {length}/{minLimit}
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[200px]">
            <div
              className="h-full transition-all bg-chart-2"
              style={{ width: `${Math.min((length / minLimit) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Individual platform limits - informational only */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {platforms.map((platform) => {
          const info = platformLimits[platform];
          if (!info) return null;

          return (
            <div key={platform} className="flex items-center gap-1.5">
              <span className="font-medium">{t(info.nameKey)}:</span>
              <span>
                {info.limit === Infinity
                  ? t("labels.no_limit")
                  : `${length}/${info.limit}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
