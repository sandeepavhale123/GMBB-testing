
import React, { useState } from 'react';
import { GMBHealthHeader } from './GMBHealthHeader';
import { GMBHealthStats } from './GMBHealthStats';
import { ListingPresenceSection } from './ListingPresenceSection';
import { ListingReputationSection } from './ListingReputationSection';
import { ListingInsightsSection } from './ListingInsightsSection';
import { CommunicationSection } from './CommunicationSection';

export const GMBHealthReportPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <GMBHealthHeader />
      <GMBHealthStats />
      <div className="grid gap-6">
        <ListingPresenceSection />
        <ListingReputationSection />
        <ListingInsightsSection />
        <CommunicationSection />
      </div>
    </div>
  );
};
