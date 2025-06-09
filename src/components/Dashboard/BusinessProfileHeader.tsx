
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Settings } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const BusinessProfileHeader: React.FC = () => {
  const { businessProfile } = useAppSelector((state) => state.dashboard);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={businessProfile.avatar}
              alt={businessProfile.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {businessProfile.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {businessProfile.address}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {businessProfile.lastUpdated}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Listing
            </Button>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
