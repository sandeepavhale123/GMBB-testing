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
        <Card key={index} className="p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Share2 className="h-4 w-4 mr-2" />
            <CardTitle className="text-sm font-medium">{platform.name}</CardTitle>
            {platform.connected ? (
              <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 ml-auto text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            {platform.url && (
              <p className="text-xs text-muted-foreground mb-1">{platform.url}</p>
            )}
            {platform.followers && (
              <p className="text-sm font-semibold">{platform.followers.toLocaleString()} followers</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};