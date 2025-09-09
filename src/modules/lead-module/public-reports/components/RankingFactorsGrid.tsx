import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>GMB Ranking Factors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor) => (
            <div key={factor.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {factor.status === "good" ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <span className="font-medium text-sm">{factor.label}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  factor.status === "good" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {factor.status === "good" ? "Good" : "Needs Work"}
                </span>
                {factor.description && (
                  <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};