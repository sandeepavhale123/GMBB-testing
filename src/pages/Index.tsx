import React from "react";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { PostsPage } from "../components/Posts/PostsPage";
import { MediaPage } from "../components/Media/MediaPage";
import { InsightsPage } from "../components/Insights/InsightsPage";
import { GeoRankingPage } from "../components/GeoRanking/GeoRankingPage";
import { ReviewsManagementPage } from '../components/Reviews/ReviewsManagementPage';
import { QAManagementPage } from '../components/QA/QAManagementPage';
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  // Determine active tab from URL
  const getActiveTabFromUrl = () => {
    const pathParts = location.pathname.split('/');
    const route = pathParts[1];
    
    switch (route) {
      case 'location-dashboard':
        return 'overview';
      case 'posts':
        return 'posts';
      case 'media':
        return 'media';
      case 'insights':
        return 'insights';
      case 'geo-ranking':
        return 'geo-ranking';
      case 'reviews':
        return 'reviews';
      case 'qa':
        return 'qa';
      default:
        return 'overview';
    }
  };

  const activeTab = getActiveTabFromUrl();

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Dashboard />;
      case "posts":
        return <PostsPage />;
      case "media":
        return <MediaPage />;
      case "insights":
        return <InsightsPage />;
      case "geo-ranking":
        return <GeoRankingPage />;
      case 'reviews':
        return <ReviewsManagementPage />;
      case 'qa':
        return <QAManagementPage />;
      default:
        return (
          <div className="space-y-6 p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Coming Soon
              </h2>
              <p className="text-gray-600">This section is coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};

export default Index;