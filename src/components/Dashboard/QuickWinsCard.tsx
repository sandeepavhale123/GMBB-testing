import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, Clock, Camera, ArrowRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { completeQuickWin } from "../../store/slices/dashboardSlice";
import { useNavigate } from "react-router-dom";
interface QuickWin {
  task_key: number;
  task_name: string;
  task_description: string;
  due_date: string;
  frequency: string;
  sort_order: number;
}
interface QuickWinsCardProps {
  quickwins?: QuickWin[];
}
export const QuickWinsCard: React.FC<QuickWinsCardProps> = ({
  quickwins = []
}) => {
  const navigate = useNavigate();
  const getIcon = (taskName: string) => {
    if (taskName.toLowerCase().includes("photo")) return Camera;
    if (taskName.toLowerCase().includes("hours")) return Clock;
    return AlertTriangle;
  };
  const getPriorityColor = (frequency: string) => {
    // Map frequency to priority colors
    if (frequency === "high" || frequency === "daily") {
      return "text-red-600 bg-red-50";
    }
    if (frequency === "medium" || frequency === "weekly") {
      return "text-yellow-600 bg-yellow-50";
    }
    return "text-green-600 bg-green-50";
  };

  // Sort quickwins by sort_order
  const sortedQuickWins = [...quickwins].sort((a, b) => a.sort_order - b.sort_order);
  return <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">
              Quick Wins ({quickwins.length})
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Improve your listing with these quick actions.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {sortedQuickWins.length > 0 ? sortedQuickWins.slice(0, 3).map(win => {
        const Icon = getIcon(win.task_name);
        return <div key={win.task_key} className="flex items-center gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${getPriorityColor(win.frequency)}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                    {win.task_name}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block" title={win.task_description}>
                    {win.task_description.length > 25 ? win.task_description.slice(0, 25) + "..." : win.task_description}
                  </p>
                </div>
                <Button size="sm" className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground w-8 h-8 sm:w-auto sm:h-auto p-1 sm:px-3 sm:py-2" onClick={() => navigate("/ai-tasks")}>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>;
      }) : <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No quick wins available
            </p>
          </div>}
        <Button variant="outline" className="w-full text-xs sm:text-sm" onClick={() => navigate("/ai-tasks")}>
          View All Fixes
        </Button>
      </CardContent>
    </Card>;
};