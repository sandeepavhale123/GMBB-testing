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
export const SocialMediaCards: React.FC<SocialMediaCardsProps> = ({
  platforms
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map((platform, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5" />
              <div className="flex-1">
                <div className="font-medium">{platform.name}</div>
                {platform.followers && (
                  <div className="text-sm text-muted-foreground">
                    {platform.followers.toLocaleString()} followers
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {platform.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};