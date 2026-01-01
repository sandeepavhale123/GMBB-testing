import React from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
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
    "/": [{ title: t("dashboard"), path: "/dashboard" }],
    "/dashboard": [{ title: t("dashboard"), path: "/dashboard" }],
    "/profile": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("profile"), path: "/profile" },
    ],
    "/settings": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("settings"), path: "/settings" },
    ],
    "/settings/subscription": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("subscription"), path: "/settings/subscription" },
    ],
    "/settings/branding": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("branding"), path: "/settings/branding" },
    ],
    "/settings/team-members": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("settings"), path: "/settings" },
      { title: t("teamMembers"), path: "/settings/team-members" },
    ],
    "/team": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("team"), path: "/team" },
    ],
    "/notifications": [
      { title: t("dashboard"), path: "/dashboard" },
      { title: t("notifications"), path: "/notifications" },
    ],
  };

  // Extract the base route from the pathname (handle routes with listing IDs)
  const getBaseRoute = (pathname: string) => {
    const segments = pathname.split("/");
    if (segments.length >= 2) {
      // Handle special case for settings sub-routes
      if (segments[1] === "settings" && segments[2]) {
        if (segments[2] === "team-members" && segments[3] === "edit") {
          return "/settings/team-members";
        }
        return `/settings/${segments[2]}`;
      }
      return `/${segments[1]}`;
    }
    return pathname;
  };

  const baseRoute = getBaseRoute(location.pathname);
  let breadcrumbItems = routeToBreadcrumb[baseRoute] || [
    { title: t("dashboard"), path: "/" },
  ];

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
