import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface QAFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "answered" | "unanswered";
  onStatusChange: (value: "all" | "answered" | "unanswered") => void;
}

export const QAFilters: React.FC<QAFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  const { t } = useI18nNamespace("QA/qaFilters");
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="relative w-full lg:flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("qaFilters.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-auto">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder={t("qaFilters.status.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("qaFilters.status.all")}</SelectItem>
              <SelectItem value="unanswered">
                {t("qaFilters.status.unanswered")}
              </SelectItem>
              <SelectItem value="answered">
                {t("qaFilters.status.answered")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
