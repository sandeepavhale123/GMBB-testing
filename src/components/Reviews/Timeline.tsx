import React from 'react';
interface TimelineProps {
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  isLast?: boolean;
}
export const Timeline: React.FC<TimelineProps> = ({
  date,
  isLast = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  return;
};