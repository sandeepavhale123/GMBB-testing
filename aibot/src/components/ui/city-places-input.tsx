import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: object
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => PlaceResult;
          };
        };
      };
    };
  }
}
interface PlaceGeometry {
  location: {
    lat: () => number;
    lng: () => number;
  };
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceResult {
  formatted_address: string;
  geometry: PlaceGeometry;
  address_components: AddressComponent[];
}

export interface CityData {
  formattedAddress: string;
  latitude: string;
  longitude: string;
  country: string;
}

interface CityPlacesInputProps extends Omit<React.ComponentProps<"input">, 'value'> {
  onPlaceSelect?: (cityData: CityData) => void;
  defaultValue?: string;
}

export interface CityPlacesInputRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

export const CityPlacesInput = React.forwardRef<
  CityPlacesInputRef,
  CityPlacesInputProps
>(({ className, onPlaceSelect, onChange, defaultValue, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const lastSelectedValue = useRef<string>("");
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const isAutocompleteSelection = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      if (inputRef.current && !autocompleteRef.current) {
        // Initialize autocomplete with city/locality restrictions
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['(cities)'],
            fields: ['formatted_address', 'geometry', 'address_components']
          }
        );

        // Listen for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          const place: PlaceResult = autocompleteRef.current.getPlace();
          
          if (place && place.formatted_address && place.geometry) {
            const formattedAddress = place.formatted_address;
            lastSelectedValue.current = formattedAddress;
            isAutocompleteSelection.current = true;
            
            // Update internal state
            setInputValue(formattedAddress);
            
            // Get coordinates
            const lat = place.geometry.location.lat().toString();
            const lng = place.geometry.location.lng().toString();
            
            // Extract country code
            let country = 'US'; // Default to US
            if (place.address_components) {
              const countryComponent = place.address_components.find(
                component => component.types.includes('country')
              );
              if (countryComponent) {
                country = countryComponent.short_name;
              }
            }
            
            const cityData: CityData = {
              formattedAddress,
              latitude: lat,
              longitude: lng,
              country
            };
            
            if (onPlaceSelect) {
              onPlaceSelect(cityData);
            }
            
            // Create synthetic event for onChange
            if (onChange) {
              const syntheticEvent = {
                target: { value: formattedAddress }
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }
            
            // Reset flag after processing
            setTimeout(() => {
              isAutocompleteSelection.current = false;
            }, 0);
          }
        });
      }
    }
  }, [onPlaceSelect]);

  // Set default value
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  // Expose imperative methods
  React.useImperativeHandle(ref, () => ({
    getValue: () => {
      return inputValue;
    },
    setValue: (value: string) => {
      setInputValue(value);
    },
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Always update internal state for manual input
    if (!isAutocompleteSelection.current) {
      setInputValue(newValue);
    }
    
    // Always call onChange for manual input (not autocomplete selections)
    if (onChange && !isAutocompleteSelection.current) {
      onChange(e);
    }
  };

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      className={className}
      onChange={handleInputChange}
      autoComplete="off"
      {...props}
    />
  );
});

CityPlacesInput.displayName = "CityPlacesInput";