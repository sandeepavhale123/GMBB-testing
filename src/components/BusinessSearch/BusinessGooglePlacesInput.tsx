import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useApiKey } from "@/hooks/useApiKey";

import { BusinessLocationLite } from "@/types/business";

interface BusinessGooglePlacesInputProps {
  onPlaceSelect?: (business: BusinessLocationLite) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export function BusinessGooglePlacesInput({
  onPlaceSelect,
  defaultValue = "",
  disabled = false,
  placeholder = "Search for a business...",
}: BusinessGooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const { apiKey, isLoading: apiKeyLoading, error: apiKeyError } = useApiKey();

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!apiKey) {
        if (apiKeyError) {
          toast({
            title: "API Key Error",
            description: "Failed to load Google Places API key.",
            variant: "destructive",
          });
        }
        return;
      }

      try {
        setLoading(true);

        // Load Google Maps script if not already loaded.
        if (!window.google) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;

          script.onload = () => {
            setupAutocomplete();
          };

          document.head.appendChild(script);
        } else {
          setupAutocomplete();
        }
      } catch (error) {
        // console.error('Failed to initialize Google Places:', error);
        toast({
          title: "Initialization Failed",
          description: "Failed to initialize Google Places API.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const setupAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment"],
        fields: ["name", "geometry.location", "formatted_address"],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location && place.name) {
          const businessDetails: BusinessLocationLite = {
            name: place.name,
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
          };

          setInputValue(place.name);
          onPlaceSelect?.(businessDetails);
        }
      });
    };

    if (!disabled && !apiKeyLoading) {
      initializeAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [disabled, onPlaceSelect, apiKey, apiKeyLoading, apiKeyError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      placeholder={apiKeyLoading ? "Loading API key..." : loading ? "Loading Google Places..." : placeholder}
      disabled={disabled || loading || apiKeyLoading || !apiKey}
      className="w-full"
    />
  );
}
