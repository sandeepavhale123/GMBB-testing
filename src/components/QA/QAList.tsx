
import React from 'react';
import { QACard } from './QACard';
import { Question } from '../../types/qaTypes';

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
