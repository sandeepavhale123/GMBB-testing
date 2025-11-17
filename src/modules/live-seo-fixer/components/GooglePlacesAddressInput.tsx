import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

export interface AddressComponents {
  full_address: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  place_id: string;
  phone?: string;
}

interface GooglePlacesAddressInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelected?: (address: AddressComponents) => void;
  placeholder?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export const GooglePlacesAddressInput: React.FC<
  GooglePlacesAddressInputProps
> = ({
  value = "",
  onChange,
  onPlaceSelected,
  placeholder = "Search business address",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (disabled) return;

    const initAutocomplete = () => {
      if (!inputRef.current) return;

      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

      if (!apiKey) {
        console.error("Google Places API key is missing");
        return;
      }

      const loadGoogleMapsScript = () => {
        return new Promise<void>((resolve, reject) => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            resolve();
            return;
          }

          const existingScript = document.querySelector(
            `script[src*="maps.googleapis.com/maps/api/js"]`
          );

          if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", () =>
              reject(new Error("Failed to load Google Maps script"))
            );
            return;
          }

          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
          script.async = true;
          script.defer = true;

          window.initAutocomplete = () => {
            resolve();
          };

          script.onerror = () =>
            reject(new Error("Failed to load Google Maps script"));
          document.head.appendChild(script);
        });
      };

      loadGoogleMapsScript()
        .then(() => {
          if (!inputRef.current) return;

          const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["establishment"],
              fields: [
                "address_components",
                "formatted_address",
                "geometry",
                "name",
                "place_id",
                "international_phone_number",
                "formatted_phone_number",
              ],
            }
          );

          autocompleteRef.current = autocomplete;

          const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.address_components) {
              console.warn("No address components found");
              return;
            }

            const address: AddressComponents = {
              full_address: place.formatted_address || "",
              street_address: "",
              city: "",
              state: "",
              postal_code: "",
              country: "",
              latitude: place.geometry?.location?.lat()?.toString() || "",
              longitude: place.geometry?.location?.lng()?.toString() || "",
              place_id: place.place_id || "",
              phone:
                place.international_phone_number ||
                place.formatted_phone_number ||
                undefined,
            };

            // Extract address components
            let localityIndex = -1;

            place.address_components.forEach(
              (component: any, index: number) => {
                const types = component.types;

                if (types.includes("street_number")) {
                  address.street_address = component.long_name + " ";
                }
                if (types.includes("route")) {
                  address.street_address += component.long_name;
                }
                if (types.includes("locality")) {
                  address.city = component.long_name;
                  if (localityIndex === -1) localityIndex = index;
                }
                if (types.includes("administrative_area_level_1")) {
                  address.state = component.long_name;
                }
                if (types.includes("postal_code")) {
                  address.postal_code = component.long_name;
                }
                if (types.includes("country")) {
                  address.country = component.long_name;
                }
              }
            );

            address.street_address = address.street_address.trim();

            // Fallback: if street_address is empty, merge components before locality
            if (!address.street_address && localityIndex > 0) {
              const streetParts: string[] = [];
              for (let i = 0; i < localityIndex; i++) {
                const component = place.address_components[i];
                if (component.long_name) {
                  streetParts.push(component.long_name);
                }
              }
              address.street_address = streetParts.join(", ");
            }

            setInputValue(address.full_address);
            onChange?.(address.full_address);
            onPlaceSelected?.(address);
          });

          return () => {
            if (listener) {
              window.google.maps.event.removeListener(listener);
            }
          };
        })
        .catch((error) => {
          console.error("Error loading Google Maps:", error);
        });
    };

    const timeoutId = setTimeout(initAutocomplete, 100);

    return () => {
      clearTimeout(timeoutId);
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [disabled, onChange, onPlaceSelected]);

  // Inject custom styles for Google Places dropdown to work in modals
  useEffect(() => {
    const styleId = "google-places-modal-styles";

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .pac-container {
          z-index: 9999 !important;
          background-color: hsl(var(--popover)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          font-family: inherit !important;
          margin-top: 4px !important;
        }
        .pac-item {
          padding: 8px 12px !important;
          cursor: pointer !important;
          color: hsl(var(--foreground)) !important;
          border-top: 1px solid hsl(var(--border)) !important;
        }
        .pac-item:first-child {
          border-top: none !important;
        }
        .pac-item:hover {
          background-color: hsl(var(--accent)) !important;
        }
        .pac-item-query {
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
        }
        .pac-matched {
          font-weight: 600 !important;
        }
        .pac-icon {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Prevent modal dismiss when clicking on Google Places suggestions
    const handlePacContainerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".pac-container")) {
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handlePacContainerClick, true);

    return () => {
      document.removeEventListener("click", handlePacContainerClick, true);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete="off"
    />
  );
};
