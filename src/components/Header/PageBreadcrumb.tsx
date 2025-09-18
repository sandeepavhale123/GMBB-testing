import React from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useAccountListings } from "../../hooks/useAccountListings";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PageBreadcrumb: React.FC = () => {
  const { t } = useI18nNamespace("Header/pageBreadcrumb");
  const location = useLocation();
  const { accountId } = useParams();

  const routeToBreadcrumb: Record<string, { title: string; path: string }[]> = {
    "/": [{ title: t("dashboard"), path: "/location-dashboard" }],
    "/location-dashboard": [
      { title: t("dashboard"), path: "/location-dashboard" },
    ],
    "/ai-tasks": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("aiTasks"), path: "/ai-tasks" },
    ],
    "/profile": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("profile"), path: "/profile" },
    ],
    "/posts": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("posts"), path: "/posts" },
    ],
    "/media": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("mediaLibrary"), path: "/media" },
    ],
    "/reviews": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("reviews"), path: "/reviews" },
    ],
    "/qa": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("qa"), path: "/qa" },
    ],
    "/business-info": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("businessInfo"), path: "/business-info" },
    ],
    "/settings": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
    ],
    "/settings/google-account": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("manageGoogleAccount"), path: "/settings/google-account" },
    ],
    "/settings/subscription": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("subscription"), path: "/settings/subscription" },
    ],
    "/settings/branding": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("branding"), path: "/settings/branding" },
    ],
    "/settings/theme-customization": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("themeCustomization"), path: "/settings/theme-customization" },
    ],
    "/settings/report-branding": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("reportBranding"), path: "/settings/report-branding" },
    ],
    "/settings/integrations": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("integrations"), path: "/settings/integrations" },
    ],
    "/settings/listings": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("manageGoogleAccount"), path: "/settings/google-account" },
    ],
    "/insights": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("insights"), path: "/insights" },
    ],
    "/keywords/:id": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("keywords"), path: "" },
    ],
    "/keywords/:id/add": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("keywords"), path: "/keywords" },
      { title: t("searchKeyword"), path: "" },
    ],
    "/geo-ranking": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("geoRanking"), path: "/geo-ranking" },
    ],
    "/geo-ranking-report": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("geoRanking"), path: "/geo-ranking" },
      { title: t("geoRankingReport"), path: "/geo-ranking-report" },
    ],
    "/citation": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("citationManagement"), path: "/citation" },
    ],
    "/health": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("gmbHealth"), path: "/health" },
    ],
    "/analytics": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("analytics"), path: "/analytics" },
    ],
    "/team": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("team"), path: "/team" },
    ],
    "/notifications": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("notifications"), path: "/notifications" },
    ],
    "/reports": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("reports"), path: "/reports" },
    ],
    "/bulk-reports": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("bulkReport"), path: "/bulk-reports" },
    ],
    "/generate-bulk-reports": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("bulkReport"), path: "/bulk-reports" },
      { title: t("generateBulkReport"), path: "/generate-bulk-reports" },
    ],
    "/view-bulk-report-details": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("bulkReport"), path: "/bulk-reports" },
      { title: t("viewBulkReport"), path: "/view-bulk-report-details" },
    ],
    "/ai-chatbot": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("geoRanking"), path: "/geo-ranking" },
      { title: t("aiGenieAssistance"), path: "/ai-chatbot" },
    ],
    "/settings/team-members": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("teamMembers"), path: "/settings/team-members" },
    ],
    "/gallery": [
      { title: t("dashboard"), path: "/location-dashboard" },
      { title: t("gallery"), path: "/gallery" },
    ],
  };

  // Fetch account data to get the profile email
  const { profileEmail } = useAccountListings({
    accountId: accountId || "",
    page: 1,
    limit: 1,
  });

  // Extract the base route from the pathname (handle routes with listing IDs)
  const getBaseRoute = (pathname: string) => {
    const segments = pathname.split("/");
    if (segments.length >= 2) {
      // Handle special case for settings sub-routes
      if (segments[1] === "settings" && segments[2]) {
        if (segments[2] === "listings") {
          return "/settings/listings";
        }
        if (segments[2] === "team-members" && segments[3] === "edit") {
          return "/settings/team-members";
        }
        return `/settings/${segments[2]}`;
      }
      // Handle special case for keywords/add route
      if (segments[1] === "keywords" && segments[3] === "add") {
        return "/keywords/:id/add";
      }
      // Handle special case for keywords/:id route
      if (segments[1] === "keywords" && segments[2] && !segments[3]) {
        return "/keywords/:id";
      }
      return `/${segments[1]}`;
    }
    return pathname;
  };

  const baseRoute = getBaseRoute(location.pathname);
  let breadcrumbItems = routeToBreadcrumb[baseRoute] || [
    { title: t("dashboard"), path: "/" },
  ];

  // Customize breadcrumb for listings management page
  if (baseRoute === "/settings/listings" && accountId && profileEmail) {
    breadcrumbItems = [
      { title: t("dashboard"), path: "/" },
      { title: t("settings"), path: "/settings" },
      { title: t("manageGoogleAccount"), path: "/settings/google-account" },
      { title: profileEmail, path: `/settings/listings/${accountId}` },
    ];
  }

  // Customize breadcrumb for edit team member page
  if (
    baseRoute === "/settings/team-members" &&
    location.pathname.includes("/edit/")
  ) {
    const memberId = location.pathname.split("/").pop();
    breadcrumbItems = [
      { title: t("dashboard"), path: "/" },
      { title: t("settings"), path: "/settings" },
      { title: t("teamMembers"), path: "/settings/team-members" },
      { title: `${t("editTeamMember")} #${memberId}`, path: location.pathname },
    ];
  }

  return (
    <Breadcrumb className="flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="text-sm text-gray-500">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.title}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
