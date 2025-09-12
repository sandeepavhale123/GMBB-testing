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
        fields: ['name', 'geometry', 'formatted_address'],
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
    // Elevate z-index and ensure solid background for dropdown
    const style = document.createElement('style');
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
      if (target && target.closest('.pac-container')) {
        e.stopPropagation();
      }
    };
    // Use bubble phase so the event reaches the target first (Google handlers)
    document.addEventListener('pointerdown', stopOutsideDismiss, false);
    document.addEventListener('mousedown', stopOutsideDismiss, false);
    document.addEventListener('click', stopOutsideDismiss, false);

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
      document.removeEventListener('pointerdown', stopOutsideDismiss, false);
      document.removeEventListener('mousedown', stopOutsideDismiss, false);
      document.removeEventListener('click', stopOutsideDismiss, false);
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