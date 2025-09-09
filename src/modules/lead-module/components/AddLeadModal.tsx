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
import { BusinessGooglePlacesInput } from "@/components/BusinessSearch/BusinessGooglePlacesInput";
import { Plus } from "lucide-react";

interface AddLeadModalProps {
  onAddLead: (leadData: LeadFormData) => void;
}

interface LeadFormData {
  businessName: string;
  address: string;
  mapUrl: string;
  cid: string;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ onAddLead }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    businessName: "",
    address: "",
    mapUrl: "",
    cid: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead(formData);
    setFormData({
      businessName: "",
      address: "",
      mapUrl: "",
      cid: "",
    });
    setOpen(false);
  };

  const handlePlaceSelect = (business: any) => {
    setFormData(prev => ({
      ...prev,
      businessName: business.name || "",
      address: business.address || "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="map-url">Map URL</Label>
            <Input
              id="map-url"
              placeholder="Enter Google Maps URL"
              value={formData.mapUrl}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, mapUrl: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cid">CID</Label>
            <Input
              id="cid"
              placeholder="Enter CID"
              value={formData.cid}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, cid: e.target.value }))
              }
            />
          </div>

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