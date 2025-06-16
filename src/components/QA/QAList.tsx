
import React from 'react';
import { QACard } from './QACard';

export interface Question {
  id: string;
  question: string;
  listingName: string;
  location: string;
  userName: string;
  timestamp: string;
  status: 'answered' | 'unanswered';
  answer?: string | null;
}

interface QAListProps {
  questions: Question[];
}

export const QAList: React.FC<QAListProps> = ({ questions }) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QACard key={question.id} question={question} />
      ))}
    </div>
  );
};
