
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthInitializer } from "@/store/slices/auth/AuthInitializer";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { GeoRankingReportPage } from "./components/GeoRanking/GeoRankingReportPage";
import PostsPage from "./pages/PostsPage";
import MediaPage from "./pages/MediaPage";
import InsightsPage from "./pages/InsightsPage";
import GeoRankingPage from "./pages/GeoRankingPage";
import ReviewsPage from "./pages/ReviewsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BusinessesPage from "./pages/BusinessesPage";
import TeamPage from "./pages/TeamPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import QAPage from "./pages/QAPage";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Initialize axios auth helpers - now inside Router context
  useAxiosAuth();

  return (
    <>
      {/* 👇 Kick off auth refresh if refresh token exists */}
      <AuthInitializer />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/location-dashboard" replace />}
        />
        <Route
          path="/location-dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
    
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/geo-ranking" element={<GeoRankingPage />} />
        <Route path="/geo-ranking-report" element={<GeoRankingReportPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/qa" element={<QAPage />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
