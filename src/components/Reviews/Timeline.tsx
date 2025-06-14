
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="flex flex-col items-center mr-4">
      <div className={`w-3 h-3 rounded-full ${getSentimentColor(sentiment)} border-2 border-white shadow-md`} />
      {!isLast && <div className="w-0.5 h-16 bg-gray-300 mt-2" />}
      <span className="text-xs text-gray-500 mt-1 whitespace-nowrap transform -rotate-90 origin-center">
        {formatDate(date)}
      </span>
    </div>
  );
};
