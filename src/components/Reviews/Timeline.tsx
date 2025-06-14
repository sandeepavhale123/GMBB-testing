
import React from 'react';

interface TimelineProps {
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  isLast?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ sentiment, date, isLast = false }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center min-w-[60px] mr-4">
      {/* Date Badge */}
      <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md mb-2 font-medium whitespace-nowrap">
        {formatDate(date)}
      </div>
      
      {/* Timeline Dot */}
      <div className={`w-3 h-3 rounded-full ${getSentimentColor(sentiment)} border-2 border-white shadow-md relative z-10`} />
      
      {/* Connecting Line */}
      {!isLast && (
        <div className="w-0.5 h-20 bg-gray-300 mt-2" />
      )}
    </div>
  );
};
