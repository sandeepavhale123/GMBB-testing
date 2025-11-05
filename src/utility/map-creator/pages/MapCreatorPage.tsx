import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapCreatorForm } from "../components/MapCreatorForm";
import { MapCreatorMap } from "../components/MapCreatorMap";
import { useMapCreator } from "../hooks/useMapCreator";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const MapCreatorPage = () => {
  const {
    formData,
    coordinates,
    businessName,
    circleCoordinates,
    availableDistances,
    isLoadingCoordinates,
    isLoadingCircle,
    isGeneratingCSV,
    handleMapUrlChange,
    handleRadiusChange,
    handleDistanceChange,
    handleInputChange,
    handleReset,
    handleGenerateCSV,
  } = useMapCreator();
  const { t } = useI18nNamespace("mapCreator-pages/MapCreatorPage");
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {/* <p className="text-muted-foreground mt-2">{t("subtitle")}</p> */}
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          {businessName && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("businessLabel", { business: businessName })}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <MapCreatorForm
            formData={formData}
            availableDistances={availableDistances}
            isLoadingCoordinates={isLoadingCoordinates}
            isLoadingCircle={isLoadingCircle}
            isGeneratingCSV={isGeneratingCSV}
            onMapUrlChange={handleMapUrlChange}
            onRadiusChange={handleRadiusChange}
            onDistanceChange={handleDistanceChange}
            onInputChange={handleInputChange}
            onReset={handleReset}
            onGenerateCSV={handleGenerateCSV}
          />
        </CardContent>
      </Card>

      {/* Map Card */}
      <Card className="pt-5">
        <CardContent>
          <MapCreatorMap
            coordinates={coordinates}
            radius={formData.radius}
            circleCoordinates={circleCoordinates}
            isLoadingCircle={isLoadingCircle}
          />
        </CardContent>
      </Card>
    </div>
  );
};
