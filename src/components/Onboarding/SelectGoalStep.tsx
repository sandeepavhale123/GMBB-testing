import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Target, TrendingUp, Users, MessageSquare, Calendar, Star } from 'lucide-react';

interface SelectGoalStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const SelectGoalStep = ({ formData, updateFormData, onNext }: SelectGoalStepProps) => {
  const [selectedGoals, setSelectedGoals] = useState(formData.goals || []);

  const goals = [
    {
      id: 'increase-visibility',
      title: 'Increase Online Visibility',
      description: 'Improve local search rankings and get found by more customers',
      icon: TrendingUp
    },
    {
      id: 'manage-reviews',
      title: 'Manage Customer Reviews',
      description: 'Monitor, respond to, and improve your online reputation',
      icon: Star
    },
    {
      id: 'engage-customers',
      title: 'Engage with Customers',
      description: 'Create posts, share updates, and connect with your audience',
      icon: MessageSquare
    },
    {
      id: 'track-performance',
      title: 'Track Performance',
      description: 'Monitor insights, analytics, and business metrics',
      icon: Target
    },
    {
      id: 'automate-posting',
      title: 'Automate Content Posting',
      description: 'Schedule and automate your Google Business posts',
      icon: Calendar
    },
    {
      id: 'grow-audience',
      title: 'Grow Local Audience',
      description: 'Attract more local customers and increase foot traffic',
      icon: Users
    }
  ];

  const handleGoalToggle = (goalId: string) => {
    const updatedGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id: string) => id !== goalId)
      : [...selectedGoals, goalId];
    setSelectedGoals(updatedGoals);
  };

  const handleNext = () => {
    updateFormData({ goals: selectedGoals });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          What are your main goals?
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Select all that apply. We'll customize your experience based on your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {goals.map((goal) => {
          const IconComponent = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          
          return (
            <Card 
              key={goal.id}
              className={`p-4 sm:p-5 lg:p-6 cursor-pointer transition-all duration-200 border-2 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleGoalToggle(goal.id)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <Checkbox 
                  checked={isSelected}
                  className="mt-0.5 sm:mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">{goal.title}</h3>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">{goal.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          onClick={handleNext}
          disabled={selectedGoals.length === 0}
          className="px-6 sm:px-8 py-2 text-sm sm:text-base h-10"
        >
          Continue ({selectedGoals.length} selected)
        </Button>
      </div>
    </div>
  );
};

export default SelectGoalStep;
