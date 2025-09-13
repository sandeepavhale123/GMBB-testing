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

interface ComparisonData {
  name: string;
  category: string;
  additionalCategory: string;
  website: string;
  reviewCount: number;
  rating: number;
  keywordInName: string;
}

interface Top20CompetitorsCardProps {
  searchInfo: SearchInfo;
  yourBusiness: YourBusiness;
  competitorStats: CompetitorStats;
  comparisonData: ComparisonData[];
}

export const Top20CompetitorsCard: React.FC<Top20CompetitorsCardProps> = ({
  searchInfo,
  yourBusiness,
  competitorStats,
  comparisonData,
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

        {/* Comparison Analysis Table */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Comparison Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Rank</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Business Name</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Category</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Website</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Rating</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Reviews</th>
                  <th className="border border-gray-200 p-3 text-left font-medium text-sm">Keyword Match</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((business, index) => (
                  <tr key={index} className={business.keywordInName === "YES" ? "bg-green-50" : ""}>
                    <td className="border border-gray-200 p-3 text-sm font-medium">#{index + 1}</td>
                    <td className="border border-gray-200 p-3 text-sm font-medium">{business.name}</td>
                    <td className="border border-gray-200 p-3 text-sm">
                      {business.category}
                      {business.additionalCategory && business.additionalCategory !== "Not Found" && (
                        <div className="text-xs text-muted-foreground mt-1">{business.additionalCategory}</div>
                      )}
                    </td>
                    <td className="border border-gray-200 p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        business.website && business.website !== "Not Found" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {business.website && business.website !== "Not Found" ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(business.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{business.rating}</span>
                      </div>
                    </td>
                    <td className="border border-gray-200 p-3 text-sm font-medium">{business.reviewCount}</td>
                    <td className="border border-gray-200 p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        business.keywordInName === "YES" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {business.keywordInName}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};