import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, MessageSquare, HelpCircle, Image, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const communicationItems = [
  { 
    label: 'Recent Posts', 
    status: 'active', 
    value: '3 this month',
    icon: <Image className="w-5 h-5 text-blue-600" />,
    description: 'Regular posting keeps your listing active'
  },
  { 
    label: 'Q&A Responses', 
    status: 'needs-attention', 
    value: '2 unanswered',
    icon: <HelpCircle className="w-5 h-5 text-orange-600" />,
    description: 'Some questions need responses'
  },
  { 
    label: 'Review Responses', 
    status: 'active', 
    value: '95% replied',
    icon: <MessageSquare className="w-5 h-5 text-green-600" />,
    description: 'Great response rate to customer reviews'
  },
  { 
    label: 'Business Updates', 
    status: 'active', 
    value: 'All current',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    description: 'Information is up to date'
  }
];

export const CommunicationSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Communication</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">80%</span>
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
              {communicationItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.value}</p>
                    <div className={cn(
                      "text-xs px-2 py-1 rounded-full inline-block",
                      item.status === 'active' && "bg-green-100 text-green-700",
                      item.status === 'needs-attention' && "bg-orange-100 text-orange-700"
                    )}>
                      {item.status === 'active' ? 'Good' : 'Needs Attention'}
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