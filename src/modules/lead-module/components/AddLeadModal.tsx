import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LeadGooglePlacesInput } from "./LeadGooglePlacesInput";
import { Plus, Building2, ExternalLink, Hash, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { addLead, AddLeadRequest } from "@/api/leadApi";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";

interface AddLeadModalProps {
  onSuccess?: () => void;
}

interface LeadFormData {
  businessName: string;
  address: string;
  mapUrl: string;
  cid: string;
  email?: string;
  phone?: string;
  location?: string;
  inputMethod: 'name' | 'url' | 'cid';
}

// Form validation schema
const leadFormSchema = z.object({
  businessName: z.string().optional(),
  mapUrl: z.string().optional(), 
  cid: z.string().optional(),
  email: z.string().email("Please enter a valid email").or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  inputMethod: z.enum(['name', 'url', 'cid']),
}).superRefine((data, ctx) => {
  if (data.inputMethod === 'name') {
    if (!data.businessName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['businessName'], message: 'Please select a business' });
    }
    if (!data.cid || !/^\d+$/.test(data.cid)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cid'], message: 'Could not resolve CID. Please select suggestion again or use Map URL/CID.' });
    }
  }
  if (data.inputMethod === 'url') {
    if (!data.mapUrl) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mapUrl'], message: 'Google Maps URL is required' });
    }
  }
  if (data.inputMethod === 'cid') {
    if (!data.cid || !/^\d+$/.test(data.cid)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cid'], message: 'Please enter a valid numeric CID' });
    }
  }
});

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validate, getFieldError, hasFieldError, clearErrors } = useFormValidation(leadFormSchema);
  
  const [formData, setFormData] = useState<LeadFormData>({
    businessName: "",
    address: "",
    mapUrl: "",
    cid: "",
    email: "",
    phone: "",
    location: "",
    inputMethod: 'name',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form data
    const validation = validate(formData);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors and try again.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare API request based on input method
      const apiRequest: AddLeadRequest = {
        inputtype: formData.inputMethod === 'name' ? "0" : 
                  formData.inputMethod === 'url' ? "1" : "2",
        inputtext: formData.inputMethod === 'name' ? formData.cid :
                  formData.inputMethod === 'url' ? formData.mapUrl : formData.cid,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
      };

      const response = await addLead(apiRequest);
      
      if (response.code === 200) {
        toast({
          title: "Success",
          description: response.message || "Lead added successfully",
        });
        
        // Reset form and close modal
        setFormData({
          businessName: "",
          address: "",
          mapUrl: "",
          cid: "",
          email: "",
          phone: "",
          location: "",
          inputMethod: 'name',
        });
        setShowOptionalDetails(false);
        clearErrors();
        setOpen(false);
        
        // Notify parent component
        onSuccess?.();
      } else {
        throw new Error(response.message || "Failed to add lead");
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add lead. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceSelect = useCallback((business: { name: string; address: string; latitude: string; longitude: string; cid?: string; placeId?: string }) => {
    setFormData(prev => ({
      ...prev,
      businessName: business.name || "",
      address: business.address || "",
      cid: business.cid || "",
    }));
  }, []);

  const isFromPac = (e: any) => {
    const original = e?.detail?.originalEvent as Event | undefined;
    const t = (original?.target as HTMLElement) || (e.target as HTMLElement | null);
    return !!t?.closest?.('.pac-container');
  };

  const renderPrimaryFields = () => {
    switch (formData.inputMethod) {
      case 'name':
        return (
          <div className="space-y-2">
            <Label htmlFor="business-name">Search by business name</Label>
            <LeadGooglePlacesInput
              onPlaceSelect={handlePlaceSelect}
              placeholder="Search for business name..."
              defaultValue={formData.businessName}
            />
            {hasFieldError("businessName") && (
              <p className="text-sm text-destructive">{getFieldError("businessName")}</p>
            )}
            {hasFieldError("cid") && (
              <p className="text-sm text-destructive">{getFieldError("cid")}</p>
            )}
          </div>
        );
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="map-url">Google Maps URL</Label>
            <Input
              id="map-url"
              type="url"
              placeholder="Enter Google Maps URL"
              value={formData.mapUrl}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, mapUrl: e.target.value }))
              }
            />
            {hasFieldError("mapUrl") && (
              <p className="text-sm text-destructive">{getFieldError("mapUrl")}</p>
            )}
          </div>
        );
      case 'cid':
        return (
          <div className="space-y-2">
            <Label htmlFor="cid"> Listing CID</Label>
            <Input
              id="cid"
              placeholder="Enter CID"
              value={formData.cid}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, cid: e.target.value }))
              }
            />
            {hasFieldError("cid") && (
              <p className="text-sm text-destructive">{getFieldError("cid")}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent
          className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => { if (isFromPac(e)) e.preventDefault(); }}
          onFocusOutside={(e) => { if (isFromPac(e)) e.preventDefault(); }}
          onInteractOutside={(e) => { if (isFromPac(e)) e.preventDefault(); }}
        >
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">How would you like to add business details?</Label>
            <RadioGroup
              value={formData.inputMethod}
              onValueChange={(value: 'name' | 'url' | 'cid') =>
                setFormData(prev => ({ ...prev, inputMethod: value }))
              }
              className="flex flex-col sm:flex-row sm:gap-6 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name" className="cursor-pointer">
                  Google Auto suggestion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url" className="cursor-pointer">
                  Google Maps URL
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cid" id="cid" />
                <Label htmlFor="cid" className="cursor-pointer">
                  Listing CID
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Primary Fields */}
          <div className="space-y-4">
            {renderPrimaryFields()}
          </div>

          {/* Optional Details Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="optional-toggle" className="text-sm font-medium">
              Add optional details
            </Label>
            <Switch
              id="optional-toggle"
              checked={showOptionalDetails}
              onCheckedChange={setShowOptionalDetails}
            />
          </div>

          {/* Optional Fields */}
          {showOptionalDetails && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                />
                {hasFieldError("email") && (
                  <p className="text-sm text-destructive">{getFieldError("email")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Latitude, Longitude or City (Optional)</span>
                </Label>
                <Textarea
                  id="location"
                  placeholder="Enter location lat , long or city"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>

              <div className="bg-gray-1000 p-4 rounded-md ">
                 <p className="text-sm mb-2"># Latitude and longitude should be entered as follows: lat:34.048927,lon:-111.093735,zoom=15</p>
                 <p className="text-sm"># The free text should be entered as follows: City, State, Country</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Lead...
                </>
              ) : (
                "Add Lead"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};