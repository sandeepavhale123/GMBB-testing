import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  MousePointer,
  Navigation,
  Phone,
  MessageSquare,
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { Link, useLocation } from "react-router-dom";
import { useListingContext } from "../../context/ListingContext";

interface CustomerInteractionsCardProps {
  isLoadingSummary: boolean;
  summary: any;
}

export const CustomerInteractionsCard: React.FC< 
  CustomerInteractionsCardProps
> = ({ isLoadingSummary, summary }) => {
  const { selectedListing } = useListingContext();
  const location = useLocation();
  const isInsightsPage = location.pathname.startsWith("/insights/");

  const { t } = useI18nNamespace("Insights/customerInteractionsCard");
  // Create customer actions data from summary
  const customerActionsData = summary
    ? [
        {
          icon: Phone,
          label: t("callsLabel"),
          value: summary.customer_actions.phone_calls.value,
          change: `${
            summary.customer_actions.phone_calls.change_percentage > 0
              ? "+"
              : ""
          }${summary.customer_actions.phone_calls.change_percentage}%`,
          trend: summary.customer_actions.phone_calls.trend,
        },
        {
          icon: MousePointer,
          label: t("websiteLabel"),
          value: summary.customer_actions.website_clicks.value,
          change: `${
            summary.customer_actions.website_clicks.change_percentage > 0
              ? "+"
              : ""
          }${summary.customer_actions.website_clicks.change_percentage}%`,
          trend: summary.customer_actions.website_clicks.trend,
        },
        {
          icon: Navigation,
          label: t("directionLabel"),
          value: summary.customer_actions.direction_requests.value,
          change: `${
            summary.customer_actions.direction_requests.change_percentage > 0
              ? "+"
              : ""
          }${summary.customer_actions.direction_requests.change_percentage}%`,
          trend: summary.customer_actions.direction_requests.trend,
        },
        {
          icon: MessageSquare,
          label: t("messagesLabel"),
          value: summary.customer_actions.messages.value,
          change: `${
            summary.customer_actions.messages.change_percentage > 0 ? "+" : ""
          }${summary.customer_actions.messages.change_percentage}%`,
          trend: summary.customer_actions.messages.trend,
        },
        {
          icon: Search,
          label: t("desktopSearchLabel"),
          value: summary.customer_actions.desktop_search.value,
          change: `${
            summary.customer_actions.desktop_search.change_percentage > 0
              ? "+"
              : ""
          }${summary.customer_actions.desktop_search.change_percentage}%`,
          trend: summary.customer_actions.desktop_search.trend,
        },
        {
          icon: MapPin,
          label: t("desktopMapLabel"),
          value: summary.customer_actions.desktop_map.value,
          change: `${
            summary.customer_actions.desktop_map.change_percentage > 0
              ? "+"
              : ""
          }${summary.customer_actions.desktop_map.change_percentage}%`,
          trend: summary.customer_actions.desktop_map.trend,
        },
        {
          icon: Search,
          label: t("mobileSearchLabel"),
          value: summary.customer_actions.mobile_search.value,
          change: `${
            summary.customer_actions.mobile_search.change_percentage > 0
              ? "+"
              : ""
          }${summary.customer_actions.mobile_search.change_percentage}%`,
          trend: summary.customer_actions.mobile_search.trend,
        },
        {
          icon: MapPin,
          label: t("mobileMapLabel"),
          value: summary.customer_actions.mobile_map.value,
          change: `${
            summary.customer_actions.mobile_map.change_percentage > 0 ? "+" : ""
          }${summary.customer_actions.mobile_map.change_percentage}%`,
          trend: summary.customer_actions.mobile_map.trend,
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {t("customerInteractionsTitle")}
          </CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xll:grid-cols-3 gap-6">
            {customerActionsData.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {action.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {action.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {action.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        action.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {action.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
