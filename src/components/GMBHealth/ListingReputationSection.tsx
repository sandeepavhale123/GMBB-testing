import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const reputationMetrics = [
  { label: 'Average Rating', value: '4.8', status: 'excellent', icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> },
  { label: 'Total Reviews', value: '127', status: 'good' },
  { label: 'Recent Reviews', value: '12', status: 'good' },
  { label: 'Response Rate', value: '95%', status: 'excellent' },
  { label: 'Response Time', value: '2 hours', status: 'good' }
];

export const ListingReputationSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Listing Reputation</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">100%</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reputationMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    {metric.icon}
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full inline-block mt-2",
                    metric.status === 'excellent' && "bg-green-100 text-green-700",
                    metric.status === 'good' && "bg-blue-100 text-blue-700"
                  )}>
                    {metric.status === 'excellent' ? 'Excellent' : 'Good'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};