import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { RefreshCw } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface FiltersSidebarProps {
  selectedKeyword: string;
  setSelectedKeyword: (value: string) => void;
  gridSize: string;
  setGridSize: (value: string) => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  selectedKeyword,
  setSelectedKeyword,
  gridSize,
  setGridSize,
}) => {
  const { t } = useI18nNamespace("GeoRanking/filtersSidebar");
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          {t("filtersSidebar.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
            {t("filtersSidebar.labels.selectKeyword")}
          </label>
          <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web Design">
                {t("filtersSidebar.keywords.webDesign")}
              </SelectItem>
              <SelectItem value="Digital Marketing">
                {t("filtersSidebar.keywords.digitalMarketing")}
              </SelectItem>
              <SelectItem value="SEO Services">
                {t("filtersSidebar.keywords.seoServices")}
              </SelectItem>
              <SelectItem value="Local Business">
                {t("filtersSidebar.keywords.localBusiness")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
            {t("filtersSidebar.labels.selectDate")}
          </label>
          <Input type="date" defaultValue="2023-02-01" className="text-sm" />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
            {t("filtersSidebar.labels.gridSize")}
          </label>
          <Select value={gridSize} onValueChange={setGridSize}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4*4">
                {t("filtersSidebar.gridOptions.4x4")}
              </SelectItem>
              <SelectItem value="5*5">
                {t("filtersSidebar.gridOptions.5x5")}
              </SelectItem>
              <SelectItem value="6*6">
                {t("filtersSidebar.gridOptions.6x6")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          {t("filtersSidebar.button")}
        </Button>
      </CardContent>
    </Card>
  );
};
