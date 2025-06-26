
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusItemProps {
  label: string;
  status: 'complete' | 'incomplete' | 'pending';
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'incomplete':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      {getStatusIcon()}
    </div>
  );
};

export const ListingPresenceSection: React.FC = () => {
  const businessInfo = [
    { label: 'Phone Number', status: 'complete' as const },
    { label: 'Website', status: 'complete' as const },
    { label: 'Business Hours', status: 'complete' as const },
    { label: 'Description', status: 'incomplete' as const },
    { label: 'Appointment URL', status: 'pending' as const },
    { label: 'Category', status: 'complete' as const },
    { label: 'Map URL', status: 'complete' as const },
  ];

  const photos = [
    { label: 'Profile Photo', status: 'complete' as const },
    { label: 'Cover Photo', status: 'incomplete' as const },
    { label: 'Logo', status: 'complete' as const },
    { label: 'Interior Photos', status: 'complete' as const },
    { label: 'Exterior Photos', status: 'complete' as const },
    { label: 'Team Photos', status: 'incomplete' as const },
    { label: 'Work Photos', status: 'complete' as const },
    { label: 'Additional Photos', status: 'complete' as const },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Listing Presence</CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-700">82%</Badge>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="business-info">
            <AccordionTrigger>Business Information</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {businessInfo.map((item, index) => (
                  <StatusItem key={index} {...item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="photos">
            <AccordionTrigger>Photos</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {photos.map((item, index) => (
                  <StatusItem key={index} {...item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="listing-status">
            <AccordionTrigger>Listing Status</AccordionTrigger>
            <AccordionContent>
              <StatusItem label="Verified Status" status="complete" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
