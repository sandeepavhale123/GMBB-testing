import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, Eye, Phone, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const insightMetrics = [
  { label: 'Profile Views', value: '1,247', change: '+12%', icon: <Eye className="w-5 h-5 text-blue-600" /> },
  { label: 'Search Views', value: '892', change: '+8%', icon: <Globe className="w-5 h-5 text-green-600" /> },
  { label: 'Map Views', value: '355', change: '+15%', icon: <MapPin className="w-5 h-5 text-purple-600" /> },
  { label: 'Phone Calls', value: '67', change: '+5%', icon: <Phone className="w-5 h-5 text-orange-600" /> }
];

export const ListingInsightsSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Listing Insights</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">70%</span>
                </div>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "transform rotate-180"
              )} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insightMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    {metric.icon}
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-green-600 mt-1">{metric.change} vs last month</p>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};