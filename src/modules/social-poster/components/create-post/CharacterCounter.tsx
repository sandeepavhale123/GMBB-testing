import React from "react";

interface CharacterCounterProps {
  content: string;
  platforms: string[];
}

const platformLimits: Record<string, { limit: number; name: string }> = {
  facebook: { limit: 63206, name: "Facebook" },
  instagram: { limit: 2200, name: "Instagram" },
  twitter: { limit: 280, name: "Twitter" },
  linkedin: { limit: 3000, name: "LinkedIn" },
  threads: { limit: 500, name: "Threads" },
  pinterest: { limit: 500, name: "Pinterest" },
  youtube: { limit: 5000, name: "YouTube" },
};

export const getMinCharacterLimit = (platforms: string[]): number => {
  if (platforms.length === 0) return Infinity;
  
  const limits = platforms
    .map(platform => platformLimits[platform]?.limit)
    .filter(limit => limit !== undefined && limit !== Infinity);
  
  return limits.length > 0 ? Math.min(...limits) : Infinity;
};

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ content, platforms }) => {
  const length = content.length;
  const minLimit = getMinCharacterLimit(platforms);

  if (platforms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Main enforced limit */}
      {minLimit !== Infinity && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">Character limit:</span>
          <span className={length > minLimit ? "text-destructive font-semibold" : "text-muted-foreground"}>
            {length}/{minLimit}
          </span>
          {length > minLimit && (
            <span className="text-xs text-destructive">
              ({length - minLimit} over limit)
            </span>
          )}
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[200px]">
            <div
              className={`h-full transition-all ${
                length > minLimit ? "bg-destructive" : length > minLimit * 0.8 ? "bg-chart-4" : "bg-chart-2"
              }`}
              style={{ width: `${Math.min((length / minLimit) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Individual platform limits */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {platforms.map((platform) => {
          const info = platformLimits[platform];
          if (!info) return null;

          const isOverLimit = info.limit !== Infinity && length > info.limit;
          const percentage = info.limit !== Infinity ? (length / info.limit) * 100 : 0;

          return (
            <div key={platform} className="flex items-center gap-1.5">
              <span className="font-medium">{info.name}:</span>
              <span className={isOverLimit ? "text-destructive font-medium" : ""}>
                {info.limit === Infinity ? "No limit" : `${length}/${info.limit}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
