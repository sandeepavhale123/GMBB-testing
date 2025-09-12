import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star } from "lucide-react";

interface Competitor {
  rank: number;
  businessName: string;
  rating: number;
  reviewCount: number;
  category: string;
  distance?: string;
}

interface CompetitorTableProps {
  competitors: Competitor[];
}

export const CompetitorTable: React.FC<CompetitorTableProps> = ({ competitors }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Businesses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">#</th>
                <th className="text-left p-2 font-medium">Business Name</th>
                <th className="text-left p-2 font-medium">Rating</th>
                <th className="text-left p-2 font-medium">Reviews</th>
                <th className="text-left p-2 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => (
                <tr key={competitor.rank} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">#{competitor.rank}</td>
                  <td className="p-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-medium cursor-help">
                            {competitor.businessName.length > 60 
                              ? `${competitor.businessName.slice(0, 60)}...`
                              : competitor.businessName
                            }
                          </div>
                        </TooltipTrigger>
                        {competitor.businessName.length > 60 && (
                          <TooltipContent>
                            <p>{competitor.businessName}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(competitor.rating)}</div>
                      <span className="ml-1">{competitor.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="p-2">{competitor.reviewCount}</td>
                  <td className="p-2 text-muted-foreground">{competitor.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};