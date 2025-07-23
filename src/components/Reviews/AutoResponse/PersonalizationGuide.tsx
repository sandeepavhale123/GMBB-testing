
import React from 'react';
import { Info } from 'lucide-react';

export const PersonalizationGuide: React.FC = () => {
  const variables = [
    { name: '{full_name}', description: "Reviewer's full name" },
    { name: '{first_name}', description: "Reviewer's first name" },
    { name: '{last_name}', description: "Reviewer's last name" },
    { name: '{owner_name}', description: "Your (business owner's) name" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Personalize Your Reply Templates
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        You can use the following variables while creating your templates to make 
        your responses more dynamic and personalized:
      </p>
      
      <div className="space-y-3">
        {variables.map((variable) => (
          <div 
            key={variable.name}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border"
          >
            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0">
              {variable.name}
            </code>
            <span className="text-sm text-gray-700">{variable.description}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Example Usage:</h4>
        <div className="bg-white p-3 rounded border text-sm">
          <p className="text-gray-700">
            "Hi {'{first_name}'}, thank you for your {'{rating}'}-star review! 
            We're glad you enjoyed your experience with us."
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Best regards,<br />
            {'{owner_name}'}
          </p>
        </div>
      </div>
    </div>
  );
};
