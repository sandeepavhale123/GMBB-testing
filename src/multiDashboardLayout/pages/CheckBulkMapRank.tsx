import React, { useState, useEffect } from "react";
import { Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiListingSelector } from "@/components/Posts/CreatePostModal/MultiListingSelector";
import { toast } from "sonner";
import { addBulkMapRankingKeywords } from "@/api/bulkMapRankingApi";
import { generateCSVForBulkMapRanking } from "@/api/bulkMapRankingApi";
export const CheckBulkMapRank: React.FC = () => {
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("en");
  const [searchBy, setSearchBy] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywordError, setKeywordError] = useState(false);
  const [isVisibleImportCSV, setIsVisibleImportCSV] = useState<boolean>(false);
  const [uploadedCSVFile, setUploadedCSVFile] = useState<File | null>(null);
  const [isGeneratingCSV, setIsGeneratingCSV] = useState(false);
  const [showCSVSection, setShowCSVSection] = useState(true);
  const [listingSelectionError, setListingSelectionError] = useState<string>("");
  const [generatedCSVFileUrl, setGeneratedCSVFileUrl] = useState<string>("");
  const [csvUploadError, setCsvUploadError] = useState<string>("");

  const navigate = useNavigate();

  // const handleGenerateCSV = () => {
  //   // Validate that at least one listing is selected
  //   if (selectedListings.length === 0) {
  //     setListingSelectionError("Select at least one listing or group to continue.");
  //     return;
  //   }

  //   // Clear any existing error
  //   setListingSelectionError("");

  //   setIsGeneratingCSV(true);

  //   // Show spinner for 5 seconds
  //   setTimeout(() => {
  //     setIsGeneratingCSV(false);
  //     setShowCSVSection(true);
  //   }, 5000);
  // };

  useEffect(() => {
    // Clear error when user selects at least one listing
    if (selectedListings.length > 0 && listingSelectionError) {
      setListingSelectionError("");
    }

    // If CSV section is showing and user changes listing selection, reset to initial state
    if (showCSVSection) {
      setShowCSVSection(false);
      setUploadedCSVFile(null);
    }
  }, [selectedListings]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only validate keywords if NOT in CSV import mode
    if (!isVisibleImportCSV) {
      // Check current keyword count
      const currentKeywords = keywords
        .trim()
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      // If user is trying to add a comma and already has 5 keywords, prevent it
      if (value.endsWith(",") && currentKeywords.length >= 5) {
        setKeywordError(true);
        return; // Don't update the value
      }

      // Validate keyword count in real-time
      const keywordArray = value
        .trim()
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      
      if (keywordArray.length > 5) {
        setKeywordError(true);
      } else {
        setKeywordError(false);
      }
    } else {
      // In CSV mode, clear any keyword errors
      setKeywordError(false);
    }
    
    setKeywords(value);
  };

  const handleCSVFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setUploadedCSVFile(null);
      setCsvUploadError("");
      return;
    }
    
    // Validate file is CSV
    const fileExtension = file.name.toLowerCase().split(".").pop();
    const isCSV = file.type === "text/csv" || 
                  file.type === "application/vnd.ms-excel" || 
                  fileExtension === "csv";
    
    if (!isCSV) {
      setCsvUploadError("Please upload a CSV file only");
      setUploadedCSVFile(null);
      toast.error("Please upload a CSV file only");
      e.target.value = ""; // Reset file input
      return;
    }
    
    // Valid CSV file
    setCsvUploadError("");
    setUploadedCSVFile(file);
    toast.success(`"${file.name}" uploaded successfully`);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (selectedListings.length === 0) {
      toast.error("Please select at least one business location.");
      return;
    }
    
    // Only validate keywords if NOT in CSV import mode
    if (!isVisibleImportCSV) {
      if (!keywords.trim()) {
        toast.error("Please enter at least one keyword.");
        return;
      }

      // Validate keyword count (max 5)
      const keywordArray = keywords
        .trim()
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      if (keywordArray.length > 5) {
        toast.error("Maximum 5 keywords allowed. Please reduce the number of keywords.");
        return;
      }
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

        // Navigate after short delay to show toast
        setTimeout(() => {
          navigate("/main-dashboard/bulk-map-ranking");
        }, 1500);
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

  // generate CSV file

  const handleGenerateCSV = async () => {
    console.log("Generate CSV function called...");
    try {
      const locationId = selectedListings.map((id) => parseInt(id, 10));
      setIsGeneratingCSV(true);
      const response = await generateCSVForBulkMapRanking({
        listingIds: locationId,
      });
      setGeneratedCSVFileUrl(response.data.fileUrl);
      setIsGeneratingCSV(false);
      setShowCSVSection(true);
    } catch (error) {
      console.log("error", error);
      setIsGeneratingCSV(false);
    } finally {
      setIsGeneratingCSV(false);
    }
  };
  return (
    <div className="flex-1 space-y-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Check Bulk Map Rank</h1>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Banner Section */}
              <div
                className="relative hidden lg:block min-h-[400px] lg:min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5"
                style={{
                  border: "1px solid black",
                }}
              >
                <img
                  src="/lovable-uploads/bg-img/map-bg-image.webp"
                  alt="Banner"
                  className="w-full h-full object-cover "
                />
              </div>

              {/* Column 2: Form Section */}
              <div className="space-y-6">
                <div className="flex justify-end mb-[-25px]">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-[15px] cursor-pointer  ml-auto"
                    onClick={() => setIsVisibleImportCSV(!isVisibleImportCSV)}
                  >
                    {isVisibleImportCSV ? "Manually Check" : "Import CSV"}
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Business Name - Multi Select */}
                  <div className="h-[90px] ">
                    <div className="space-y-2 relative">
                      <MultiListingSelector
                        selectedListings={selectedListings}
                        onListingsChange={setSelectedListings}
                        label="Select Business Name *"
                        className="absolute z-50 space-y-3 w-full"
                      />
                    </div>
                  </div>
                  {!isVisibleImportCSV ? (
                    <div className="space-y-2">
                      {/* Keywords */}
                      <Label htmlFor="keywords">
                        Keywords <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="keywords"
                        type="text"
                        placeholder="Enter keywords separated by commas"
                        value={keywords}
                        onChange={handleKeywordChange}
                        className={keywordError ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {keywordError && (
                        <p className="text-xs text-destructive">
                          Maximum 5 keywords allowed. You have entered{" "}
                          {
                            keywords
                              .trim()
                              .split(",")
                              .map((k) => k.trim())
                              .filter((k) => k.length > 0).length
                          }{" "}
                          keywords.
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Example: pizza restaurant, best coffee shop (Maximum 5 keywords)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 ">
                      {!showCSVSection && !isGeneratingCSV && (
                        <Button className="w-full" variant="outline" type="button" onClick={handleGenerateCSV}>
                          Generate Sample CSV File{" "}
                          {selectedListings.length > 0 && `for ${selectedListings.length} listings`}
                        </Button>
                      )}

                      {isGeneratingCSV && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-3">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Generating CSV...</span>
                        </div>
                      )}

                      {showCSVSection && (
                        <>
                          <a href={generatedCSVFileUrl} download>
                            <Button className="w-full btn-secondary" type="button">
                              Download CSV sample file <Download />
                            </Button>
                          </a>
                          <div className="space-y-2">
                            <Label htmlFor="csv-upload" className="text-sm font-medium">
                              Upload CSV File <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="csv-upload"
                              type="file"
                              accept=".csv"
                              onChange={handleCSVFileUpload}
                              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            {uploadedCSVFile && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                                <span>Selected: {uploadedCSVFile.name}</span>
                              </div>
                            )}
                            {csvUploadError && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <XCircle className="h-4 w-4" />
                                {csvUploadError}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

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
                    <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
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
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Check Rank Now"}
                  </Button>
                </form>

                {/* Submit Button */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
