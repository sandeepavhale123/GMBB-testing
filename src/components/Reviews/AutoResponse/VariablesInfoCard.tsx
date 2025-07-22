
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

export const VariablesInfoCard: React.FC = () => {
  return (
    <Card className="bg-blue-50 border border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Available Variables & Pipe Separator</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Use in templates:</strong> {"{full_name}"}, {"{first_name}"}, {"{last_name}"}</p>
              <p><strong>Pipe (|) to create variations:</strong> Thank you | Thanks so much | Thank you very much</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
