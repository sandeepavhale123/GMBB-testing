import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, ImageIcon, Youtube, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
}

const platforms: Platform[] = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "hsl(221, 75%, 55%)", enabled: true },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "hsl(330, 75%, 50%)", enabled: true },
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "hsl(0, 0%, 0%)", enabled: true },
  { id: "linkedin_individual", name: "LinkedIn (Individual)", icon: Linkedin, color: "hsl(201, 100%, 35%)", enabled: true },
  { id: "linkedin_organisation", name: "LinkedIn (Organisation)", icon: Linkedin, color: "hsl(201, 100%, 35%)", enabled: true },
  { id: "threads", name: "Threads", icon: MessageSquare, color: "hsl(0, 0%, 0%)", enabled: true },
  { id: "pinterest", name: "Pinterest", icon: ImageIcon, color: "hsl(0, 78%, 52%)", enabled: false },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "hsl(0, 100%, 50%)", enabled: false },
];

interface PlatformSelectorProps {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  const togglePlatform = (platformId: string, enabled: boolean) => {
    if (!enabled) return;

    if (selected.includes(platformId)) {
      onChange(selected.filter((id) => id !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-3 block">Select Platforms</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selected.includes(platform.id);

          return (
            <Button
              key={platform.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => togglePlatform(platform.id, platform.enabled)}
              disabled={!platform.enabled}
              className={cn("gap-2", !platform.enabled && "opacity-50")}
            >
              <Icon className="h-4 w-4" />
              {platform.name}
              {!platform.enabled && <span className="text-xs">(Soon)</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
