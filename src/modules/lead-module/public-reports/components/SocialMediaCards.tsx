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
  return;
};