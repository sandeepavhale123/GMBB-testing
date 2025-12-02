import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { SocialPosterLayout } from "@/modules/social-poster/components/PageLayout";
import { SocialPosterDashboard } from "@/modules/social-poster/pages/Dashboard";
import { SocialPosterPosts } from "@/modules/social-poster/pages/Posts";
import { SocialPosterCreatePost } from "@/modules/social-poster/pages/CreatePost";
import { SocialPosterEditPost } from "@/modules/social-poster/pages/EditPost";
import { SocialPosterAccounts } from "@/modules/social-poster/pages/Accounts";
import { RouteConfig } from "../routeConfig";

export const socialPosterModuleRoutes: RouteConfig[] = [
  {
    path: "/social-poster",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1, 2]}>
          <SocialPosterLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/social-poster/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <SocialPosterDashboard />,
      },
      {
        path: "posts",
        element: <SocialPosterPosts />,
      },
      {
        path: "posts/create",
        element: <SocialPosterCreatePost />,
      },
      {
        path: "posts/:postId/edit",
        element: <SocialPosterEditPost />,
      },
      {
        path: "accounts",
        element: <SocialPosterAccounts />,
      },
    ],
  },
];
