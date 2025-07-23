import React, { useEffect, useRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface PlaceResult {
  name?: string;
  formatted_address?: string;
  geometry?: any;
}

interface GooglePlacesInputProps extends React.ComponentProps<"input"> {
  onPlaceSelect?: (place: PlaceResult) => void;
}

export const GooglePlacesInput = React.forwardRef<HTMLInputElement, GooglePlacesInputProps>(
  ({ className, onPlaceSelect, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    useEffect(() => {
      const initAutocomplete = () => {
        if (inputRef.current && (window as any).google?.maps?.places) {
          autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
            types: ['(cities)'],
            fields: ['name', 'formatted_address', 'geometry']
          });

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && inputRef.current) {
              // Update the input value to sync with React's controlled component
              const selectedValue = place.name || place.formatted_address || '';
              inputRef.current.value = selectedValue;
              
              // Trigger onChange event to update parent state
              const event = new Event('input', { bubbles: true });
              Object.defineProperty(event, 'target', {
                writable: false,
                value: inputRef.current
              });
              inputRef.current.dispatchEvent(event);
              
              if (onPlaceSelect) {
                onPlaceSelect(place);
              }
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
          (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }, [onPlaceSelect]);

    return (
      <Input
        {...props}
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(className)}
      />
    );
  }
);

GooglePlacesInput.displayName = "GooglePlacesInput";