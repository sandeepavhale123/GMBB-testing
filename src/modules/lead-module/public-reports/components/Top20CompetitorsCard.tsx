import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Star, MapPin, TrendingUp } from "lucide-react";

interface SearchInfo {
  searchUrl: string;
  searchKeyword: string;
  searchLocation: string;
  message: string;
}

interface YourBusiness {
  position: number;
  name: string;
  address: string;
  phoneNumber: string;
  category: string;
  website: string;
  mapUrl: string;
  reviewCount: string;
  averageRating: string;
}

interface CompetitorStats {
  totalCompetitors: number;
  averageRating: number;
  totalReviews: number;
  yourPosition: number;
}

interface Top20CompetitorsCardProps {
  searchInfo: SearchInfo;
  yourBusiness: YourBusiness;
  competitorStats: CompetitorStats;
}

export const Top20CompetitorsCard: React.FC<Top20CompetitorsCardProps> = ({
  searchInfo,
  yourBusiness,
  competitorStats,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top 20 Competitors Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Search Analysis</span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Keyword:</span>{" "}
              <span className="font-medium">{searchInfo.searchKeyword}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>{" "}
              <span className="font-medium">{searchInfo.searchLocation}</span>
            </div>
          </div>
        </div>

        {/* Congratulations Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-green-900 mb-1">Your Position</div>
              <p className="text-green-700 text-sm">{searchInfo.message}</p>
            </div>
          </div>
        </div>

        {/* Your Business Highlight */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
              #{yourBusiness.position}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">{yourBusiness.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(parseFloat(yourBusiness.averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{yourBusiness.averageRating}</span>
                <span className="text-sm text-muted-foreground">({yourBusiness.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {yourBusiness.address}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{competitorStats.totalCompetitors}</div>
            <div className="text-sm text-muted-foreground">Total Competitors</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">#{competitorStats.yourPosition}</div>
            <div className="text-sm text-muted-foreground">Your Rank</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{yourBusiness.averageRating}</div>
            <div className="text-sm text-muted-foreground">Your Rating</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{competitorStats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg. Competitor Rating</div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-medium">Competitive Performance</div>
            <div className="text-sm text-muted-foreground">
              You're ranking #{yourBusiness.position} out of {competitorStats.totalCompetitors} competitors in your area
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};