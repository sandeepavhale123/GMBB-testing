import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchTopKeywordQuery } from "../../store/slices/insightsSlice";
import { useListingContext } from "../../context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface QueryItemProps {
  query: any;
  placeholder: string;
}

const QueryItem = React.memo<QueryItemProps>(({ query, placeholder }) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <span className="text-sm font-medium text-gray-900">{query.keyword}</span>
    <span className="text-sm text-gray-600">
      {parseInt(query.impressions) > 15 ? query.impressions : placeholder}
    </span>
  </div>
));

export const TopSearchQueriesWithAPI: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const dispatch = useAppDispatch();
  const hasFetched = useRef(new Set());

  const { selectedListing } = useListingContext();
  const { topKeywordQuery, isLoadingTopKeywordQuery, topKeywordQueryError } =
    useAppSelector((state) => state.insights);

  const { t } = useI18nNamespace("Insights/topSearchQueriesWithAPI");

  const availableRecords = useMemo(
    () => topKeywordQuery?.avaialbleRecords || [],
    [topKeywordQuery?.avaialbleRecords]
  );

  const monthData = useMemo(
    () => topKeywordQuery?.Monthdata || [],
    [topKeywordQuery?.Monthdata]
  );

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  const getDefaultMonth = () =>
    new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  useEffect(() => {
    if (!selectedListing?.id) return;

    const month = selectedMonth || availableRecords.at(-1) || getDefaultMonth();
    setSelectedMonth(month);

    const cacheKey = `${selectedListing.id}-${month}`;
    if (hasFetched.current.has(cacheKey)) return;

    hasFetched.current.add(cacheKey);

    dispatch(
      fetchTopKeywordQuery({
        listingId: Number(selectedListing.id),
        month,
      })
    );
  }, [selectedListing?.id, selectedMonth, availableRecords]);

  // Sync selectedMonth with API response MonthName
  useEffect(() => {
    if (topKeywordQuery?.MonthName && topKeywordQuery.MonthName !== selectedMonth) {
      setSelectedMonth(topKeywordQuery.MonthName);
    }
  }, [topKeywordQuery?.MonthName]);

  // Ensure selectedMonth is always a valid option from availableRecords
  useEffect(() => {
    if (availableRecords.length > 0 && selectedMonth && !availableRecords.includes(selectedMonth)) {
      setSelectedMonth(availableRecords.at(-1) || "");
    }
  }, [availableRecords, selectedMonth]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              {t("topSearchQueriesWithAPI.title")}
            </CardTitle>
          </div>

          {availableRecords.length > 0 && (
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t(
                    "topSearchQueriesWithAPI.selectMonthPlaceholder"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {availableRecords.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {t("topSearchQueriesWithAPI.description")}
        </p>
      </CardHeader>

      <CardContent>
        {isLoadingTopKeywordQuery ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : topKeywordQueryError ? (
          <div className="text-center py-8 text-red-600">
            {t("topSearchQueriesWithAPI.loadingErrorTitle")}
          </div>
        ) : monthData.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {monthData.map((query) => (
                <QueryItem
                  key={query.id}
                  query={query}
                  placeholder={t(
                    "topSearchQueriesWithAPI.impressionBelowThreshold"
                  )}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {t("topSearchQueriesWithAPI.noDataMessage")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
