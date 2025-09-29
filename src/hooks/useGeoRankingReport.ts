import { useState, useEffect, useCallback } from "react";
import {
  getDefaultCoordinates,
  getDefaultCoordinatesForGeoModule,
  getGridCoordinates,
  getGridCoordinatesForGeoModule,
  addKeywords,
  addKeywordsToProject,
  getKeywordDetailsWithStatus,
  CheckRankRequest,
  AddKeywordsToProjectRequest,
  KeywordDetailsData,
  RankDetail,
} from "../api/geoRankingApi";
import { useToast } from "./use-toast";
import { processDistanceValue } from "../utils/geoRankingUtils";
import L from "leaflet";

interface GeoRankingHookFormData {
  searchBusinessType: string;
  searchBusiness: string;
  searchDataEngine: string;
  keywords: string;
  mapPoint: string;
  distanceUnit: string;
  distanceValue: string;
  gridSize: string;
  scheduleCheck: string;
  language: string;
}

const getInitialFormData = (): GeoRankingHookFormData => ({
  searchBusinessType: "name",
  searchBusiness: "",
  searchDataEngine: "Briefcase API",
  keywords: "",
  mapPoint: "Automatic",
  distanceUnit: "Meters",
  distanceValue: "100",
  gridSize: "3",
  scheduleCheck: "onetime",
  language: "en",
});

