import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { getLeadApiKeyForSearch } from '../api/leadSearchApi';

interface LeadBusinessDetails {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
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
  defaultValue = '',
  disabled = false,
  placeholder = 'Search for a business...',
}: LeadGooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        setLoading(true);
        
        // Get API key from lead module endpoint
        const apiKeyResponse = await getLeadApiKeyForSearch();
        const apiKey = apiKeyResponse.data.apikey;

        if (!apiKey) {
          toast({
            title: "API Key Missing",
            description: "Google Places API key is not configured.",
            variant: "destructive",
          });
          return;
        }

        // Load Google Maps script if not already loaded
        if (!window.google) {
          const script = document.createElement('script');
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
        console.error('Failed to initialize Google Places:', error);
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
        types: ['establishment'],
        componentRestrictions: { country: 'in' },
        fields: ['name', 'geometry.location', 'formatted_address'],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.geometry && place.geometry.location && place.name) {
          const businessDetails: LeadBusinessDetails = {
            name: place.name,
            address: place.formatted_address || '',
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
          };

          setInputValue(place.name);
          onPlaceSelect?.(businessDetails);
        }
      });
    };

    if (!disabled) {
      initializeAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [disabled, onPlaceSelect]);

  // Ensure Google suggestions overlay works inside modals
  useEffect(() => {
    // elevate z-index for Google suggestions dropdown
    const style = document.createElement('style');
    style.innerHTML = `.pac-container{ z-index: 999999 !important; }`;
    document.head.appendChild(style);
    styleRef.current = style;

    // prevent Radix Dialog from blocking clicks on Google suggestions
    const stopPropagation = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.pac-container')) {
        e.stopPropagation();
      }
    };
    document.addEventListener('pointerdown', stopPropagation, true);
    document.addEventListener('mousedown', stopPropagation, true);
    document.addEventListener('click', stopPropagation, true);

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
      document.removeEventListener('pointerdown', stopPropagation, true);
      document.removeEventListener('mousedown', stopPropagation, true);
      document.removeEventListener('click', stopPropagation, true);
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
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
      placeholder={loading ? "Loading Google Places..." : placeholder}
      disabled={disabled || loading}
      className="w-full"
      autoComplete="off"
      aria-autocomplete="list"
    />
  );
}