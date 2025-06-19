
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { MousePointer, Navigation, Phone, MessageSquare, Search, MapPin, TrendingUp, TrendingDown } from 'lucide-react';

interface CustomerInteractionsCardProps {
  isLoadingSummary: boolean;
  isLoadingCustomerActions: boolean;
  customerActionsData: any[];
}

export const CustomerInteractionsCard: React.FC<CustomerInteractionsCardProps> = ({
  isLoadingSummary,
  isLoadingCustomerActions,
  customerActionsData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customer Interactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingSummary || isLoadingCustomerActions ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {customerActionsData.map((action, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <action.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">{action.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{action.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {action.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      action.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {action.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
