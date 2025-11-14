import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const CheckBulkMapRank: React.FC = () => {
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("");

  const businessOptions = [
    { id: "1", name: "Main Street Pizza" },
    { id: "2", name: "Downtown Coffee Shop" },
    { id: "3", name: "Harbor Restaurant" },
    { id: "4", name: "City Center Bakery" },
    { id: "5", name: "Sunset Diner" },
  ];

  const handleBusinessSelect = (businessId: string) => {
    setSelectedBusinesses((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      selectedBusinesses,
      keywords,
      language,
      searchBy,
      enableSchedule,
      scheduleFrequency,
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Check Bulk Map Rank
        </h1>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Banner Section */}
              <div className="relative h-full min-h-[400px] lg:min-h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                <img
                  src="/placeholder.svg"
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm">
                  <div className="text-center p-6">
                    <p className="text-2xl font-bold text-foreground mb-2">
                      Banner Image
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Update manually with your own image
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2: Form Section */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Business Name - Multi Select */}
                  <div className="space-y-2">
                    <Label htmlFor="business-name">
                      Select Business Name *
                    </Label>
                    <div className="border rounded-md p-4 space-y-3 max-h-[200px] overflow-y-auto bg-background">
                      {businessOptions.map((business) => (
                        <div
                          key={business.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`business-${business.id}`}
                            checked={selectedBusinesses.includes(business.id)}
                            onCheckedChange={() =>
                              handleBusinessSelect(business.id)
                            }
                          />
                          <label
                            htmlFor={`business-${business.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {business.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select one or more businesses to check rankings
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords *</Label>
                    <Input
                      id="keywords"
                      type="text"
                      placeholder="Enter keywords separated by commas"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: pizza restaurant, best coffee shop
                    </p>
                  </div>

                  {/* Select Language (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Select Language (Optional)</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Choose a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search By */}
                  <div className="space-y-2">
                    <Label htmlFor="search-by">Search By *</Label>
                    <Select value={searchBy} onValueChange={setSearchBy}>
                      <SelectTrigger id="search-by">
                        <SelectValue placeholder="Select search method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business-name">
                          Business Name
                        </SelectItem>
                        <SelectItem value="cid">CID</SelectItem>
                        <SelectItem value="map-url">Map URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Enable Schedule Check */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enable-schedule"
                        checked={enableSchedule}
                        onCheckedChange={(checked) =>
                          setEnableSchedule(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="enable-schedule"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Enable Schedule Check
                      </Label>
                    </div>
                    {enableSchedule && (
                      <Select
                        value={scheduleFrequency}
                        onValueChange={setScheduleFrequency}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg">
                    Check Rank Now
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
