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
import { MultiListingSelector } from "@/components/Posts/CreatePostModal/MultiListingSelector";
import { toast } from "sonner";
import { addBulkMapRankingKeywords } from "@/api/bulkMapRankingApi";

export const CheckBulkMapRank: React.FC = () => {
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("en");
  const [searchBy, setSearchBy] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (selectedListings.length === 0) {
      toast.error("Please select at least one business location.");
      return;
    }
    
    if (!keywords.trim()) {
      toast.error("Please enter at least one keyword.");
      return;
    }
    
    if (!searchBy) {
      toast.error("Please select a search method.");
      return;
    }
    
    if (!scheduleFrequency) {
      toast.error("Please select a schedule frequency.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Transform data for API
      const locationIds = selectedListings.map((id) => parseInt(id, 10));
      const formattedSearchBy = searchBy.toLowerCase(); // "City" → "city"
      
      const requestData = {
        keywords: keywords.trim(),
        locationIds,
        language,
        schedule: scheduleFrequency,
        searchBy: formattedSearchBy,
      };
      
      // Call API
      const response = await addBulkMapRankingKeywords(requestData);
      
      if (response.code === 201) {
        toast.success(response.message || "Keywords added successfully and queued for processing.");
        
        // Reset form
        setSelectedListings([]);
        setKeywords("");
        setSearchBy("");
        setScheduleFrequency("");
        // Keep language as-is (user preference)
      } else {
        toast.error("Failed to add keywords. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding bulk keywords:", error);
      toast.error(error.response?.data?.message || "An error occurred while adding keywords.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Check Bulk Map Rank
        </h1>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Banner Section */}
              <div className="relative hidden lg:block min-h-[400px] lg:min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5" style={{border:"1px solid black"}}>
                <img
                  src="/lovable-uploads/bg-img/map-bg-image.png"
                  alt="Banner"
                  className="w-full h-full object-cover "
                /> 
              </div>

                {/* Column 2: Form Section */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Select Business Name - Multi Select */}
                   <div className="h-[90px]">
                     <div className="space-y-2 relative">
                      <MultiListingSelector
                        selectedListings={selectedListings}
                        onListingsChange={setSelectedListings}
                        label="Select Business Name *"
                        className="absolute z-50 space-y-3 w-full"
                      />
                    </div>
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
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="af">Afrikaans</SelectItem>
                        <SelectItem value="sq">Albanian</SelectItem>
                        <SelectItem value="am">Amharic</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="hy">Armenian</SelectItem>
                        <SelectItem value="az">Azerbaijani</SelectItem>
                        <SelectItem value="eu">Basque</SelectItem>
                        <SelectItem value="be">Belarusian</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="bs">Bosnian</SelectItem>
                        <SelectItem value="bg">Bulgarian</SelectItem>
                        <SelectItem value="my">Burmese</SelectItem>
                        <SelectItem value="ca">Catalan</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                        <SelectItem value="zh-HK">Chinese (Hong Kong)</SelectItem>
                        <SelectItem value="zh-TW">Chinese (Traditional)</SelectItem>
                        <SelectItem value="hr">Croatian</SelectItem>
                        <SelectItem value="cs">Czech</SelectItem>
                        <SelectItem value="da">Danish</SelectItem>
                        <SelectItem value="nl">Dutch</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="en-AU">English (Australian)</SelectItem>
                        <SelectItem value="en-GB">English (Great Britain)</SelectItem>
                        <SelectItem value="et">Estonian</SelectItem>
                        <SelectItem value="fa">Farsi</SelectItem>
                        <SelectItem value="fi">Finnish</SelectItem>
                        <SelectItem value="fil">Filipino</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="fr-CA">French (Canada)</SelectItem>
                        <SelectItem value="gl">Galician</SelectItem>
                        <SelectItem value="ka">Georgian</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="el">Greek</SelectItem>
                        <SelectItem value="gu">Gujarati</SelectItem>
                        <SelectItem value="iw">Hebrew</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="hu">Hungarian</SelectItem>
                        <SelectItem value="is">Icelandic</SelectItem>
                        <SelectItem value="id">Indonesian</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                        <SelectItem value="kk">Kazakh</SelectItem>
                        <SelectItem value="km">Khmer</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="ky">Kyrgyz</SelectItem>
                        <SelectItem value="lo">Lao</SelectItem>
                        <SelectItem value="lv">Latvian</SelectItem>
                        <SelectItem value="lt">Lithuanian</SelectItem>
                        <SelectItem value="mk">Macedonian</SelectItem>
                        <SelectItem value="ms">Malay</SelectItem>
                        <SelectItem value="ml">Malayalam</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                        <SelectItem value="mn">Mongolian</SelectItem>
                        <SelectItem value="ne">Nepali</SelectItem>
                        <SelectItem value="no">Norwegian</SelectItem>
                        <SelectItem value="pl">Polish</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
                        <SelectItem value="pt-PT">Portuguese (Portugal)</SelectItem>
                        <SelectItem value="pa">Punjabi</SelectItem>
                        <SelectItem value="ro">Romanian</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="sr">Serbian</SelectItem>
                        <SelectItem value="si">Sinhalese</SelectItem>
                        <SelectItem value="sk">Slovak</SelectItem>
                        <SelectItem value="sl">Slovenian</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="es-419">Spanish (Latin America)</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="sv">Swedish</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="th">Thai</SelectItem>
                        <SelectItem value="tr">Turkish</SelectItem>
                        <SelectItem value="uk">Ukrainian</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="uz">Uzbek</SelectItem>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                        <SelectItem value="zu">Zulu</SelectItem>
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
                        <SelectItem value="City">City</SelectItem>
                        <SelectItem value="postalcode">Postal Code</SelectItem>
                        <SelectItem value="latLong">Latitude-Longitude</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

          {/* Schedule Frequency */}
          <div className="space-y-2">
            <Label htmlFor="schedule-frequency">Schedule Frequency *</Label>
            <Select
              value={scheduleFrequency}
              onValueChange={setScheduleFrequency}
            >
              <SelectTrigger id="schedule-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onetime">Onetime</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Check Rank Now"}
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
