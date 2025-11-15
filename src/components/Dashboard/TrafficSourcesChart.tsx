import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useListingContext } from "@/context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

type TrafficSourcesChartProps = {
  live: number;
  failed: number;
};

const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({
  live,
  failed,
}) => {
  const { selectedListing } = useListingContext();
  const { t } = useI18nNamespace("Dashboard/trafficSourcesChart");
  const donutChartData = [
    { name: t("livePosts"), value: live, fill: "green" },
    { name: t("failedPosts"), value: failed, fill: "red" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={70}
                  dataKey="value"
                >
                  {donutChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{t("successPosts", { count: live })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>{t("failedCountPosts", { count: failed })}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to={`/posts/${selectedListing?.id || "default"}`}>
              {t("view")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficSourcesChart;
