
import React, { useEffect, useRef } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PlaceResult {
  name?: string;
  formatted_address?: string;
  geometry?: any;
}

interface GooglePlacesInputProps extends React.ComponentProps<"input"> {
  onPlaceSelect?: (formattedAddress: string) => void;
}

export const GooglePlacesInput = React.forwardRef<
  HTMLInputElement,
  GooglePlacesInputProps
>(({ className, onPlaceSelect, onChange, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (inputRef.current && (window as any).google?.maps?.places) {
        autocompleteRef.current = new (
          window as any
        ).google.maps.places.Autocomplete(inputRef.current, {
          types: ["(cities)"],
          fields: ["name", "formatted_address", "geometry"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();
          console.log("Google Places - place_changed triggered:", place);
          
          if (place && place.formatted_address) {
            console.log("Google Places - formatted_address:", place.formatted_address);
            
            // Update the input value programmatically
            if (inputRef.current) {
              inputRef.current.value = place.formatted_address;
              console.log("Google Places - input value updated to:", inputRef.current.value);
              
              // Create a properly structured synthetic event
              const syntheticEvent = {
                target: {
                  value: place.formatted_address,
                  name: inputRef.current.name,
                  id: inputRef.current.id,
                },
                currentTarget: inputRef.current,
                type: 'change',
                bubbles: true,
                cancelable: true,
                preventDefault: () => {},
                stopPropagation: () => {},
              };
              
              // Trigger the onChange handler if it exists
              if (onChange) {
                console.log("Google Places - calling onChange with synthetic event, value:", place.formatted_address);
                onChange(syntheticEvent as any);
              }
            }
            
            // Call the onPlaceSelect callback with the formatted address (primary update method)
            if (onPlaceSelect) {
              console.log("Google Places - calling onPlaceSelect with:", place.formatted_address);
              onPlaceSelect(place.formatted_address);
            }
          } else {
            console.log("Google Places - no place or formatted_address found");
          }
        });
      }
    };

    if ((window as any).google?.maps?.places) {
      initAutocomplete();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if ((window as any).google?.maps?.places) {
          initAutocomplete();
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }

    return () => {
      if (autocompleteRef.current && (window as any).google?.maps?.event) {
        (window as any).google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [onPlaceSelect, onChange]);

  return (
    <Input
      {...props}
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(className)}
      onChange={onChange}
    />
  );
});

GooglePlacesInput.displayName = "GooglePlacesInput";
