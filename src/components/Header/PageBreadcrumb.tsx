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

const routeToBreadcrumb: Record<string, { title: string; path: string }[]> = {
  "/": [{ title: "Dashboard", path: "/location-dashboard" }],
  "/location-dashboard": [{ title: "Dashboard", path: "/location-dashboard" }],
  "/ai-tasks": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "AI Tasks", path: "/ai-tasks" },
  ],
  "/profile": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Profile", path: "/profile" },
  ],
  "/posts": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Posts", path: "/posts" },
  ],
  "/media": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Media Library", path: "/media" },
  ],
  "/reviews": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Reviews", path: "/reviews" },
  ],
  "/qa": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Q&A", path: "/qa" },
  ],
  "/business-info": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Management", path: "/business-info" },
  ],
  "/settings": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
  ],
  "/settings/google-account": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Manage Google Account", path: "/settings/google-account" },
  ],
  "/settings/subscription": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Subscription", path: "/settings/subscription" },
  ],
  "/settings/branding": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Branding", path: "/settings/branding" },
  ],
  "/settings/theme-customization": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Theme Customization", path: "/settings/theme-customization" },
  ],
  "/settings/report-branding": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Report Branding", path: "/settings/report-branding" },
  ],
  "/settings/integrations": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Integrations", path: "/settings/integrations" },
  ],
  "/settings/listings": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Manage Google Account", path: "/settings/google-account" },
  ],
  "/insights": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Insights", path: "/insights" },
  ],
  "/keywords/:id": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Keywords", path: "" },
  ],
  "/keywords/:id/add": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Keywords", path: "/keywords" },
    { title: "Search Keyword", path: "" },
  ],
  "/geo-ranking": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "GEO Ranking", path: "/geo-ranking" },
  ],
  "/geo-ranking-report": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "GEO Ranking", path: "/geo-ranking" },
    { title: "Report", path: "/geo-ranking-report" },
  ],
  "/citation": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Citation Management", path: "/citation" },
  ],
  "/health": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "GMB Health", path: "/health" },
  ],
  "/analytics": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Analytics", path: "/analytics" },
  ],
  "/team": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Team", path: "/team" },
  ],
  "/notifications": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Notifications", path: "/notifications" },
  ],
  "/reports": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Reports", path: "/reports" },
  ],
  "/bulk-reports": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Bulk Report", path: "/bulk-reports" },
  ],
  "/generate-bulk-reports": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Bulk Report", path: "/bulk-reports" },
    { title: "Generate Bulk Report", path: "/generate-bulk-reports" },
  ],
  "/view-bulk-report-details": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Bulk Report", path: "/bulk-reports" },
    { title: "View Bulk Report", path: "/view-bulk-report-details" },
  ],
  "/ai-chatbot": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "GEO Ranking", path: "/geo-ranking" },
    { title: "AI Genie Assistance", path: "/ai-chatbot" },
  ],
  "/settings/team-members": [
    { title: "Dashboard", path: "/location-dashboard" },
    { title: "Settings", path: "/settings" },
    { title: "Team Members", path: "/settings/team-members" },
  ],
};

export const PageBreadcrumb: React.FC = () => {
  const location = useLocation();
  const { accountId } = useParams();

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
    { title: "Dashboard", path: "/" },
  ];

  // Customize breadcrumb for listings management page
  if (baseRoute === "/settings/listings" && accountId && profileEmail) {
    breadcrumbItems = [
      { title: "Dashboard", path: "/" },
      { title: "Settings", path: "/settings" },
      { title: "Manage Google Account", path: "/settings/google-account" },
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
      { title: "Dashboard", path: "/" },
      { title: "Settings", path: "/settings" },
      { title: "Team Members", path: "/settings/team-members" },
      { title: `Edit Team Member #${memberId}`, path: location.pathname },
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
