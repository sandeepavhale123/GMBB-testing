import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getLeadApiKeyForSearch } from "../api/leadSearchApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface LeadBusinessDetails {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  placeId?: string;
  cid?: string;
}

interface LeadGooglePlacesInputProps {
  onPlaceSelect?: (business: LeadBusinessDetails) => void;
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

export function LeadGooglePlacesInput({
  onPlaceSelect,
  defaultValue = "",
  disabled = false,
  placeholder = "Search for a business...",
}: LeadGooglePlacesInputProps) {
  const { t } = useI18nNamespace("Laed-module-component/LeadGooglePlacesInput");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Keep the callback reference up to date
  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    const extractCidFromUrl = (url: string): string | null => {
      try {
        const u = new URL(url);
        const cid = u.searchParams.get("cid") || u.searchParams.get("ludocid");
        if (cid) return cid;
      } catch {}
      const m = url.match(/[?&](?:cid|ludocid)=(\d+)/i);
      return m ? m[1] : null;
    };

    const initializeAutocomplete = async () => {
      try {
        setLoading(true);

        // Get API key from lead module endpoint
        const apiKeyResponse = await getLeadApiKeyForSearch();
        const apiKey = apiKeyResponse.data.apikey;

        if (!apiKey) {
          toast({
            title: t("leadGooglePlacesInput.errors.apiKeyMissing.title"),
            description: t(
              "leadGooglePlacesInput.errors.apiKeyMissing.description"
            ),
            variant: "destructive",
          });
          return;
        }

        // Load Google Maps script if not already loaded
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
        console.error("Failed to initialize Google Places:", error);
        toast({
          title: t("leadGooglePlacesInput.errors.initializationFailed.title"),
          description: t(
            "leadGooglePlacesInput.errors.initializationFailed.description"
          ),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const setupAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["establishment"],
          fields: ["name", "geometry", "formatted_address", "place_id"],
        }
      );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place?.geometry?.location && place.name) {
          const businessBase: LeadBusinessDetails = {
            name: place.name,
            address: place.formatted_address || "",
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
            placeId: place.place_id,
          };

          setInputValue(place.name);

          if (place.place_id && window.google?.maps?.places?.PlacesService) {
            const service = new window.google.maps.places.PlacesService(
              document.createElement("div")
            );
            service.getDetails(
              { placeId: place.place_id, fields: ["url"] },
              (res: any, status: any) => {
                let cid: string | undefined;
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK &&
                  res?.url
                ) {
                  const extracted = extractCidFromUrl(res.url);
                  if (extracted) cid = extracted;
                }
                const payload = { ...businessBase, cid } as LeadBusinessDetails;
                onPlaceSelectRef.current?.(payload);
                if (!cid) {
                  console.warn(
                    "CID not found for placeId:",
                    place.place_id,
                    "url:",
                    res?.url
                  );
                } else {
                  //
                }
              }
            );
          } else {
            onPlaceSelectRef.current?.(businessBase);
          }
        }
      });
    };

    if (!disabled) {
      initializeAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [disabled]);

  // Ensure Google suggestions overlay works inside modals
  useEffect(() => {
    // Elevate z-index and ensure solid background for dropdown
    const style = document.createElement("style");
    style.innerHTML = `
      .pac-container{ 
        z-index: 999999 !important; 
        background: hsl(var(--popover)) !important; 
        color: hsl(var(--popover-foreground)) !important;
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        box-shadow: 0 10px 20px -5px hsl(var(--foreground)/0.1);
        pointer-events: auto !important;
      }
      .pac-item{ padding: 8px 12px; }
      .pac-item:hover{ background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    // Stop propagation to Radix Dialog while keeping Google interactions intact
    const stopOutsideDismiss = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest(".pac-container")) {
        e.stopPropagation();
      }
    };
    // Use bubble phase so the event reaches the target first (Google handlers)
    document.addEventListener("pointerdown", stopOutsideDismiss, false);
    document.addEventListener("mousedown", stopOutsideDismiss, false);
    document.addEventListener("click", stopOutsideDismiss, false);

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
      document.removeEventListener("pointerdown", stopOutsideDismiss, false);
      document.removeEventListener("mousedown", stopOutsideDismiss, false);
      document.removeEventListener("click", stopOutsideDismiss, false);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Input
      id="business-name"
      ref={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      placeholder={
        loading
          ? t("leadGooglePlacesInput.placeholders.loading")
          : placeholder || t("leadGooglePlacesInput.placeholders.default")
      }
      disabled={disabled || loading}
      className="w-full"
      autoComplete="off"
      aria-autocomplete="list"
    />
  );
}
