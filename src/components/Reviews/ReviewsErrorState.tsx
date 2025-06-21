
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface ReviewsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ReviewsErrorState: React.FC<ReviewsErrorStateProps> = ({
  error,
  onRetry
}) => {
  return (
    <Card className="bg-white border border-red-200">
      <CardContent className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};
