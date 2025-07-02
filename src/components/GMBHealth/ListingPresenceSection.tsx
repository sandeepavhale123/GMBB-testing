import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const presenceItems = [
  { label: 'Business Name', status: 'complete', description: 'Your business name is properly set' },
  { label: 'Business Category', status: 'complete', description: 'Primary category is configured' },
  { label: 'Phone Number', status: 'complete', description: 'Contact number is verified' },
  { label: 'Business Address', status: 'complete', description: 'Location is accurate and verified' },
  { label: 'Business Hours', status: 'incomplete', description: 'Some hours need updating' },
  { label: 'Business Website', status: 'complete', description: 'Website URL is active' },
  { label: 'Business Description', status: 'incomplete', description: 'Description could be more detailed' }
];

export const ListingPresenceSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const completedItems = presenceItems.filter(item => item.status === 'complete').length;
  const totalItems = presenceItems.length;
  const percentage = Math.round((completedItems / totalItems) * 100);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Listing Presence</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{percentage}%</span>
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
            <div className="space-y-3">
              {presenceItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    {item.status === 'complete' ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
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