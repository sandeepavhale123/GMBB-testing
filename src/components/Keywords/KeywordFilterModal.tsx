import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { languageOptions } from '../../utils/geoRankingUtils';

interface KeywordFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (country: string, language: string) => void;
  currentCountry: string;
  currentLanguage: string;
}

const countryOptions = [
  { value: 2840, label: 'United States' },
  { value: 2826, label: 'United Kingdom' },
  { value: 2124, label: 'Canada' },
  { value: 2036, label: 'Australia' },
  { value: 2276, label: 'Germany' },
  { value: 2250, label: 'France' },
  { value: 2724, label: 'Spain' },
  { value: 2380, label: 'Italy' },
  { value: 2528, label: 'Netherlands' },
  { value: 2056, label: 'Belgium' },
  { value: 2752, label: 'Sweden' },
  { value: 2578, label: 'Norway' },
  { value: 2208, label: 'Denmark' },
  { value: 2246, label: 'Finland' },
  { value: 2616, label: 'Poland' },
  { value: 2203, label: 'Czechia' }, 
  { value: 2040, label: 'Austria' },
  { value: 2756, label: 'Switzerland' },
  { value: 2392, label: 'Japan' },
  { value: 2410, label: 'South Korea' },
  { value: 156,  label: 'China' }, 
  { value: 2356, label: 'India' },
  { value: 2076, label: 'Brazil' },
  { value: 2484, label: 'Mexico' },
  { value: 2032, label: 'Argentina' }
];

const languageOptions = 
  [
  { value: "ar", label: "Arabic" },
  { value: "bg", label: "Bulgarian" },
  { value: "ca", label: "Catalan" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "en", label: "English" },
  { value: "et", label: "Estonian" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "hu", label: "Hungarian" },
  { value: "id", label: "Indonesian" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "lv", label: "Latvian" },
  { value: "lt", label: "Lithuanian" },
  { value: "no", label: "Norwegian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "es", label: "Spanish" },
  { value: "sv", label: "Swedish" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "zh", label: "Chinese" }
];
export const KeywordFilterModal: React.FC<KeywordFilterModalProps> = ({
  open,
  onOpenChange,
  onApply,
  currentCountry,
  currentLanguage
}) => {
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleApply = () => {
    onApply(selectedCountry, selectedLanguage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Keywords</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Country
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Language
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};