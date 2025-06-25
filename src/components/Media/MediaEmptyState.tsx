
import React from 'react';

export const MediaEmptyState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Media</h2>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">Please select a business listing to view media.</p>
      </div>
    </div>
  );
};
