import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  BarChart3,
  Plus,
  ExternalLink 
} from "lucide-react";

// TODO: Replace with real API call when backend is ready
// Example: const { data: summaryData, isLoading } = useReputationSummary();
const mockSummaryCards = [
  {
    title: "Overall Rating",
    value: "4.8",
    subtitle: "Based on 1,234 reviews",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
  },
  {
    title: "Total Reviews",
    value: "1,234",
    subtitle: "Last 30 days: +45",
    icon: MessageSquare,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    title: "Response Rate",
    value: "92%",
    subtitle: "Average response time: 2h",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
  {
    title: "Sentiment Analysis",
    value: "85%",
    subtitle: "Positive sentiment",
    icon: BarChart3,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
];

// TODO: Replace with real API call when backend is ready
// Example: const { data: channels, isLoading } = useConnectedChannels();
const mockConnectedChannels = [
  { 
    name: "Google Business Profile", 
    status: "connected", 
    reviewCount: 856,
    lastSync: "2 hours ago"
  },
  { 
    name: "Facebook", 
    status: "connected", 
    reviewCount: 234,
    lastSync: "1 day ago"
  },
  { 
    name: "Yelp", 
    status: "disconnected", 
    reviewCount: 0,
    lastSync: "Never"
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Reputation Management Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your online reputation across all platforms
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockSummaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </h3>
                  <div className="text-3xl font-bold text-foreground">
                    {card.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div
                  className={`${card.bgColor} rounded-lg p-3 flex items-center justify-center ml-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected Channels */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Connected Channels</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Channel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockConnectedChannels.map((channel) => (
              <div
                key={channel.name}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{channel.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          channel.status === "connected"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {channel.status === "connected" ? "Connected" : "Disconnected"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {channel.reviewCount} reviews
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Last sync: {channel.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
