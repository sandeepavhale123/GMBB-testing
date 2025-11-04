import { useState, useEffect } from "react";
import { MapCreatorFormData, MapCoordinates, SelectOption } from "../types/mapCreator.types";
import { distanceOptions } from "../data/formOptions";
import { extractCoordinatesFromMapUrl, generateCSV, downloadCSV } from "../utils/csvGenerator";
import { toast } from "@/hooks/use-toast";

const initialFormData: MapCreatorFormData = {
  mapUrl: "",
  keywords: "",
  radius: "0",
  distance: "0",
  description: "",
  urls: "",
  relatedSearches: "",
};

export const useMapCreator = () => {
  const [formData, setFormData] = useState<MapCreatorFormData>(initialFormData);
  const [coordinates, setCoordinates] = useState<MapCoordinates | null>(null);
  const [availableDistances, setAvailableDistances] = useState<SelectOption[]>(distanceOptions);

  // Handle map URL change and extract coordinates
  const handleMapUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, mapUrl: url }));
    const coords = extractCoordinatesFromMapUrl(url);
    setCoordinates(coords);
    
    if (url && !coords) {
      toast({
        title: "Invalid Map URL",
        description: "Could not extract coordinates from the URL. Please check the format.",
        variant: "destructive",
      });
    }
  };

  // Handle radius change and filter distance options
  const handleRadiusChange = (radius: string) => {
    setFormData((prev) => ({ ...prev, radius, distance: "0" }));
    
    const radiusValue = parseInt(radius);
    if (radiusValue > 0) {
      const filtered = distanceOptions.filter((opt) => {
        const distValue = parseInt(opt.value);
        return distValue === 0 || distValue < radiusValue;
      });
      setAvailableDistances(filtered);
    } else {
      setAvailableDistances(distanceOptions);
    }
  };

  // Handle generic input change
  const handleInputChange = (field: keyof MapCreatorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setCoordinates(null);
    setAvailableDistances(distanceOptions);
  };

  // Generate and download CSV
  const handleGenerateCSV = () => {
    if (!coordinates) {
      toast({
        title: "Missing Map URL",
        description: "Please enter a valid Map URL with coordinates.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.keywords.trim()) {
      toast({
        title: "Missing Keywords",
        description: "Please enter at least one keyword.",
        variant: "destructive",
      });
      return;
    }

    try {
      const csv = generateCSV(formData, coordinates);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadCSV(csv, `keyword-ranking-${timestamp}.csv`);
      
      toast({
        title: "Success!",
        description: "CSV file has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    coordinates,
    availableDistances,
    handleMapUrlChange,
    handleRadiusChange,
    handleInputChange,
    handleReset,
    handleGenerateCSV,
  };
};
