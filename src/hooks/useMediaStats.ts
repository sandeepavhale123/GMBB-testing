import { useState, useEffect } from "react";
import { getMediaStats, MediaStatsResponse } from "../api/mediaApi";
import { useToast } from "./use-toast";

export const useMediaStats = (listingId: string | null) => {
  const [stats, setStats] = useState<MediaStatsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    if (!listingId) {
      setStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getMediaStats({ listingId });

      if (response.code === 200) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch media stats");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch media stats",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching media stats:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch media stats";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [listingId]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
