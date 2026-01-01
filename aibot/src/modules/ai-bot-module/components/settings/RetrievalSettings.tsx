import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Scale, Compass, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RetrievalSettingsProps {
  botId: string;
  currentThreshold: number;
  currentRetrievalCount: number;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  threshold: number;
  retrievalCount: number;
}

const PRESETS: Preset[] = [
  {
    id: 'focused',
    name: 'Focused',
    description: 'Precise answers from highly relevant content. Best when accuracy matters most.',
    icon: <Target className="h-5 w-5" />,
    threshold: 0.40,
    retrievalCount: 3,
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Recommended for most use cases. Good mix of relevance and coverage.',
    icon: <Scale className="h-5 w-5" />,
    threshold: 0.30,
    retrievalCount: 5,
  },
  {
    id: 'exploratory',
    name: 'Exploratory',
    description: 'Broader coverage, more context. Good for complex or multi-topic questions.',
    icon: <Compass className="h-5 w-5" />,
    threshold: 0.20,
    retrievalCount: 8,
  },
];

function getCurrentPreset(threshold: number, retrievalCount: number): string | null {
  for (const preset of PRESETS) {
    if (preset.threshold === threshold && preset.retrievalCount === retrievalCount) {
      return preset.id;
    }
  }
  return null;
}

export const RetrievalSettings: React.FC<RetrievalSettingsProps> = ({
  botId,
  currentThreshold,
  currentRetrievalCount,
}) => {
  const queryClient = useQueryClient();
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    getCurrentPreset(currentThreshold, currentRetrievalCount)
  );

  const updateMutation = useMutation({
    mutationFn: async (preset: Preset) => {
      const { error } = await supabase
        .from('ab_bots')
        .update({
          similarity_threshold: preset.threshold,
          retrieval_count: preset.retrievalCount,
        })
        .eq('id', botId);
      
      if (error) throw error;
      return preset;
    },
    onSuccess: (preset) => {
      queryClient.invalidateQueries({ queryKey: ['bot-detail', botId] });
      toast.success(`Answer quality set to "${preset.name}"`);
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset.id);
    updateMutation.mutate(preset);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer Quality</CardTitle>
        <CardDescription>
          Control how your bot searches and uses knowledge. Choose a preset that matches your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              const isLoading = updateMutation.isPending && selectedPreset === preset.id;
              
              return (
                <Tooltip key={preset.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-auto min-h-[120px] w-full flex-col items-start justify-start p-4 gap-2 relative',
                        isSelected && 'border-primary bg-primary/5'
                      )}
                      onClick={() => handleSelectPreset(preset)}
                      disabled={updateMutation.isPending}
                    >
                      {isSelected && !isLoading && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                      {isLoading && (
                        <Loader2 className="absolute top-2 right-2 h-4 w-4 text-primary animate-spin" />
                      )}
                      <div className="flex items-center gap-2 text-foreground w-full pr-6">
                        {preset.icon}
                        <span className="font-medium">{preset.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left font-normal whitespace-normal break-words line-clamp-3">
                        {preset.description}
                      </p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>
                      Threshold: {preset.threshold} | Context chunks: {preset.retrievalCount}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        
        {selectedPreset === null && (
          <p className="mt-4 text-sm text-muted-foreground">
            Current settings: Threshold {currentThreshold}, Chunks {currentRetrievalCount} (Custom)
          </p>
        )}
      </CardContent>
    </Card>
  );
};
