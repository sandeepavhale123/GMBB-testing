import React from "react";
import { Button } from "../ui/button";
import {
  HeartPulse,
  RefreshCcw,
  Star,
  Camera,
  FileText,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { HealthCard } from "./HealthCard";
import { HealthSection } from "./HealthSection";
import { InsightsChart } from "./InsightsChart";
import { InsightsGrid } from "./InsightsGrid";
import { HealthData } from "../../types/health";
import { useHealthReport } from "@/api/healthApi";
import { useListingContext } from "@/context/ListingContext";
import { CommunicationSectionComponent } from "./CommunicationSection";

export const Health: React.FC = () => {
  const { selectedListing } = useListingContext();

  const {
    data: healthData,
    loading,
    error,
    refreshHealthReport,
  } = useHealthReport(
    selectedListing?.id ? parseInt(selectedListing.id) : null
  );

  if (loading)
    return <div className="text-center py-10">Loading health data...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!healthData)
    return <div className="text-gray-500 text-center py-10">No data found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">GMB Health</h2>
        <Button
          onClick={refreshHealthReport}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCcw className="w-4 h-4 mr-1" />
          Refresh Health Report
        </Button>
      </div>

      {/* Health Metrics Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-6 lg:grid-cols-3 gap-4">
        <HealthCard
          title="GMB Health Score"
          value={`${healthData.healthScore}%`}
          subtitle="GMB Health Score"
          bgColor="bg-green-500"
          icon={HeartPulse}
        />
        <HealthCard
          title="Reviews"
          value={`${healthData.reviews.current}/${healthData.reviews.total}`}
          subtitle="No. Of Reviews"
          bgColor="bg-blue-500"
          icon={MessageSquare}
        />
        <HealthCard
          title="Q&A"
          value={`${healthData.questionsAnswers.questions}/${healthData.questionsAnswers.answers}`}
          subtitle="Que Vs Ans"
          bgColor="bg-indigo-500"
          icon={HelpCircle}
        />
        <HealthCard
          title="Rating"
          value={healthData.avgRating.toString()}
          subtitle="GMB Avg Rating"
          bgColor="bg-green-700"
          icon={Star}
        />
        <HealthCard
          title="Photos"
          value={healthData.gmbPhotos.toString()}
          subtitle="No. Of GMB Photos"
          bgColor="bg-green-900"
          icon={Camera}
        />
        <HealthCard
          title="Posts"
          value={healthData.gmbPosts.toString()}
          subtitle="No. Of GMB Posts"
          bgColor="bg-purple-300"
          icon={FileText}
        />
      </div>

      {/* Health Sections */}
      {healthData.sections.map((section) => (
        <HealthSection key={section.id} section={section} />
      ))}

      {/* Insights Section */}
      <Card className="bg-white">
        <CardHeader className="bg-blue-400 p-3 text-white text-sm font-semibold">
          <h3>LISTING INSIGHTS FOR LAST 90 DAYS (70%)</h3>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 p-4 gap-3">
          <InsightsGrid metrics={healthData.insightMetrics} />
          <InsightsChart data={healthData.chartData} />
        </div>
      </Card>

      {/* communication section */}
      {Array.isArray(healthData.communication) ? (
        healthData.communication.map((section) => (
          <CommunicationSectionComponent key={section.id} section={section} />
        ))
      ) : (
        <CommunicationSectionComponent
          key={healthData.communication.id}
          section={healthData.communication}
        />
      )}
    </div>
  );
};
