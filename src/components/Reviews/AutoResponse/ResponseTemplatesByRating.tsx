
import React from 'react';
import { RatingTemplateCard } from './RatingTemplateCard';

export const ResponseTemplatesByRating: React.FC = () => {
  const ratings = [
    { stars: 5, label: 'Five Stars' },
    { stars: 4, label: 'Four Stars' },
    { stars: 3, label: 'Three Stars' },
    { stars: 2, label: 'Two Stars' },
    { stars: 1, label: 'One Star' },
  ];

  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">Response Templates by Rating</h3>
      <div className="space-y-3">
        {ratings.map((rating) => (
          <RatingTemplateCard
            key={rating.stars}
            stars={rating.stars}
            label={rating.label}
          />
        ))}
      </div>
    </div>
  );
};
