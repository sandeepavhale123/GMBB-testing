import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BusinessGooglePlacesInput } from './BusinessGooglePlacesInput';
import { getBusinessDetailsFromCID } from '@/api/businessSearchApi';
import { toast } from '@/hooks/use-toast';
import { MapPin, Search, RefreshCw } from 'lucide-react';
import type { BusinessDetails } from '@/api/businessSearchApi';

interface BusinessSearchFormProps {
  onBusinessSelect?: (business: BusinessDetails) => void;
  disabled?: boolean;
}

export const BusinessSearchForm: React.FC<BusinessSearchFormProps> = ({
  onBusinessSelect,
  disabled = false,
}) => {
  const [searchMethod, setSearchMethod] = useState<'google' | 'cid'>('google');
  const [cidInput, setCidInput] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlaceSelect = (business: BusinessDetails) => {
    setSelectedBusiness(business);
    onBusinessSelect?.(business);
    toast({
      title: "Business Selected",
      description: `Selected: ${business.business_name}`,
    });
  };

  const handleCIDSearch = async () => {
    if (!cidInput.trim()) {
      toast({
        title: "CID Required",
        description: "Please enter a valid CID number.",
        variant: "destructive",
      });
      return;
    }

    // Validate CID format (should be numeric)
    if (!/^\d+$/.test(cidInput.trim())) {
      toast({
        title: "Invalid CID",
        description: "CID should contain only numbers.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await getBusinessDetailsFromCID(cidInput.trim());
      
      if (response.code === 200 && response.data) {
        const business: BusinessDetails = {
          business_name: response.data.business_name,
          lat: response.data.lat,
          long: response.data.long,
        };
        
        setSelectedBusiness(business);
        onBusinessSelect?.(business);
        
        toast({
          title: "Business Found",
          description: `Found: ${business.business_name}`,
        });
      } else {
        toast({
          title: "Business Not Found",
          description: "No business found for the provided CID.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('CID search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search business by CID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedBusiness(null);
    setCidInput('');
    setSearchMethod('google');
    onBusinessSelect?.(null as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Business Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Method Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Search Method</Label>
          <RadioGroup
            value={searchMethod}
            onValueChange={(value) => setSearchMethod(value as 'google' | 'cid')}
            className="flex flex-row gap-6"
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="google" id="google-search" />
              <Label htmlFor="google-search" className="text-sm">
                Google Auto Suggestion
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cid" id="cid-search" />
              <Label htmlFor="cid-search" className="text-sm">
                CID Lookup
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          {searchMethod === 'google' ? (
            <div>
              <Label htmlFor="business-search" className="text-sm font-medium">
                Business Name
              </Label>
              <BusinessGooglePlacesInput
                onPlaceSelect={handlePlaceSelect}
                disabled={disabled}
                placeholder="Start typing to search for a business..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="cid-input" className="text-sm font-medium">
                CID Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cid-input"
                  value={cidInput}
                  onChange={(e) => setCidInput(e.target.value)}
                  placeholder="Enter CID number (e.g., 2898559807244638920)"
                  disabled={disabled || loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleCIDSearch}
                  disabled={disabled || loading || !cidInput.trim()}
                  className="flex-none"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Business Display */}
        {selectedBusiness && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Selected Business</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={disabled}
                className="h-8 px-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-muted-foreground truncate">{selectedBusiness.business_name}</p>
              </div>
              <div>
                <span className="font-medium">Latitude:</span>
                <p className="text-muted-foreground">{selectedBusiness.lat}</p>
              </div>
              <div>
                <span className="font-medium">Longitude:</span>
                <p className="text-muted-foreground">{selectedBusiness.long}</p>
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground">
          {searchMethod === 'google' ? (
            <p>Use Google Places autocomplete to find and select your business location.</p>
          ) : (
            <p>Enter a Google CID (Customer ID) to look up business details directly.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};