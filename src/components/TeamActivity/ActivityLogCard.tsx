import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Star, Mail, Monitor, ChevronDown, ChevronUp } from "lucide-react";
import { ActivityLogItem } from "@/api/teamApi";
import { formatDistanceToNow } from "date-fns";

interface ActivityLogCardProps {
  activity: ActivityLogItem;
}

export const ActivityLogCard: React.FC<ActivityLogCardProps> = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const shouldShowExpand = (activity.review_text?.length || 0) > 150 || (activity.reply_text?.length || 0) > 150;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section - Review/Reply Info */}
        <div className="flex-1 space-y-3">
          {/* Header with badges and timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <MessageSquare className="w-3 h-3 mr-1" />
                {activity.module?.toUpperCase()} MODULE
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Replied to Review
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(activity.created_at)}
            </span>
          </div>

          {/* Listing Name */}
          <h4 className="font-semibold text-foreground">{activity.listing_name}</h4>

          {/* Reviewer Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Review by {activity.display_name}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>

          {/* Review Text */}
          {activity.review_text && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground italic">
                "{isExpanded ? activity.review_text : truncateText(activity.review_text)}"
              </p>
            </div>
          )}

          {/* Admin Reply */}
          {activity.reply_text && (
            <div className="space-y-2">
              <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                ADMIN REPLY
              </Badge>
              <div className="bg-primary/5 border-l-2 border-primary p-3 rounded-r-md">
                <p className="text-sm text-foreground">
                  "{isExpanded ? activity.reply_text : truncateText(activity.reply_text)}"
                </p>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          {shouldShowExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 p-0 h-auto"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        {/* Right Section - Team Member Info */}
        <div className="lg:w-64 lg:border-l lg:pl-4 border-t lg:border-t-0 pt-4 lg:pt-0">
          <div className="flex flex-col items-center lg:items-start gap-3">
            {/* Avatar */}
            <Avatar className="h-12 w-12 bg-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(activity.first_name, activity.last_name)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Role */}
            <div className="text-center lg:text-left">
              <h5 className="font-semibold text-foreground">
                {activity.first_name} {activity.last_name}
              </h5>
              <p className="text-sm text-muted-foreground capitalize">
                {activity.user_role}
              </p>
            </div>

            {/* Email */}
            {activity.sub_user_email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate max-w-[180px]">{activity.sub_user_email}</span>
              </div>
            )}

            {/* Platform */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Monitor className="w-4 h-4" />
              <span>Web Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
