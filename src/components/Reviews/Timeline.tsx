
import React from 'react';

interface TimelineProps {
  date: string;
  isLast: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ date, isLast }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Date Badge */}
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
        {date}
      </div>
      
      {/* Connecting Line */}
      {!isLast && (
        <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
      )}
    </div>
  );
};
