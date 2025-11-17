import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { getSupportedSchemaTypes } from "@/services/liveSeoFixer/projectService";

interface NicheSelectorProps {
  selectedNiche: string;
  onNicheChange: (niche: string) => void;
  error?: string;
}

export const NicheSelector: React.FC<NicheSelectorProps> = ({
  selectedNiche,
  onNicheChange,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: schemaTypesData, isLoading } = useQuery({
    queryKey: ["supportedSchemaTypes"],
    queryFn: getSupportedSchemaTypes,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const allNiches = React.useMemo(() => {
    if (!schemaTypesData?.data) return [];

    const niches: Array<{
      value: string;
      category: string;
      subcategory?: string;
    }> = [];

    // Add Organization types
    schemaTypesData.data.Organization?.forEach((type) => {
      niches.push({ value: type, category: "Organization" });
    });

    // Add Place types
    schemaTypesData.data.Place?.forEach((type) => {
      niches.push({ value: type, category: "Place" });
    });

    // Add LocalBusiness types
    if (schemaTypesData.data.LocalBusiness) {
      schemaTypesData.data.LocalBusiness.General?.forEach((type) => {
        niches.push({
          value: type,
          category: "LocalBusiness",
          subcategory: "General",
        });
      });
      schemaTypesData.data.LocalBusiness.Specific?.forEach((type) => {
        niches.push({
          value: type,
          category: "LocalBusiness",
          subcategory: "Specific",
        });
      });
      schemaTypesData.data.LocalBusiness.Retail?.forEach((type) => {
        niches.push({
          value: type,
          category: "LocalBusiness",
          subcategory: "Retail",
        });
      });
    }

    return niches;
  }, [schemaTypesData]);

  const filteredNiches = React.useMemo(() => {
    if (!searchTerm) return allNiches;
    return allNiches.filter(
      (niche) =>
        niche.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allNiches, searchTerm]);

  const handleSelect = (niche: string) => {
    onNicheChange(niche);
    setOpen(false);
  };

  const renderNichesByCategory = () => {
    const categories = ["Organization", "Place", "LocalBusiness"];

    return categories.map((category) => {
      const categoryNiches = filteredNiches.filter(
        (n) => n.category === category
      );
      if (categoryNiches.length === 0) return null;

      if (category === "LocalBusiness") {
        const subcategories = ["General", "Specific", "Retail"];
        return (
          <div key={category} className="space-y-2">
            <div className="font-semibold text-sm text-foreground px-2 py-1">
              {category}
            </div>
            {subcategories.map((subcategory) => {
              const subNiches = categoryNiches.filter(
                (n) => n.subcategory === subcategory
              );
              if (subNiches.length === 0) return null;

              return (
                <div key={subcategory} className="pl-4 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    {subcategory}
                  </div>
                  {subNiches.map((niche) => {
                    const isSelected = selectedNiche === niche.value;

                    return (
                      <div
                        key={niche.value}
                        className={`flex items-center space-x-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent ${
                          isSelected ? "bg-accent" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelect(niche.value);
                        }}
                      >
                        <span className="text-sm">{niche.value}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <div key={category} className="space-y-1">
          <div className="font-semibold text-sm text-foreground px-2 py-1">
            {category}
          </div>
          {categoryNiches.map((niche) => {
            const isSelected = selectedNiche === niche.value;

            return (
              <div
                key={niche.value}
                className={`flex items-center space-x-2 px-2 py-2 rounded-md cursor-pointer hover:bg-accent ${
                  isSelected ? "bg-accent" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(niche.value);
                }}
              >
                <span className="text-sm">{niche.value}</span>
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="space-y-2">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between"
          >
            <span className={selectedNiche ? "" : "text-muted-foreground"}>
              {selectedNiche || "Select a niche"}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          <div className="border rounded-md p-4 space-y-4 bg-background">
            <Input
              type="text"
              placeholder="Search niches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            <div className="max-h-[250px] overflow-y-auto space-y-4">
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Loading niches...
                </div>
              ) : filteredNiches.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No niches found
                </div>
              ) : (
                renderNichesByCategory()
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
