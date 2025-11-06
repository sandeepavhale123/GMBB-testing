import { useState } from "react";
import { MapCreatorFormData, MapCoordinates, SelectOption, CircleCoordinate } from "../types/mapCreator.types";
import { distanceOptions } from "../data/formOptions";
import { toast } from "@/hooks/use-toast";
import { getDefaultCoordinates, getCircleCoordinates, downloadMapCreatorCSV } from "@/api/utilityApi";
import { downloadFileFromUrl } from "@/utils/downloadUtils";

const initialFormData: MapCreatorFormData = {
  mapUrl: "",
  keywords: "",
  radius: "0",
  distance: "0",
  description: "",
  businessDetails: "",
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
  const [isGeneratingCSV, setIsGeneratingCSV] = useState(false);

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
        
        // Validate coordinates are valid numbers
        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
          setCoordinates({ lat, lng });
          setBusinessName(response.data.bname);
          setCircleCoordinates([]);
        } else {
          throw new Error("Invalid coordinates received from API");
        }
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
    
    // Define explicit distance options for each radius
    const radiusToDistanceMap: { [key: string]: string[] } = {
      "500": ["100", "200", "300"],
      "1000": ["200", "300", "500"],
      "2500": ["300", "500", "1000"],
      "5000": ["500", "1000", "2500"],
      "10000": ["1000", "2500", "5000"],
      "25000": ["2000","2500", "5000"],
    };
    
    if (radiusValue > 0 && radiusToDistanceMap[radius]) {
      const allowedValues = ["0", ...radiusToDistanceMap[radius]];
      const filtered = distanceOptions.filter((opt) => 
        allowedValues.includes(opt.value)
      );
      setAvailableDistances(filtered);
    } else {
      setAvailableDistances(distanceOptions);
    }
  };

  // Handle distance change and fetch circle coordinates
  const handleDistanceChange = async (distance: string) => {
    setFormData((prev) => ({ ...prev, distance }));
    
    if (!coordinates || distance === "0") {
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
        const coords = response.data.coordinates
          .map(coordStr => {
            const [lat, lng] = coordStr.split(',').map(parseFloat);
            return { lat, lng };
          })
          .filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng) && isFinite(coord.lat) && isFinite(coord.lng));
        setCircleCoordinates(coords);
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
  const handleGenerateCSV = async () => {
    // Validation
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

    if (circleCoordinates.length === 0) {
      toast({
        title: "Missing Coordinates",
        description: "Please select a distance to generate coordinates.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCSV(true);

    try {
      // Prepare request data
      const requestData = {
        businessName: businessName || "Unknown Business",
        keywords: formData.keywords,
        centerLatlong: `${coordinates.lat},${coordinates.lng}`,
        description: formData.description,
        businessDetails: formData.businessDetails,
        relSearch: formData.relatedSearches,
        coordinates: circleCoordinates.map(coord => `${coord.lat},${coord.lng}`)
      };

      const response = await downloadMapCreatorCSV(requestData);

      if (response.code === 200) {
        // Download the file using the utility function
        downloadFileFromUrl(response.data.fileUrl);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to generate CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCSV(false);
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
    isGeneratingCSV,
    handleMapUrlChange,
    handleRadiusChange,
    handleDistanceChange,
    handleInputChange,
    handleReset,
    handleGenerateCSV,
  };
};
