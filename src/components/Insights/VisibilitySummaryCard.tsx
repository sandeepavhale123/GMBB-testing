import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Search, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { Link, useLocation } from "react-router-dom";
import { useListingContext } from "../../context/ListingContext";

const PRIMARY_COLOR = "hsl(var(--primary))";
const MAPS_COLOR = "#ef4444";

interface VisibilitySummaryCardProps {
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  summary: any;
  visibilityTrends: any;
}

export const VisibilitySummaryCard = React.memo<VisibilitySummaryCardProps>(
  ({ isLoadingSummary, isLoadingVisibility, summary, visibilityTrends }) => {
    const { selectedListing } = useListingContext();
    const location = useLocation();
    const { t } = useI18nNamespace("Insights/visibilitySummaryCard");

    // 🟢 Memoize path check
    const isInsightsPage = useMemo(
      () => location.pathname.startsWith("/insights/"),
      [location.pathname]
    );

    // 🟢 Memoize chart data
    const chartData = useMemo(
      () => visibilityTrends?.chart_data || [],
      [visibilityTrends]
    );

    // 🟢 Extract deep values only once
    const googleSearch = summary?.visibility_summary?.google_search_views;
    const googleMaps = summary?.visibility_summary?.google_maps_views;

    const [visibleBars, setVisibleBars] = useState({
      search: true,
      maps: true,
    });

    // 🟢 Stable function reference
    const toggleBar = useCallback((barName) => {
      setVisibleBars((prev) => ({
        ...prev,
        [barName]: !prev[barName],
      }));
    }, []);

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                {t("visibilitySummaryTitle")}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {t("visibilitySummarySubtitle")}
              </p>
            </div>

            {!isInsightsPage && (
              <Link
                to={`/insights/${selectedListing?.id || "default"}`}
                className="text-sm text-primary hover:underline"
              >
                {t("view")}
              </Link>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoadingSummary ? (
            <SummarySkeleton />
          ) : (
            <>
              {/* SUMMARY BLOCK */}
              <SummaryBlock
                googleSearch={googleSearch}
                googleMaps={googleMaps}
                t={t}
              />

              {/* CHART */}
              <div className="h-48">
                {isLoadingVisibility ? (
                  <Skeleton className="h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />

                      {visibleBars.search && (
                        <Bar
                          dataKey="search"
                          fill={PRIMARY_COLOR}
                          name={t("searchBarName")}
                        />
                      )}
                      {visibleBars.maps && (
                        <Bar
                          dataKey="maps"
                          fill={MAPS_COLOR}
                          name={t("mapsBarName")}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* LEGEND */}
              <LegendControls
                visibleBars={visibleBars}
                toggleBar={toggleBar}
                t={t}
              />
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);

// 👇 Subcomponents (memoized)

const SummarySkeleton = React.memo(() => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
    <Skeleton className="h-48" />
  </div>
));

interface SummaryBlockProps {
  googleSearch: any;
  googleMaps: any;
  t: (key: string, options?: any) => any;
}

const SummaryBlock = React.memo<SummaryBlockProps>(({ googleSearch, googleMaps, t }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <SummaryItem
      icon={<Search className="w-5 h-5 text-primary" />}
      title={t("googleSearchViews")}
      data={googleSearch}
      t={t}
    />
    <SummaryItem
      icon={<MapPin className="w-5 h-5 text-red-600" />}
      title={t("googleMapsViews")}
      data={googleMaps}
      t={t}
    />
  </div>
));

interface SummaryItemProps {
  icon: React.ReactNode;
  title: any;
  data: any;
  t: (key: string, options?: any) => any;
}

const SummaryItem = React.memo<SummaryItemProps>(({ icon, title, data, t }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-gray-700">{title}</span>
    </div>

    <p className="text-3xl font-bold text-gray-900">
      {data?.current_period ?? 0}
    </p>

    <p
      className={`text-sm flex items-center gap-1 ${
        data?.trend === "up" ? "text-green-600" : "text-red-600"
      }`}
    >
      {data?.trend === "up" ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      )}

      {data?.percentage_change > 0 ? "+" : ""}
      {t("percentageChange", { value: data?.percentage_change ?? 0 })}
    </p>
  </div>
));

interface LegendControlsProps {
  visibleBars: { search: boolean; maps: boolean };
  toggleBar: (barName: any) => void;
  t: (key: string, options?: any) => any;
}

const LegendControls = React.memo<LegendControlsProps>(({ visibleBars, toggleBar, t }) => (
  <div className="flex justify-center mt-4">
    <div className="flex gap-4 text-sm">
      {/* Search Toggle */}
      <LegendButton
        active={visibleBars.search}
        color={PRIMARY_COLOR}
        text={t("searchViewsLegend")}
        onClick={() => toggleBar("search")}
      />

      {/* Maps Toggle */}
      <LegendButton
        active={visibleBars.maps}
        color={MAPS_COLOR}
        text={t("mapsViewsLegend")}
        onClick={() => toggleBar("maps")}
      />
    </div>
  </div>
));

interface LegendButtonProps {
  active: any;
  color: string;
  text: any;
  onClick: () => void;
}

const LegendButton = React.memo<LegendButtonProps>(({ active, color, text, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
      !active ? "opacity-50" : ""
    }`}
  >
    <div className="w-3 h-3 rounded" style={{ background: color }}></div>
    <span className={!active ? "line-through" : ""}>{text}</span>
  </button>
));
