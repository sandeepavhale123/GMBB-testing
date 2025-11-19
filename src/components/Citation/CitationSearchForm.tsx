// src/components/Citation/CitationSearchForm.tsx
import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Suspense } from "react";
import { GooglePlacesInputRef } from "../ui/google-places-input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { lazyImport } from "@/routes/lazyImport";

const GooglePlacesInput = lazyImport(() =>
  import("../ui/google-places-input").then((m) => ({
    default: m.GooglePlacesInput,
  }))
);

type SearchData = {
  businessName: string;
  phone: string;
  city: string;
};

type Props = {
  searchData: SearchData;
  cityInputRef: React.RefObject<GooglePlacesInputRef>;
  onInputChange: (field: string, value: string) => void;
  onCityInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect: (formattedAddress: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
  t: (key: string) => string;
};

export const CitationSearchForm: React.FC<Props> = ({
  searchData,
  cityInputRef,
  onInputChange,
  onCityInputChange,
  onPlaceSelect,
  onSubmit,
  isCreating,
  t,
}) => {
  // Debounce fields to avoid excessive parent updates if parent uses them for queries
  const debouncedBusinessName = useDebouncedValue(searchData.businessName, 300);
  const debouncedPhone = useDebouncedValue(searchData.phone, 300);
  const debouncedCity = useDebouncedValue(searchData.city, 300);

  // If you want to call parent side-effects based on debounced values, you can
  // expose useEffect in parent that watches these values. For now we keep them local
  // to reduce re-renders while typing.

  const handleChange = useCallback(
    (field: string, val: string) => {
      onInputChange(field, val);
    },
    [onInputChange]
  );

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {t("citationPage.searchForm.title")}
          </CardTitle>
          <CardDescription>
            {t("citationPage.searchForm.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="businessName">
                {t("citationPage.searchForm.businessNameLabel")}
              </Label>
              <Input
                id="businessName"
                type="text"
                placeholder={t(
                  "citationPage.searchForm.businessNamePlaceholder"
                )}
                value={debouncedBusinessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("citationPage.searchForm.phoneLabel")}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("citationPage.searchForm.phonePlaceholder")}
                value={debouncedPhone}
                onChange={(e) => handleChange("phone", e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                {t("citationPage.searchForm.cityLabel")}
              </Label>
              <Suspense fallback={<Input disabled placeholder="Loading..." />}>
                {/* Parent keeps the same ref behavior */}
                <div>
                  {/* We preserve the same GooglePlacesInput usage from original */}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore imported component signature */}
                  <GooglePlacesInput
                    ref={cityInputRef}
                    id="city"
                    name="city"
                    type="text"
                    placeholder={t("citationPage.searchForm.cityPlaceholder")}
                    defaultValue={searchData.city}
                    onChange={onCityInputChange}
                    onPlaceSelect={onPlaceSelect}
                    required
                    autoComplete="off"
                  />
                </div>
              </Suspense>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isCreating}
            >
              {isCreating
                ? t("citationPage.searchForm.searchingButton")
                : t("citationPage.searchForm.searchButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
