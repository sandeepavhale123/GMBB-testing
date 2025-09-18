import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// import { languageOptions } from '../../utils/geoRankingUtils';
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface KeywordFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (country: string, language: string) => void;
  currentCountry: string;
  currentLanguage: string;
}

export const KeywordFilterModal: React.FC<KeywordFilterModalProps> = ({
  open,
  onOpenChange,
  onApply,
  currentCountry,
  currentLanguage,
}) => {
  const { t } = useI18nNamespace("Keywords/KeywordFilterModal");
  const [selectedCountry, setSelectedCountry] = useState("2840");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const countryOptions = [
    { value: 2840, label: t("KeywordFilterModal.countries.2840") },
    { value: 2826, label: t("KeywordFilterModal.countries.2826") },
    { value: 2124, label: t("KeywordFilterModal.countries.2124") },
    { value: 2036, label: t("KeywordFilterModal.countries.2036") },
    { value: 2276, label: t("KeywordFilterModal.countries.2276") },
    { value: 2250, label: t("KeywordFilterModal.countries.2250") },
    { value: 2724, label: t("KeywordFilterModal.countries.2724") },
    { value: 2380, label: t("KeywordFilterModal.countries.2380") },
    { value: 2528, label: t("KeywordFilterModal.countries.2528") },
    { value: 2056, label: t("KeywordFilterModal.countries.2056") },
    { value: 2752, label: t("KeywordFilterModal.countries.2752") },
    { value: 2578, label: t("KeywordFilterModal.countries.2578") },
    { value: 2208, label: t("KeywordFilterModal.countries.2208") },
    { value: 2246, label: t("KeywordFilterModal.countries.2246") },
    { value: 2616, label: t("KeywordFilterModal.countries.2616") },
    { value: 2040, label: t("KeywordFilterModal.countries.2040") },
    { value: 2756, label: t("KeywordFilterModal.countries.2756") },
    { value: 2392, label: t("KeywordFilterModal.countries.2392") },
    { value: 2410, label: t("KeywordFilterModal.countries.2410") },
    { value: 156, label: t("KeywordFilterModal.countries.156") },
    { value: 2356, label: t("KeywordFilterModal.countries.2356") },
    { value: 2076, label: t("KeywordFilterModal.countries.2076") },
    { value: 2484, label: t("KeywordFilterModal.countries.2484") },
    { value: 2032, label: t("KeywordFilterModal.countries.2032") },
  ];

  const languageOptions = [
    { value: "ar", label: t("KeywordFilterModal.languages.ar") },
    { value: "bg", label: t("KeywordFilterModal.languages.bg") },
    { value: "ca", label: t("KeywordFilterModal.languages.ca") },
    { value: "hr", label: t("KeywordFilterModal.languages.hr") },
    { value: "cs", label: t("KeywordFilterModal.languages.cs") },
    { value: "da", label: t("KeywordFilterModal.languages.da") },
    { value: "nl", label: t("KeywordFilterModal.languages.nl") },
    { value: "en", label: t("KeywordFilterModal.languages.en") },
    { value: "et", label: t("KeywordFilterModal.languages.et") },
    { value: "fi", label: t("KeywordFilterModal.languages.fi") },
    { value: "fr", label: t("KeywordFilterModal.languages.fr") },
    { value: "de", label: t("KeywordFilterModal.languages.de") },
    { value: "el", label: t("KeywordFilterModal.languages.el") },
    { value: "he", label: t("KeywordFilterModal.languages.he") },
    { value: "hu", label: t("KeywordFilterModal.languages.hu") },
    { value: "id", label: t("KeywordFilterModal.languages.id") },
    { value: "it", label: t("KeywordFilterModal.languages.it") },
    { value: "ja", label: t("KeywordFilterModal.languages.ja") },
    { value: "ko", label: t("KeywordFilterModal.languages.ko") },
    { value: "lv", label: t("KeywordFilterModal.languages.lv") },
    { value: "lt", label: t("KeywordFilterModal.languages.lt") },
    { value: "no", label: t("KeywordFilterModal.languages.no") },
    { value: "pl", label: t("KeywordFilterModal.languages.pl") },
    { value: "pt", label: t("KeywordFilterModal.languages.pt") },
    { value: "ro", label: t("KeywordFilterModal.languages.ro") },
    { value: "ru", label: t("KeywordFilterModal.languages.ru") },
    { value: "es", label: t("KeywordFilterModal.languages.es") },
    { value: "sv", label: t("KeywordFilterModal.languages.sv") },
    { value: "tr", label: t("KeywordFilterModal.languages.tr") },
    { value: "uk", label: t("KeywordFilterModal.languages.uk") },
    { value: "zh", label: t("KeywordFilterModal.languages.zh") },
  ];

  const handleApply = () => {
    onApply(selectedCountry, selectedLanguage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("KeywordFilterModal.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t("KeywordFilterModal.labels.country")}
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t(
                    "KeywordFilterModal.placeholders.selectCountry"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem
                    key={country.value}
                    value={country.value.toString()}
                  >
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t("KeywordFilterModal.labels.language")}
            </label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t(
                    "KeywordFilterModal.placeholders.selectLanguage"
                  )}
                />
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
              {t("KeywordFilterModal.buttons.cancel")}
            </Button>
            <Button onClick={handleApply}>
              {t("KeywordFilterModal.buttons.apply")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
