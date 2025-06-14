import React from 'react';
interface TimelineProps {
  date: string;
  isLast: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
}
export const Timeline: React.FC<TimelineProps> = ({
  date,
  isLast,
  sentiment
}) => {
  return;
};