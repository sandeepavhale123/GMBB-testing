import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, UserCheck, Trash2, Settings, Loader2, Building2, Mail, Phone, Calendar, Tag } from "lucide-react";
import { toast } from "sonner";
import { Lead } from "./LeadsTable";

interface LeadClassifierModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

// Lead classification data structure based on the provided HTML
const leadCategories = {
  'web-lead': {
    label: 'Web Lead',
    icon: Globe,
    options: [
      { value: '1', label: 'Identified as Potential New Client' },
      { value: '2', label: 'Converted' },
      { value: '3', label: 'Warm Leads' },
      { value: '4', label: 'Cold Leads' },
      { value: '5', label: 'Lost Leads' },
      { value: '6', label: 'Did Not Become Client (Other)' },
    ]
  },
  'new-client': {
    label: 'New Client',
    icon: UserCheck,
    options: [
      { value: '7', label: 'Became Client' },
    ]
  },
  'bad-lead': {
    label: 'Bad Lead',
    icon: Trash2,
    options: [
      { value: '8', label: 'Spammer / Telemarketer' },
      { value: '9', label: 'Don\'t Provide This Service' },
    ]
  },
  'other': {
    label: 'Other',
    icon: Settings,
    options: [
      { value: '10', label: 'Identified as Existing Client' },
      { value: '11', label: 'Referral Likely' },
      { value: '12', label: 'Hang Up / Did Not Receive / Unknown' },
      { value: '13', label: 'Other' },
    ]
  }
};

// Business Details Component
const BusinessDetailsPanel: React.FC<{ lead: Lead }> = ({ lead }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Business Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Business Name</p>
              <p className="text-sm">{lead.businessName || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{lead.email || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{lead.phone || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Tag className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Report Type</p>
              <p className="text-sm">{lead.reportTypeLabel || "Not specified"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Settings className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Lead Category</p>
              <p className="text-sm">{lead.leadCategoryLabel || "Not classified"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm">{lead.date || "Not available"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LeadClassifierModal: React.FC<LeadClassifierModalProps> = ({
  open,
  onClose,
  lead,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("web-lead");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a lead classification");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await updateLeadClassification({
      //   leadId: lead?.id,
      //   category: selectedCategory,
      //   notes
      // });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Lead classification updated successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to update lead classification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory("");
    setNotes("");
    setActiveTab("web-lead");
    onClose();
  };

  const handleRadioChange = (value: string) => {
    setSelectedCategory(value);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent
        className="sm:max-w-6xl max-h-[85vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Lead Classifier</DialogTitle>
          <DialogDescription>
            Classify this lead to better organize and track your business opportunities.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Business Details Panel - Left Side */}
          <div className="lg:col-span-2">
            <BusinessDetailsPanel lead={lead} />
          </div>
          
          {/* Classification Panel - Right Side */}
          <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto bg-muted p-1 rounded-lg">
              {Object.entries(leadCategories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex flex-col items-center gap-1 text-xs py-3 px-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all min-h-[60px]"
                  >
                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                    <span className="text-center leading-tight">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {Object.entries(leadCategories).map(([key, category]) => (
                <TabsContent 
                  key={key} 
                  value={key} 
                  className="space-y-4 mt-0 bg-background border border-border rounded-lg p-4"
                >
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Select {category.label} Classification:
                    </h4>
                    <RadioGroup
                      value={selectedCategory}
                      onValueChange={handleRadioChange}
                      className="space-y-3"
                    >
                      {category.options.map((option) => (
                        <div key={option.value} className="flex items-start space-x-3 py-1">
                          <RadioGroupItem
                            value={option.value}
                            id={`radio-${option.value}`}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <Label
                            htmlFor={`radio-${option.value}`}
                            className="text-sm font-normal cursor-pointer flex-1 leading-5"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Lead Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this lead..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Classification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};