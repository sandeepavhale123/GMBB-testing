import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RankingFactor {
  id: string;
  label: string;
  status: "good" | "needs-work";
  description?: string;
}

interface RankingFactorsGridProps {
  factors: RankingFactor[];
}

export const RankingFactorsGrid: React.FC<RankingFactorsGridProps> = ({ factors }) => {
  const getStatusBadge = (status: string) => {
    if (status === "good") {
      return (
        <div className="inline-block bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          Passed
        </div>
      );
    } else {
      return (
        <div className="inline-block bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          Failed
        </div>
      );
    }
  };

  const getCardBackground = (status: string) => {
    return status === "good" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GBP Ranking Factors</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Following a detailed review of your Google Business Profile (GBP), we assessed its level of optimization. Below is a concise summary of your performance across several key local ranking factors
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((factor) => (
            <div
              key={factor.id}
              className={`relative p-4 rounded-lg border ${getCardBackground(factor.status)}`}
            >
              <div className="absolute -top-5 right-5">
                {getStatusBadge(factor.status)}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 mt-2">{factor.label}</h3>
              <p className="text-sm text-gray-600">{factor.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};