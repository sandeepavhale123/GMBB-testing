
import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { AIResponseStyleDropdown } from './AIResponseStyleDropdown';
import { AIInstructionsTextarea } from './AIInstructionsTextarea';
import { AIResponseSettings } from './AIResponseSettings';
import { AITestResponse } from './AITestResponse';
import { AIPerformanceStats } from './AIPerformanceStats';

export const AIAutoResponseSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  const handleToggle = () => {
    setAiEnabled(!aiEnabled);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900">AI Auto Response</h2>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  AI Powered
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Let AI generate personalized, contextual responses based on review content and sentiment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={aiEnabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-purple-600"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="space-y-6">
            <AIResponseStyleDropdown />
            <AIInstructionsTextarea />
            <AIResponseSettings />
            <AITestResponse />
            <AIPerformanceStats />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