export const useGeoRankingReport = (listingId: number, useModuleApi: boolean = false) => {
  const { toast } = useToast();
  const [defaultCoordinates, setDefaultCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [gridCoordinates, setGridCoordinates] = useState<string[]>([]);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [currentMarkers, setCurrentMarkers] = useState<L.Marker[]>([]);
  const [manualCoordinates, setManualCoordinates] = useState<string[]>([]);
  const [submittingRank, setSubmittingRank] = useState(false);
  const [pollingKeyword, setPollingKeyword] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordDetailsData | null>(
    null
  );
  const [currentKeywordId, setCurrentKeywordId] = useState<string | null>(null);
  const [pollingProgress, setPollingProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [previousMapPoint, setPreviousMapPoint] = useState<string>("");

  const [formData, setFormData] = useState<GeoRankingHookFormData>(getInitialFormData());

  // Helper function to determine distance unit from distance value
  const determineDistanceUnit = (
    distance: string
  ): { unit: string; value: string } => {
    // console.log("🔍 determineDistanceUnit called with:", distance);

    // Use exact dropdown values from geoRankingUtils.ts
    const meterValues = ["100", "200", "500", "1", "2.5", "5", "10", "25"];
    const mileValues = [
      ".1",
      ".25",
      ".5",
      ".75",
      "1mi",
      "2",
      "3",
      "5mi",
      "8",
      "10mi",
    ];

    // console.log("🌐 Distance analysis:", {
    //   distance,
    //   originalDistance: distance,
    //   lowercaseDistance: distance.toLowerCase(),
    // });

    // First, try direct match with mile values (case insensitive)
    const mileMatch = mileValues.find((val) => val === distance.toLowerCase());
    if (mileMatch) {
      const result = { unit: "Miles", value: mileMatch };
      // console.log("📏 Direct mile match result:", result);
      return result;
    }

    // Check if it contains 'mi' and try to match
    if (distance.toLowerCase().includes("mi")) {
      const result = { unit: "Miles", value: distance.toLowerCase() };
      // console.log('📏 Mile with "mi" result:', result);
      return result;
    }

    // Extract numeric value and try to match
    const numericValue = distance.replace(/[^0-9.]/g, "");
    // console.log("📊 Extracted numeric value:", numericValue);

    // Try direct match with meter values
    const meterMatch = meterValues.find((val) => val === numericValue);
    if (meterMatch) {
      const result = { unit: "Meters", value: meterMatch };
      // console.log("📏 Meter match result:", result);
      return result;
    }

    // Try direct match with mile numeric values
    const mileNumericMatch = mileValues.find((val) => val === numericValue);
    if (mileNumericMatch) {
      const result = { unit: "Miles", value: mileNumericMatch };
      // console.log("📏 Mile numeric match result:", result);
      return result;
    }

    // Default fallback - assume meters
    const result = { unit: "Meters", value: numericValue || "100" };
    // console.log("📏 Fallback result:", result);
    return result;
  };

  // Track if we're initializing from clone data
  const [isInitializing, setIsInitializing] = useState(true);
  const [cloneProcessingComplete, setCloneProcessingComplete] = useState(false);

  // Initialize form from URL params if cloning
  const initializeFromCloneData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isClone = urlParams.get("clone") === "true";

    // console.log("🔄 initializeFromCloneData called");
    // console.log("📋 URL Params:", Object.fromEntries(urlParams.entries()));
    // console.log("🔍 Is Clone:", isClone);

    if (isClone) {
      const keyword = urlParams.get("keyword");
      const distance = urlParams.get("distance");
      const grid = urlParams.get("grid");
      const schedule = urlParams.get("schedule");
      const mapPoint = urlParams.get("mapPoint");

      // console.log("📊 Extracted params:", {
      //   keyword,
      //   distance,
      //   grid,
      //   schedule,
      //   mapPoint,
      // });

      const updates: Partial<GeoRankingHookFormData> = {};

      if (keyword) {
        updates.keywords = keyword;
        // console.log("✅ Set keywords:", keyword);
      }

      if (distance) {
        // console.log("🔍 Processing distance:", distance);
        const { unit, value } = determineDistanceUnit(distance);
        updates.distanceUnit = unit;
        updates.distanceValue = value;
        // console.log("📏 Distance processing result:", {
        //   originalDistance: distance,
        //   determinedUnit: unit,
        //   determinedValue: value,
        //   updates: updates,
        // });
      }

      if (grid) {
        updates.gridSize = grid;
        // console.log("🔢 Set grid size:", grid);
      }

      if (schedule) {
        // Map schedule values from API to form values
        const scheduleMap: { [key: string]: string } = {
          daily: "daily",
          weekly: "weekly",
          monthly: "monthly",
          onetime: "onetime",
          "one-time": "onetime",
        };
        updates.scheduleCheck = scheduleMap[schedule.toLowerCase()] || schedule;
        // console.log("⏰ Set schedule:", {
        //   original: schedule,
        //   mapped: updates.scheduleCheck,
        // });
      }

      if (mapPoint) {
        updates.mapPoint = mapPoint;
        // console.log("📍 Set map point:", mapPoint);
      }

      // console.log("🔄 Final updates to apply:", updates);

      if (Object.keys(updates).length > 0) {
        setFormData((prev) => {
          const newFormData = { ...prev, ...updates };
          // console.log("✅ Updated form data:", newFormData);
          return newFormData;
        });

        // Mark clone processing as complete after state update
        setTimeout(() => {
          // console.log("🎯 Clone processing complete, enabling effects");
          setCloneProcessingComplete(true);
          setIsInitializing(false);
        }, 50);
      } else {
        // No clone data, end initialization immediately
        // console.log("🔄 No clone data, ending initialization");
        setCloneProcessingComplete(true);
        setIsInitializing(false);
      }
    } else {
      // Not cloning, end initialization immediately
      // console.log("🔄 Not cloning, ending initialization");
      setCloneProcessingComplete(true);
      setIsInitializing(false);
    }
  };

  // Initialize from clone data on component mount
  useEffect(() => {
    initializeFromCloneData();
  }, []);

  // Function to fetch default coordinates
  const fetchDefaultCoordinates = async (searchType?: number, inputText?: string) => {
    try {
      const response = useModuleApi 
        ? (searchType && inputText ? await getDefaultCoordinatesForGeoModule(searchType, inputText) : null)
        : await getDefaultCoordinates(listingId);
        
      if (response?.code === 200) {
        const [lat, lng] = response.data.latlong.split(",").map(Number);
        setDefaultCoordinates({ lat, lng });
      } else if (response) {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch default coordinates",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching default coordinates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch default coordinates",
        variant: "destructive",
      });
      // Use fallback coordinates (Delhi)
      setDefaultCoordinates({ lat: 28.6139, lng: 77.209 });
    }
  };

  // For non-module API, fetch default coordinates on mount
  useEffect(() => {
    if (!useModuleApi) {
      fetchDefaultCoordinates();
    }
  }, [listingId, toast, useModuleApi]);

  // Fetch grid coordinates from API
  const fetchGridCoordinates = async (businessCoords?: { lat: number; lng: number }) => {
    const coords = businessCoords || defaultCoordinates;
    if (!coords) return;

    setLoadingGrid(true);
    try {
      const gridSize = parseInt(formData.gridSize.split("x")[0]);
      // For Miles with 'mi' suffix, send raw string; otherwise process as number
      const processedDistance = processDistanceValue(
        formData.distanceValue,
        formData.distanceUnit
      );
      const distance =
        typeof processedDistance === "string"
          ? processedDistance
          : processedDistance;
      const latlong = `${coords.lat},${coords.lng}`;

      // console.log("Sending to API:", {
      //   gridSize,
      //   distance,
      //   distanceUnit: formData.distanceUnit,
      //   distanceValue: formData.distanceValue,
      //   processedDistance,
      // });

      const response = useModuleApi 
        ? await getGridCoordinatesForGeoModule(distance, latlong, gridSize)
        : await getGridCoordinates(listingId, distance, latlong, gridSize);
      if (response.code === 200) {
        setGridCoordinates(response.data.allCoordinates);
      }
    } catch (error) {
      console.error("Error fetching grid coordinates:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch grid coordinates",
        variant: "destructive",
      });
    } finally {
      setLoadingGrid(false);
    }
  };

  // Fetch grid coordinates when relevant parameters change
  useEffect(() => {
    console.log("🔍 Grid coordinates useEffect triggered:", {
      mapPoint: formData.mapPoint,
      defaultCoordinates: defaultCoordinates,
      gridSize: formData.gridSize,
      distanceValue: formData.distanceValue,
      distanceUnit: formData.distanceUnit,
    });

    if (formData.mapPoint === "Automatic" && defaultCoordinates) {
      console.log("✅ Calling fetchGridCoordinates with:", {
        gridSize: formData.gridSize,
        distanceValue: formData.distanceValue,
        coordinates: defaultCoordinates,
      });
      fetchGridCoordinates();
    } else {
      console.log("❌ Grid coordinates fetch blocked:", {
        isAutomatic: formData.mapPoint === "Automatic",
        hasCoordinates: !!defaultCoordinates,
      });
    }

    // Only clear manual coordinates when switching FROM another mode TO manual mode
    if (
      formData.mapPoint === "Manually" &&
      previousMapPoint &&
      previousMapPoint !== "Manually"
    ) {
      clearManualCoordinates();
    }

    // Update previous map point
    setPreviousMapPoint(formData.mapPoint);
  }, [
    formData.gridSize,
    formData.distanceValue,
    formData.distanceUnit,
    defaultCoordinates,
    formData.mapPoint,
  ]);

  // Reset distance value when unit changes (but not during clone processing)
  useEffect(() => {
    if (!cloneProcessingComplete) {
      // console.log("🚫 Skipping distance reset during clone processing");
      // console.log("🔍 Clone processing complete:", cloneProcessingComplete);
      // console.log("🔍 Distance unit:", formData.distanceUnit);
      // console.log("🔍 Distance value:", formData.distanceValue);
      return;
    }

    const defaultValue = formData.distanceUnit === "Meters" ? "100" : ".1";
    // console.log("🔄 Resetting distance value to default:", defaultValue);
    // console.log(
    //   "🔍 Current distance value before reset:",
    //   formData.distanceValue
    // );

    setFormData((prev) => ({
      ...prev,
      distanceValue: defaultValue,
    }));
  }, [formData.distanceUnit, cloneProcessingComplete]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    // Reset form data to initial state
    setFormData(getInitialFormData());

    // Clear all state related to results and coordinates
    setKeywordData(null);
    setCurrentKeywordId(null);
    setManualCoordinates([]);
    setGridCoordinates([]);
    setPollingKeyword(false);
    setPollingProgress(0);
    setIsCompleting(false);

    // Clear any existing markers
    setCurrentMarkers([]);

    // Reset previous map point
    setPreviousMapPoint("");

    toast({
      title: "Form Reset",
      description: "Ready for a new keyword search",
    });
  };

  // Manual coordinates management functions - memoized to prevent map re-renders
  const addManualCoordinate = useCallback((coordinate: string) => {
    setManualCoordinates((prev) => [...prev, coordinate]);
  }, []);

  const removeManualCoordinate = useCallback((index: number) => {
    setManualCoordinates((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearManualCoordinates = useCallback(() => {
    setManualCoordinates([]);
  }, []);

  const updateManualCoordinate = useCallback((index: number, coordinate: string) => {
    setManualCoordinates((prev) =>
      prev.map((coord, i) => (i === index ? coordinate : coord))
    );
  }, []);

  // Helper function to detect multiple keywords
  const isMultipleKeywords = (keywords: string): boolean => {
    const keywordArray = keywords
      .split(/[,;\n\r]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    return keywordArray.length > 1;
  };

  // Polling function to check keyword details every 5 seconds
  const pollKeywordDetails = async (
    keywordId: string,
    maxAttempts: number = 60 // 5 minutes maximum
  ): Promise<boolean> => {
    setPollingKeyword(true);

    // Initialize progress to 10% immediately
    let currentProgress = 10;
    setPollingProgress(currentProgress);

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        // console.log(
        //   `Polling attempt ${attempt}/${maxAttempts} for keywordId: ${keywordId}`
        // );

        // Update progress using enhanced logic
        if (attempt > 1) {
          // Don't increment on first attempt since we start at 10%
          if (currentProgress < 85) {
            currentProgress += 10;
          } else if (currentProgress < 99) {
            currentProgress += 2;
          }
          // Cap at 99% until data is ready
          setPollingProgress(Math.min(currentProgress, 99));
        }

        const response = await getKeywordDetailsWithStatus(
          listingId,
          keywordId,
          1
        );

        // Check if data is populated (not empty array)
        if (Array.isArray(response.data) && response.data.length === 0) {
          // Still in queue, wait 5 seconds before next attempt
          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            continue;
          }
        } else {
          // Data is ready - show 100% progress, then display results after delay
          // console.log("Keyword details ready:", response);
          setIsCompleting(true);
          setPollingProgress(100);

          // Show 100% progress for 2 seconds before displaying results
          setTimeout(() => {
            const keywordData = response.data as KeywordDetailsData;
            // console.log("🎯 Keyword data received:", {
            //   rankDetails: keywordData.rankDetails,
            //   totalRankDetails: keywordData.rankDetails?.length || 0,
            //   mapPoint: formData.mapPoint,
            //   manualCoordinatesSubmitted: manualCoordinates.length,
            // });

            setKeywordData(keywordData);
            setPollingKeyword(false);
            setPollingProgress(0);
            setIsCompleting(false);
            toast({
              title: "Keyword Processed",
              description: "Your keyword ranking data is now available!",
            });
          }, 2000);

          return true;
        }
      }

      // Max attempts reached
      throw new Error("Polling timeout: Keyword processing took too long");
    } catch (error) {
      console.error("Polling error:", error);
      toast({
        title: "Processing Timeout",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Keyword processing is taking longer than expected. Please check back later.",
        variant: "destructive",
      });
      return false;
    } finally {
      // Only reset if not in completion state (will be handled by setTimeout)
      if (!isCompleting) {
        setPollingKeyword(false);
        setPollingProgress(0);
      }
    }
  };

  // Submit check rank request
  const submitCheckRank = async (): Promise<{
    success: boolean;
    shouldNavigate: boolean;
  }> => {
    if (!formData.keywords.trim()) {
      toast({
        title: "Error",
        description: "Keywords are required.",
        variant: "destructive",
      });
      return { success: false, shouldNavigate: false };
    }

    setSubmittingRank(true);
    try {
      // Prepare coordinates array
      let coordinatesArray: string[] = [];

      if (formData.mapPoint === "Automatic") {
        // Include default coordinate first, then grid coordinates
        const defaultCoord = defaultCoordinates
          ? `${defaultCoordinates.lat},${defaultCoordinates.lng}`
          : null;
        coordinatesArray = defaultCoord
          ? [defaultCoord, ...gridCoordinates]
          : gridCoordinates;
      } else {
        // Manual mode - use manual coordinates
        coordinatesArray = manualCoordinates;
      }

      if (coordinatesArray.length === 0) {
        toast({
          title: "Error",
          description:
            "No coordinates available. Please generate grid or place markers.",
          variant: "destructive",
        });
        return { success: false, shouldNavigate: false };
      }

      // console.log("📍 Submitting coordinates:", {
      //   mapPoint: formData.mapPoint,
      //   coordinatesArray,
      //   manualCoordinates: manualCoordinates.length,
      //   gridCoordinates: gridCoordinates.length,
      // });

      // Transform form data to API format
      const processedDistance = processDistanceValue(
        formData.distanceValue,
        formData.distanceUnit
      );
      const requestData: CheckRankRequest = {
        listingId,
        language: formData.language,
        keywords: formData.keywords,
        mapPoint: formData.mapPoint,
        distanceValue: processedDistance,
        gridSize: parseInt(formData.gridSize.split("x")[0]),
        searchDataEngine: formData.searchDataEngine,
        scheduleCheck: formData.scheduleCheck.toLowerCase().replace("-", ""),
        latlng: coordinatesArray,
      };

      // console.log("Check rank request data:", requestData);

      const response = await addKeywords(requestData);
      const multipleKeywords = isMultipleKeywords(formData.keywords);

      if (response.code === 200) {
        // If we got a keywordId, start polling for keyword details
        if (response.data?.keywordId) {
          setCurrentKeywordId(response.data.keywordId.toString());
          toast({
            title: "Processing Keyword",
            description:
              "Please wait while we process your keyword ranking data...",
            variant: "default",
          });

          // Start polling in background - don't wait for it to complete
          pollKeywordDetails(response.data.keywordId.toString()).catch(
            (error) => {
              console.error("Polling failed:", error);
            }
          );
        } else {
          // No keywordId received, keyword is in queue
          toast({
            title: "Keyword in Queue",
            description:
              "Your keyword is in queue. It will take some time to process.",
            variant: "default",
          });
        }

        toast({
          title: "Success",
          description: "Rank check submitted successfully",
        });

        return { success: true, shouldNavigate: multipleKeywords };
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit rank check",
          variant: "destructive",
        });
        return { success: false, shouldNavigate: false };
      }
    } catch (error) {
      console.error("Error submitting rank check:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to submit rank check",
        variant: "destructive",
      });
      return { success: false, shouldNavigate: false };
    } finally {
      setSubmittingRank(false);
    }
  };

  // Submit add keywords request for GEO module
  const submitAddKeywords = async (selectedBusiness: any, selectedProject: any): Promise<{
    success: boolean;
    keywordCount: number;
  }> => {
    if (!useModuleApi) {
      toast({
        title: "Error",
        description: "This function is only available in module mode",
        variant: "destructive",
      });
      return { success: false, keywordCount: 0 };
    }

    if (!formData.keywords.trim()) {
      toast({
        title: "Error",
        description: "Keywords are required.",
        variant: "destructive",
      });
      return { success: false, keywordCount: 0 };
    }

    if (!selectedBusiness || !selectedProject) {
      toast({
        title: "Error",
        description: "Please select a business and project first",
        variant: "destructive",
      });
      return { success: false, keywordCount: 0 };
    }

    setSubmittingRank(true);
    try {
      // Prepare coordinates array
      let coordinatesArray: string[] = [];

      if (formData.mapPoint === "Automatic") {
        // Include default coordinate first, then grid coordinates
        const defaultCoord = defaultCoordinates
          ? `${defaultCoordinates.lat},${defaultCoordinates.lng}`
          : null;
        coordinatesArray = defaultCoord
          ? [defaultCoord, ...gridCoordinates]
          : gridCoordinates;
      } else {
        // Manual mode - use manual coordinates
        coordinatesArray = manualCoordinates;
      }

      if (coordinatesArray.length === 0) {
        toast({
          title: "Error",
          description:
            "No coordinates available. Please generate grid or place markers.",
          variant: "destructive",
        });
        return { success: false, keywordCount: 0 };
      }

      // Count keywords
      const keywordArray = formData.keywords
        .split(/[,;\n\r]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      // Transform form data to API format for module
      const processedDistance = processDistanceValue(
        formData.distanceValue,
        formData.distanceUnit
      );
      
      const requestData: AddKeywordsToProjectRequest = {
        projectId: selectedProject.id,
        businessName: selectedBusiness.name || "",
        language: formData.language,
        keywords: formData.keywords,
        mapPoint: formData.mapPoint,
        distanceValue: processedDistance,
        gridSize: parseInt(formData.gridSize.split("x")[0]),
        searchDataEngine: formData.searchDataEngine,
        scheduleCheck: formData.scheduleCheck.toLowerCase().replace("-", ""),
        latlng: coordinatesArray,
      };

      const response = await addKeywordsToProject(requestData);

      if (response.code === 200) {
        toast({
          title: "Success",
          description: "Keywords added successfully to the project",
        });
        return { success: true, keywordCount: keywordArray.length };
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add keywords",
          variant: "destructive",
        });
        return { success: false, keywordCount: 0 };
      }
    } catch (error) {
      console.error("Error adding keywords:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to add keywords",
        variant: "destructive",
      });
      return { success: false, keywordCount: 0 };
    } finally {
      setSubmittingRank(false);
    }
  };

  // Helper function to set default coordinates directly
  const setDefaultCoordinatesFromBusiness = (coordinates: { lat: number; lng: number }) => {
    setDefaultCoordinates(coordinates);
  };

  return {
    formData,
    defaultCoordinates,
    gridCoordinates,
    loadingGrid,
    currentMarkers,
    setCurrentMarkers,
    manualCoordinates,
    addManualCoordinate,
    removeManualCoordinate,
    clearManualCoordinates,
    updateManualCoordinate,
    submittingRank,
    pollingKeyword,
    pollingProgress,
    keywordData,
    currentKeywordId,
    handleInputChange,
    handleReset,
    fetchGridCoordinates,
    fetchDefaultCoordinates,
    setDefaultCoordinatesFromBusiness,
    submitCheckRank,
    submitAddKeywords,
  };
};
