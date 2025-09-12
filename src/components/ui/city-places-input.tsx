import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

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
          }
        });
      }
    }
  }, [onPlaceSelect]);

  // Set default value
  useEffect(() => {
    if (defaultValue && inputRef.current) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  // Expose imperative methods
  React.useImperativeHandle(ref, () => ({
    getValue: () => {
      return inputRef.current?.value || '';
    },
    setValue: (value: string) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    },
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only call onChange if we're not dealing with a Google Places selection
    if (onChange && e.target.value !== lastSelectedValue.current) {
      onChange(e);
    }
  };

  return (
    <Input
      ref={inputRef}
      className={className}
      onChange={handleInputChange}
      autoComplete="off"
      {...props}
    />
  );
});

CityPlacesInput.displayName = "CityPlacesInput";