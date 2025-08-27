import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const CheckRanking: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Check Rank</h1>
        <p className="text-muted-foreground">Monitor your local search rankings across different locations</p>
      </div>

      {/* Integration Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This page will integrate with the existing GEO Ranking components from the main dashboard. 
          The Geo Ranking Map and Report Configuration will be embedded here.
        </AlertDescription>
      </Alert>

      {/* Placeholder for GEO Ranking Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Keyword & Location Selection Form</p>
              </div>
              <div className="text-sm text-muted-foreground">
                • Select keywords to track
                <br />
                • Choose target locations
                <br />
                • Configure ranking parameters
                <br />
                • Set up monitoring schedule
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geo Ranking Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interactive Map Display</p>
              </div>
              <div className="text-sm text-muted-foreground">
                • Visual ranking display on map
                <br />
                • Click markers for detailed rankings
                <br />
                • Color-coded performance indicators
                <br />
                • Competitor analysis overlay
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Ranking results will appear here</p>
              <p className="text-sm text-muted-foreground">
                Configure your search parameters above and click "Check Rankings" to see results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Note */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Development Note:</strong> This page will be connected to the existing GEO ranking functionality 
          from the main dashboard, including the GeoRankingReportForm and GeoRankingReportMap components. 
          The useGeoRanking hook will be integrated to provide full ranking check functionality.
        </AlertDescription>
      </Alert>
    </div>
  );
};