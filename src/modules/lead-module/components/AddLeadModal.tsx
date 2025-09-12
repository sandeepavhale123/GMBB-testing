import React, { useState } from "react";
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
import { BusinessGooglePlacesInput } from "@/components/BusinessSearch/BusinessGooglePlacesInput";
import { Plus, Building2, ExternalLink, Hash, Mail, Phone, MapPin } from "lucide-react";

interface AddLeadModalProps {
  onAddLead: (leadData: LeadFormData) => void;
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

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ onAddLead }) => {
  const [open, setOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead(formData);
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
    setOpen(false);
  };

  const handlePlaceSelect = (business: any) => {
    setFormData(prev => ({
      ...prev,
      businessName: business.name || "",
      address: business.address || "",
    }));
  };

  const renderPrimaryFields = () => {
    switch (formData.inputMethod) {
      case 'name':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="google-places">Business Address</Label>
              <BusinessGooglePlacesInput
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for business address..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="Enter business name"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, businessName: e.target.value }))
                }
              />
            </div>
          </>
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
          </div>
        );
      case 'cid':
        return (
          <div className="space-y-2">
            <Label htmlFor="cid">Customer ID (CID)</Label>
            <Input
              id="cid"
              placeholder="Enter CID"
              value={formData.cid}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, cid: e.target.value }))
              }
            />
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
      <DialogContent className="sm:max-w-lg">
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
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name" className="flex items-center space-x-2 cursor-pointer">
                  <Building2 className="h-4 w-4" />
                  <span>Business Name</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url" className="flex items-center space-x-2 cursor-pointer">
                  <ExternalLink className="h-4 w-4" />
                  <span>Google Maps URL</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cid" id="cid" />
                <Label htmlFor="cid" className="flex items-center space-x-2 cursor-pointer">
                  <Hash className="h-4 w-4" />
                  <span>Customer ID (CID)</span>
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
                  <span>Additional Location Notes</span>
                </Label>
                <Textarea
                  id="location"
                  placeholder="Enter additional location details..."
                  value={formData.location}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};