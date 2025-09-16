import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useI18nNamespace("Media/categorySelector");

  const categories = [
    {
      value: "product",
      label: t("categorySelector.categories.product"),
      icon: "📦",
    },
    {
      value: "interior",
      label: t("categorySelector.categories.interior"),
      icon: "🏠",
    },
    { value: "team", label: t("categorySelector.categories.team"), icon: "👥" },
    { value: "food", label: t("categorySelector.categories.food"), icon: "🍽️" },
    {
      value: "exterior",
      label: t("categorySelector.categories.exterior"),
      icon: "🏢",
    },
    {
      value: "event",
      label: t("categorySelector.categories.event"),
      icon: "🎉",
    },
    {
      value: "service",
      label: t("categorySelector.categories.service"),
      icon: "⚙️",
    },
    {
      value: "atmosphere",
      label: t("categorySelector.categories.atmosphere"),
      icon: "✨",
    },
  ];

  const selectedCategory = categories.find((cat) => cat.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-10">
          <div className="flex items-center gap-2">
            {selectedCategory ? (
              <>
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.label}</span>
              </>
            ) : (
              <span className="text-gray-500">
                {t("categorySelector.placeholder")}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]" align="start">
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.value}
            onClick={() => onChange(category.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </div>
            {value === category.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
