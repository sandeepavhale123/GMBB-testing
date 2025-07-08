import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Palette, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setAccentColor } from '@/store/slices/themeSlice';

const themeColors = [
  { name: 'blue', color: 'hsl(217 91% 60%)', value: 'blue' },
  { name: 'teal', color: 'hsl(173 80% 40%)', value: 'teal' },
  { name: 'purple', color: 'hsl(262 83% 58%)', value: 'purple' },
  { name: 'cyan', color: 'hsl(188 78% 41%)', value: 'cyan' },
  { name: 'emerald', color: 'hsl(160 84% 39%)', value: 'emerald' },
  { name: 'orange', color: 'hsl(25 95% 53%)', value: 'orange' },
];

export const ThemeColorsSection: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { accentColor } = useAppSelector((state) => state.theme);

  const handleColorSelect = (colorValue: string) => {
    dispatch(setAccentColor(colorValue as any));
    toast({
      title: "Theme color updated",
      description: `Applied ${colorValue} theme`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Colors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                accentColor === color.value 
                  ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-300' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: color.color }}
            >
              {accentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Current theme: <span className="font-medium capitalize">{accentColor}</span>
        </p>
      </CardContent>
    </Card>
  );
};