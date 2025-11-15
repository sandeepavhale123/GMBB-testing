import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PlaceResult {
  name?: string;
  formatted_address?: string;
  geometry?: any;
}

interface GooglePlacesInputProps
  extends Omit<React.ComponentProps<"input">, "value"> {
  onPlaceSelect?: (formattedAddress: string) => void;
  defaultValue?: string;
}

export interface GooglePlacesInputRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

export const GooglePlacesInput = React.forwardRef<
  GooglePlacesInputRef,
  GooglePlacesInputProps
>(({ className, onPlaceSelect, onChange, defaultValue, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isGooglePlacesActive, setIsGooglePlacesActive] = useState(false);
  const lastSelectedValue = useRef<string>("");

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current?.value || "",
    setValue: (value: string) => {
      if (inputRef.current) {
        inputRef.current.value = value;
        lastSelectedValue.current = value;
      }
    },
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    const initAutocomplete = () => {
      if (inputRef.current && (window as any).google?.maps?.places) {
        setIsGooglePlacesActive(true);

        autocompleteRef.current = new (
          window as any
        ).google.maps.places.Autocomplete(inputRef.current, {
          types: ["(cities)"],
          fields: ["name", "formatted_address", "geometry"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (place && place.formatted_address) {
            // Store the selected value
            lastSelectedValue.current = place.formatted_address;

            // Update the input value directly
            if (inputRef.current) {
              inputRef.current.value = place.formatted_address;
            }

            // Call the onPlaceSelect callback
            if (onPlaceSelect) {
              onPlaceSelect(place.formatted_address);
            }
          } else {
            //
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
  }, [onPlaceSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only call onChange if we're not dealing with a Google Places selection
    if (onChange && e.target.value !== lastSelectedValue.current) {
      onChange(e);
    }
  };

  return (
    <Input
      {...props}
      ref={inputRef}
      className={cn(className)}
      onChange={handleChange}
      defaultValue={defaultValue}
    />
  );
});

GooglePlacesInput.displayName = "GooglePlacesInput";
