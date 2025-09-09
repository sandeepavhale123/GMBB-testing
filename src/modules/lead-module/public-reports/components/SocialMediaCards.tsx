import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, CheckCircle, XCircle } from "lucide-react";

interface SocialPlatform {
  name: string;
  connected: boolean;
  url?: string;
  followers?: number;
}

interface SocialMediaCardsProps {
  platforms: SocialPlatform[];
}

export const SocialMediaCards: React.FC<SocialMediaCardsProps> = ({ platforms }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => (
            <div key={platform.name} className="flex items-center gap-3 p-3 border rounded-lg">
              {platform.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="font-medium">{platform.name}</div>
                {platform.connected ? (
                  <div className="text-sm text-muted-foreground">
                    {platform.followers ? `${platform.followers} followers` : "Connected"}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">Not connected</div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                platform.connected 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {platform.connected ? "Active" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};