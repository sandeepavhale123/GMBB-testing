import React, { useState } from 'react';
import { Headphones, TrendingUp, Calendar, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBotWizard } from '../../context/BotWizardContext';
import { BotIntent, INTENT_TEMPLATES } from '../../types';
import { cn } from '@/lib/utils';
import { TemplateSelectionDialog } from './TemplateSelectionDialog';
import { useParams } from 'react-router-dom';

const intentIcons: Record<BotIntent, React.ReactNode> = {
  support: <Headphones className="w-8 h-8" />,
  sales: <TrendingUp className="w-8 h-8" />,
  appointment: <Calendar className="w-8 h-8" />,
  custom: <Bot className="w-8 h-8" />,
};

const intentDescriptions: Record<BotIntent, string> = {
  support: 'Answer customer questions, resolve issues, and provide helpful information',
  sales: 'Help customers find products, answer pricing questions, and guide purchases',
  appointment: 'Schedule, reschedule, and manage customer appointments',
  custom: 'Create a fully customized bot with your own instructions',
};

export const Step1Intent: React.FC = () => {
  const { formData, selectIntent, selectTemplate, nextStep } = useBotWizard();
  const { projectId } = useParams<{ projectId: string }>();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const handleSelectIntent = (intent: BotIntent) => {
    if (intent === 'custom') {
      setIsTemplateDialogOpen(true);
    } else {
      selectIntent(intent);
    }
  };

  const handleContinue = () => {
    if (formData.intent) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What type of bot do you want to create?</h2>
        <p className="text-muted-foreground mt-1">
          Choose a purpose for your bot. This will set up an initial system prompt that you can customize later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(INTENT_TEMPLATES) as BotIntent[]).map((intent) => (
          <Card
            key={intent}
            className={cn(
              'cursor-pointer transition-all hover:border-primary/50',
              formData.intent === intent && 'border-primary ring-2 ring-primary/20'
            )}
            onClick={() => handleSelectIntent(intent)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    formData.intent === intent ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {intentIcons[intent]}
                </div>
                <CardTitle className="text-lg">{INTENT_TEMPLATES[intent].name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{intentDescriptions[intent]}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue} disabled={!formData.intent} size="lg">
          Continue
        </Button>
      </div>

      <TemplateSelectionDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSelectTemplate={(template) => {
          selectTemplate(template);
          setIsTemplateDialogOpen(false);
        }}
        projectId={projectId}
      />
    </div>
  );
};
