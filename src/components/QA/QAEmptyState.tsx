
import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

interface QAEmptyStateProps {
  hasQuestions: boolean;
}

export const QAEmptyState: React.FC<QAEmptyStateProps> = ({ hasQuestions }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircleQuestion className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {hasQuestions ? 'No questions match your filters' : 'No customer questions yet'}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {hasQuestions 
              ? 'Try adjusting your search criteria or filters to see more results.'
              : 'Encourage engagement on your listings to increase trust and discoverability.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
