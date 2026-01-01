import React from 'react';
import { MessageSquare, Users, Clock, AlertTriangle, TrendingUp, CheckCircle, Download, XCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useChatAnalytics, ChatLog, exportToCSV } from '../../hooks/useChatAnalytics';
import { cn } from '@/lib/utils';

interface ChatAnalyticsProps {
  botId: string;
}

function formatTime(ms: number | null): string {
  if (ms === null) return '-';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getFallbackRateColor(rate: number): string {
  if (rate <= 10) return 'text-green-600';
  if (rate <= 25) return 'text-yellow-600';
  return 'text-red-600';
}

function getSimilarityBadge(similarity: number | null, usedFallback: boolean): React.ReactNode {
  if (usedFallback) {
    return <Badge variant="destructive" className="text-xs">Fallback</Badge>;
  }
  if (similarity === null) {
    return <Badge variant="secondary" className="text-xs">-</Badge>;
  }
  if (similarity >= 0.4) {
    return <Badge variant="default" className="text-xs bg-green-600">High</Badge>;
  }
  if (similarity >= 0.25) {
    return <Badge variant="secondary" className="text-xs">Medium</Badge>;
  }
  return <Badge variant="outline" className="text-xs">Low</Badge>;
}

function getSimilarityColor(similarity: number | null): string {
  if (similarity === null) return 'text-muted-foreground';
  if (similarity < 0.15) return 'text-red-600';
  if (similarity < 0.25) return 'text-yellow-600';
  return 'text-green-600';
}

export const ChatAnalytics: React.FC<ChatAnalyticsProps> = ({ botId }) => {
  const { data, isLoading, error } = useChatAnalytics(botId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Analytics</CardTitle>
          <CardDescription>Failed to load analytics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.totalMessages === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Analytics</CardTitle>
          <CardDescription>Track how users interact with your bot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-1">No conversations yet</h3>
            <p className="text-sm text-muted-foreground">
              Analytics will appear here once users start chatting with your bot.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { totalMessages, uniqueSessions, fallbackRate, avgResponseTime, avgSimilarity, recentLogs, missedQueries, lowSimilarityQueries, allLogs } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Analytics</CardTitle>
        <CardDescription>Last 30 days of conversation data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="missed" className="relative">
              Missed
              {missedQueries.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs justify-center">
                  {missedQueries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="low" className="relative">
              Low Match
              {lowSimilarityQueries.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs justify-center">
                  {lowSimilarityQueries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">Messages</span>
                  </div>
                  <p className="text-2xl font-bold">{totalMessages}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Sessions</span>
                  </div>
                  <p className="text-2xl font-bold">{uniqueSessions}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Avg Response</span>
                  </div>
                  <p className="text-2xl font-bold">{formatTime(avgResponseTime)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Fallback Rate</span>
                  </div>
                  <p className={cn('text-2xl font-bold', getFallbackRateColor(fallbackRate))}>
                    {fallbackRate.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Avg Similarity Indicator */}
            {avgSimilarity !== null && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Average match quality: <strong>{(avgSimilarity * 100).toFixed(0)}%</strong>
                </span>
                {avgSimilarity >= 0.35 && (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                )}
              </div>
            )}

            {/* Recent Queries Table */}
            <div>
              <h4 className="font-medium mb-3">Recent Conversations</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Time</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-20 text-center">Chunks</TableHead>
                      <TableHead className="w-24 text-center">Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(log.created_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {truncateText(log.user_message, 60)}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {log.chunks_retrieved}
                        </TableCell>
                        <TableCell className="text-center">
                          {getSimilarityBadge(log.top_similarity, log.used_fallback)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Missed Queries Tab */}
          <TabsContent value="missed" className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive">Missed Queries</h4>
                <p className="text-sm text-muted-foreground">
                  These questions triggered the fallback response because no relevant content was found in your knowledge base.
                </p>
              </div>
            </div>

            {missedQueries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600/50 mb-4" />
                <h3 className="font-medium text-lg mb-1">No missed queries!</h3>
                <p className="text-sm text-muted-foreground">
                  Your knowledge base is covering user questions well.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Time</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-1/3">Bot Response</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missedQueries.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(log.created_at)}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {truncateText(log.user_message, 80)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {truncateText(log.bot_response || '-', 60)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Low Matches Tab */}
          <TabsContent value="low" className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Search className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-700">Low Quality Matches</h4>
                <p className="text-sm text-muted-foreground">
                  These questions found some matches, but with low confidence. Consider adding more specific content for these topics.
                </p>
              </div>
            </div>

            {lowSimilarityQueries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600/50 mb-4" />
                <h3 className="font-medium text-lg mb-1">All matches are strong!</h3>
                <p className="text-sm text-muted-foreground">
                  No low-confidence matches in the last 30 days.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Time</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-24 text-center">Score</TableHead>
                      <TableHead className="w-20 text-center">Chunks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowSimilarityQueries.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(log.created_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {truncateText(log.user_message, 80)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn('font-medium', getSimilarityColor(log.top_similarity))}>
                            {log.top_similarity !== null ? `${(log.top_similarity * 100).toFixed(0)}%` : '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {log.chunks_retrieved}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Download className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download conversation logs from the last 30 days as CSV files.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">All Logs</h4>
                      <p className="text-sm text-muted-foreground">{allLogs.length} records</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => exportToCSV(allLogs, `chat-logs-${new Date().toISOString().split('T')[0]}`)}
                      disabled={allLogs.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Missed Queries Only</h4>
                      <p className="text-sm text-muted-foreground">{missedQueries.length} records</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => exportToCSV(missedQueries, `missed-queries-${new Date().toISOString().split('T')[0]}`)}
                      disabled={missedQueries.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
