import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapCreatorForm } from "../components/MapCreatorForm";
import { MapCreatorMap } from "../components/MapCreatorMap";
import { useMapCreator } from "../hooks/useMapCreator";

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Map Creator</h1>
        <p className="text-muted-foreground mt-2">
          Create and download keyword ranking data in CSV format
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          {businessName && (
            <p className="text-sm text-muted-foreground mt-1">
              Business: {businessName}
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
      <Card>
        <CardHeader>
          <CardTitle>Map Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <MapCreatorMap 
            coordinates={coordinates} 
            radius={formData.radius}
            circleCoordinates={circleCoordinates}
          />
        </CardContent>
      </Card>
    </div>
  );
};
