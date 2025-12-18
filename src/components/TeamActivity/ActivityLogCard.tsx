import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ActivityLogItem } from "@/api/teamApi";
import { formatDistanceToNow } from "date-fns";

interface ActivityLogCardProps {
  activity: ActivityLogItem;
}

export const ActivityLogCard: React.FC<ActivityLogCardProps> = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getRatingCount = (rating: string): number => {
    const ratingMap: Record<string, number> = {
      'FIVE': 5,
      'FOUR': 4,
      'THREE': 3,
      'TWO': 2,
      'ONE': 1,
    };
    return ratingMap[rating?.toUpperCase()] || 0;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header with badges and timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Replied to Review
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</span>
        </div>

        {/* Listing Name with Reviewer Info */}
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-foreground">{activity.listing_name}</h4>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">Review by {activity.display_name}</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= getRatingCount(activity.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        {activity.review_text && (
          <div className="bg-muted/50 p-3 rounded-md flex items-start justify-between gap-2">
            <p className="text-sm text-muted-foreground italic flex-1">
              "{isExpanded ? activity.review_text : truncateText(activity.review_text, 100)}"
            </p>
            {activity.review_text.length > 100 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 p-0 h-auto shrink-0"
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>
        )}

        {/* Admin Reply */}
        {activity.reply_text && (
          <div className="space-y-2">
            <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
              Reply by {activity.first_name} {activity.last_name}
            </Badge>
            <div className="bg-primary/5 border-l-2 border-primary p-3 rounded-r-md">
              <p className="text-sm text-foreground">"{activity.reply_text}"</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
