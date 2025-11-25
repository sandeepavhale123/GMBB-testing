import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare, TrendingUp, BarChart3, Plus, ExternalLink } from "lucide-react";

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
    icon: "/lovable-uploads/social-icons/google.png",
    reviewCount: 856,
    lastSync: "2 hours ago",
  },
  {
    name: "Facebook",
    status: "connected",
    icon: "/lovable-uploads/social-icons/facebook.png",
    reviewCount: 234,
    lastSync: "1 day ago",
  },
  {
    name: "Yelp",
    status: "disconnected",
    icon: "/lovable-uploads/social-icons/yelp.png",
    reviewCount: 0,
    lastSync: "Never",
  },
];

const Dashboard: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState("google");

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reputation Management Dashboard.</h1>
          <p className="text-muted-foreground">Monitor and manage your online reputation across all platforms</p>
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
                  <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                  <div className="text-3xl font-bold text-foreground">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className={`${card.bgColor} rounded-lg p-3 flex items-center justify-center ml-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected Channels - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
        {/* Left: Channels List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channels</CardTitle>
            <p className="text-sm text-muted-foreground">Manage channels</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {mockConnectedChannels.map((channel, index) => (
                <React.Fragment key={channel.name}>
                  <div className="py-4 px-2 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      {/* Channel Icon - Placeholder for actual icons */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img src={channel.icon} alt={channel.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Channel Info - Single Column */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm mb-1 truncate">{channel.name}</h4>
                        {channel.status === "connected" ? (
                          <div className="space-y-2">
                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                              <span className="text-xs font-medium text-foreground ml-0.5">4.5</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-xs text-muted-foreground block">Not connected</span>
                          </div>
                        )}
                      </div>
                      {channel.status === "connected" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Connected
                        </span>
                      ) : (
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Divider - Don't show after last item */}
                  {index < mockConnectedChannels.length - 1 && <div className="border-b border-border/60" />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Review Tracking Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedChannel === "google" && "Google Review Tracking"}
                  {selectedChannel === "facebook" && "Facebook Review Tracking"}
                  {selectedChannel === "yelp" && "Yelp Review Tracking"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="yelp">Yelp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              {/* Mock chart visualization */}
              <div className="relative h-full w-full">
                <svg className="w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="56" x2="400" y2="56" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.2" />
                  <line x1="0" y1="112" x2="400" y2="112" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.2" />
                  <line x1="0" y1="168" x2="400" y2="168" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.2" />
                  <line x1="0" y1="224" x2="400" y2="224" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.2" />

                  {/* Area gradient */}
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path
                    d="M 0 240 L 0 220 C 50 210, 100 180, 150 160 C 200 140, 250 120, 300 100 C 350 80, 380 60, 400 50 L 400 240 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* Line */}
                  <path
                    d="M 0 220 C 50 210, 100 180, 150 160 C 200 140, 250 120, 300 100 C 350 80, 380 60, 400 50"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                  />
                </svg>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2">
                  <span>25</span>
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-8 pb-2">
                  <span>Jun '24</span>
                  <span>02 Jun</span>
                  <span>03 Jun</span>
                  <span>04 Jun</span>
                  <span>05 Jun</span>
                  <span>06 Jun</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <hr />
      <div className="flex justify-end">
        <p onClick={() => navigate("/module/reputation/onboarding")}>Onboarding Step</p>
      </div>
    </div>
  );
};

export default Dashboard;
