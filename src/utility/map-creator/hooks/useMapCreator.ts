import { useState } from "react";
import { MapCreatorFormData, MapCoordinates, SelectOption, CircleCoordinate } from "../types/mapCreator.types";
import { distanceOptions } from "../data/formOptions";
import { generateCSV, downloadCSV } from "../utils/csvGenerator";
import { toast } from "@/hooks/use-toast";
import { getDefaultCoordinates, getCircleCoordinates } from "@/api/utilityApi";

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
  const [businessName, setBusinessName] = useState<string>("");
  const [circleCoordinates, setCircleCoordinates] = useState<CircleCoordinate[]>([]);
  const [availableDistances, setAvailableDistances] = useState<SelectOption[]>(distanceOptions);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [isLoadingCircle, setIsLoadingCircle] = useState(false);

  // Handle map URL change and fetch coordinates from API
  const handleMapUrlChange = async (url: string) => {
    setFormData((prev) => ({ ...prev, mapUrl: url }));
    
    if (!url.trim()) {
      setCoordinates(null);
      setBusinessName("");
      setCircleCoordinates([]);
      return;
    }
    
    setIsLoadingCoordinates(true);
    
    try {
      const response = await getDefaultCoordinates(url);
      
      if (response.code === 200) {
        const [lat, lng] = response.data.latlong.split(',').map(parseFloat);
        setCoordinates({ lat, lng });
        setBusinessName(response.data.bname);
        setCircleCoordinates([]);
        
        toast({
          title: "Success",
          description: `Coordinates found for ${response.data.bname}`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setCoordinates(null);
      setBusinessName("");
      setCircleCoordinates([]);
      toast({
        title: "Invalid Map URL",
        description: error?.response?.data?.message || "Could not extract coordinates from the URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCoordinates(false);
    }
  };

  // Handle radius change and filter distance options
  const handleRadiusChange = (radius: string) => {
    setFormData((prev) => ({ ...prev, radius, distance: "0" }));
    setCircleCoordinates([]);
    
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

  // Handle distance change and fetch circle coordinates
  const handleDistanceChange = async (distance: string) => {
    setFormData((prev) => ({ ...prev, distance }));
    
    if (!coordinates || formData.radius === "0" || distance === "0") {
      setCircleCoordinates([]);
      return;
    }
    
    setIsLoadingCircle(true);
    
    try {
      const latlong = `${coordinates.lat},${coordinates.lng}`;
      const response = await getCircleCoordinates(
        parseInt(distance),
        latlong,
        parseInt(formData.radius)
      );
      
      if (response.code === 200) {
        const coords = response.data.coordinates.map(coordStr => {
          const [lat, lng] = coordStr.split(',').map(parseFloat);
          return { lat, lng };
        });
        setCircleCoordinates(coords);
        
        toast({
          title: "Success",
          description: `${coords.length} coordinates generated`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setCircleCoordinates([]);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to fetch circle coordinates",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCircle(false);
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
    setBusinessName("");
    setCircleCoordinates([]);
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
    businessName,
    circleCoordinates,
    availableDistances,
    isLoadingCoordinates,
    isLoadingCircle,
    handleMapUrlChange,
    handleRadiusChange,
    handleDistanceChange,
    handleInputChange,
    handleReset,
    handleGenerateCSV,
  };
};
