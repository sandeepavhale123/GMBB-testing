import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PageTitle: React.FC = () => {
  const { t } = useI18nNamespace("Header/pageTitle");
  const location = useLocation();
  const { accountId } = useParams();

  const routeToTitle: Record<string, { title: string; subtitle?: string }> = {
    "/": {
      title: t("dashboard.title"),
      subtitle: t("dashboard.subtitle"),
    },
    "/ai-tasks": {
      title: t("aiTasks.title"),
      subtitle: t("aiTasks.subtitle"),
    },
    "/profile": {
      title: t("profile.title"),
      subtitle: t("profile.subtitle"),
    },
    "/posts": {
      title: t("posts.title"),
      subtitle: t("posts.subtitle"),
    },
    "/media": {
      title: t("mediaLibrary.title"),
      subtitle: t("mediaLibrary.subtitle"),
    },
    "/reviews": {
      title: t("reviews.title"),
      subtitle: t("reviews.subtitle"),
    },
    "/qa": {
      title: t("qa.title"),
      subtitle: t("qa.subtitle"),
    },
    "/business-info": {
      title: t("businessInfo.title"),
      subtitle: t("businessInfo.subtitle"),
    },
    "/settings": {
      title: t("settings.title"),
      subtitle: t("settings.subtitle"),
    },
    "/settings/listings": {
      title: t("manageListings.title"),
      subtitle: t("manageListings.subtitle"),
    },
    "/insights": {
      title: t("insights.title"),
      subtitle: t("insights.subtitle"),
    },
    "/keywords": {
      title: t("keywords.title"),
      subtitle: t("keywords.subtitle"),
    },
    "/keywords/add": {
      title: t("searchKeyword.title"),
      subtitle: t("searchKeyword.subtitle"),
    },
    "/geo-ranking": {
      title: t("geoRanking.title"),
      subtitle: t("geoRanking.subtitle"),
    },
    "/geo-ranking-report": {
      title: t("geoRankingReport.title"),
      subtitle: t("geoRankingReport.subtitle"),
    },
    "/citation": {
      title: t("citationManagement.title"),
      subtitle: t("citationManagement.subtitle"),
    },
    "/analytics": {
      title: t("analytics.title"),
      subtitle: t("analytics.subtitle"),
    },
    "/team": {
      title: t("team.title"),
      subtitle: t("team.subtitle"),
    },
    "/notifications": {
      title: t("notifications.title"),
      subtitle: t("notifications.subtitle"),
    },
    "/location-dashboard": {
      title: t("dashboard.title"),
      subtitle: t("dashboard.subtitle"),
    },
    "/reports": {
      title: t("reports.title"),
      subtitle: t("reports.subtitle"),
    },
    "/ai-chatbot": {
      title: t("aiChatbot.title"),
      subtitle: t("aiChatbot.subtitle"),
    },
    "/settings/team-members/edit": {
      title: t("editTeamMember.title"),
      subtitle: t("editTeamMember.subtitle"),
    },
    "/gallery": {
      title: t("gallery.title"),
    },
    "/bulk-reports": {
      title: t("bulkReport.title"),
    },
  };

  // Extract the base route from the pathname (handle routes with listing IDs)
  const getBaseRoute = (pathname: string) => {
    const segments = pathname.split("/");
    if (segments.length >= 2) {
      // Handle special case for settings/listings route
      if (segments[1] === "settings" && segments[2] === "listings") {
        return "/settings/listings";
      }
      // Handle special case for settings/team-members/edit route
      if (
        segments[1] === "settings" &&
        segments[2] === "team-members" &&
        segments[3] === "edit"
      ) {
        return "/settings/team-members/edit";
      }
      // Handle special case for keywords/add route
      if (segments[1] === "keywords" && segments[3] === "add") {
        return "/keywords/add";
      }
      return `/${segments[1]}`;
    }
    return pathname;
  };

  const baseRoute = getBaseRoute(location.pathname);
  const pageInfo = routeToTitle[baseRoute] || {
    title: t("welcomeDashboard.title"),
    subtitle: t("welcomeDashboard.subtitle"),
  };

  return (
    <div className="min-w-0">
      <h5 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">
        {pageInfo.title}
      </h5>
    </div>
  );
};
