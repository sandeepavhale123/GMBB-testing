
import React from 'react';

interface TimelineProps {
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  isLast?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ date, isLast = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center min-w-[60px] mr-4">
      {/* Date Badge */}
      <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap relative z-10">
        {formatDate(date)}
      </div>
      
      {/* Connecting Line - starts from date badge */}
      {!isLast && (
        <div className="w-0.5 h-20 bg-gray-300 mt-1" />
      )}
    </div>
  );
};
