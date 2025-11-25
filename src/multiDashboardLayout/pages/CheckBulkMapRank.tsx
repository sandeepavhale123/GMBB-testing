import React, { useState, useEffect } from "react";
import { Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiListingSelector } from "@/components/Posts/CreatePostModal/MultiListingSelector";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { addBulkMapRankingKeywords, uploadMapRankingCSV, CSVValidationError } from "@/api/bulkMapRankingApi";
import { generateCSVForBulkMapRanking } from "@/api/bulkMapRankingApi";
import { CSVValidationErrorModal } from "@/multiDashboardLayout/components/CSVValidationErrorModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
export const CheckBulkMapRank: React.FC = () => {

  const { t } = useI18nNamespace('MultidashboardPages/checkBulkMapRank')

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("en");
  const [searchBy, setSearchBy] = useState("City");
  const [scheduleFrequency, setScheduleFrequency] = useState("onetime");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywordError, setKeywordError] = useState(false);
  const [isVisibleImportCSV, setIsVisibleImportCSV] = useState<boolean>(false);
  const [uploadedCSVFile, setUploadedCSVFile] = useState<File | null>(null);
  const [isGeneratingCSV, setIsGeneratingCSV] = useState(false);
  const [showCSVSection, setShowCSVSection] = useState(true);
  const [listingSelectionError, setListingSelectionError] = useState<string>("");
  const [generatedCSVFileUrl, setGeneratedCSVFileUrl] = useState<string>("");
  const [csvUploadError, setCsvUploadError] = useState<string>("");

  // CSV Error Modal State
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [csvErrorCount, setCsvErrorCount] = useState(0);
  const [csvErrors, setCsvErrors] = useState<CSVValidationError[]>([]);
  const navigate = useNavigate();
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
      const currentKeywords = keywords.trim().split(",").map(k => k.trim()).filter(k => k.length > 0);

      // If user is trying to add a comma and already has 5 keywords, prevent it
      if (value.endsWith(",") && currentKeywords.length >= 5) {
        setKeywordError(true);
        return; // Don't update the value
      }

      // Validate keyword count in real-time
      const keywordArray = value.trim().split(",").map(k => k.trim()).filter(k => k.length > 0);
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
    const isCSV = file.type === "text/csv" || file.type === "application/vnd.ms-excel" || fileExtension === "csv";
    if (!isCSV) {
      setCsvUploadError(t("csv.invalidCsv"));
      setUploadedCSVFile(null);
      toast({
        title: t("toast.error"),
        description: t("csv.invalidCsv"),
        variant: "destructive",
      });
      e.target.value = ""; // Reset file input
      return;
    }

    // Valid CSV file
    setCsvUploadError("");
    setUploadedCSVFile(file);
    toast({
      title:t("toast.success"),
      description: `"${file.name}" ${t("toast.csvUploaded ")}`,
      variant: "success",
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (selectedListings.length === 0) {
      toast({
        title: t("toast.error"),
        description: t("toast.listingMissing"),
        variant: "destructive",
      });
      return;
    }

    // Different validation based on mode
    if (isVisibleImportCSV) {
      // CSV Mode: Validate CSV file is uploaded
      if (!uploadedCSVFile) {
        toast({
          title: t("toast.error"),
          description: t("csv.noFileUploaded"),
          variant: "destructive",
        });
        return;
      }
    } else {
      // Manual Mode: Validate keywords
      if (!keywords.trim()) {
        toast({
          title: t("toast.error"),
          description: t("toast.keywordMissing"),
          variant: "destructive",
        });
        return;
      }

      // Validate keyword count (max 5)
      const keywordArray = keywords.trim().split(",").map(k => k.trim()).filter(k => k.length > 0);
      if (keywordArray.length > 5) {
        toast({
          title: t("toast.error"),
          description:  t("toast.keywordLimitExceeded"),
          variant: "destructive",
        });
        return;
      }
    }
    if (!searchBy) {
      toast({
        title: t("toast.error"),
        description: t("toast.searchMethodMissing"),
        variant: "destructive",
      });
      return;
    }
    if (!scheduleFrequency) {
      toast({
        title: t("toast.error"),
        description: t("toast.scheduleMissing"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      if (isVisibleImportCSV && uploadedCSVFile) {
        const formattedSearchBy = searchBy.toLowerCase();
        const response = await uploadMapRankingCSV({
          userFile: uploadedCSVFile,
          language,
          schedule: scheduleFrequency,
          searchBy: formattedSearchBy,
        });
        if (response.code === 200) {
          // Success
          toast({
            title:t("toast.success"),
            description: response.message || t("toast.csvProcessed"),
            variant: "success",
          });
          // Invalidate queries to refresh data on next page
          queryClient.invalidateQueries({ queryKey: ["bulk-map-ranking-keywords"] });
          queryClient.invalidateQueries({ queryKey: ["bulk-map-ranking-stats"] });
          // Reset form
          setUploadedCSVFile(null);
          setSelectedListings([]);
          setSearchBy("");
          setScheduleFrequency("");
          setIsVisibleImportCSV(false);
          // Navigate after short delay
          setTimeout(() => {
            navigate("/main-dashboard/bulk-map-ranking");
          }, 1500);
        } else if (response.code === 401) {
          // Validation errors
          setCsvErrorCount(response.data.errorCount);
          setCsvErrors(response.data.rows);
          setIsErrorModalOpen(true);
        } else {
          toast({
            title: t("toast.error"),
            description: t("toast.csvUploadFailed"),
            variant: "destructive",
          });
        }
      } else {
        // Manual Keyword Entry Mode (existing logic)
        const locationIds = selectedListings.map(id => parseInt(id, 10));
        const formattedSearchBy = searchBy.toLowerCase();
        const requestData = {
          keywords: keywords.trim(),
          locationIds,
          language,
          schedule: scheduleFrequency,
          searchBy: formattedSearchBy,
        };
        const response = await addBulkMapRankingKeywords(requestData);
        if (response.code === 201) {
          toast({
            title:t("toast.success"),
            description: response.message || t("toast.keywordsAdded"),
            variant: "success",
          });
          // Invalidate queries to refresh data on next page
          queryClient.invalidateQueries({ queryKey: ["bulk-map-ranking-keywords"] });
          queryClient.invalidateQueries({ queryKey: ["bulk-map-ranking-stats"] });
          // Reset form
          setSelectedListings([]);
          setKeywords("");
          setSearchBy("");
          setScheduleFrequency("");
          // Navigate after short delay
          setTimeout(() => {
            navigate("/main-dashboard/bulk-map-ranking");
          }, 1500);
        } else {
          toast({
            title: t("toast.error"),
            description: t("toast.keywordsAddFailed"),
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      // Check if it's a CSV validation error (401)
      if (error.response?.status === 401 && error.response?.data?.data?.rows) {
        setCsvErrorCount(error.response.data.data.errorCount);
        setCsvErrors(error.response.data.data.rows);
        setIsErrorModalOpen(true);
      } else {
        // toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReuploadCSV = () => {
    // Close error modal
    setIsErrorModalOpen(false);
    // Clear uploaded file to allow re-upload
    setUploadedCSVFile(null);
    // Trigger file input click
    const fileInput = document.getElementById("csv-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset input
      fileInput.click(); // Open file picker
    }
  };
  // generate CSV file
  const handleGenerateCSV = async () => {
    console.log("Generate CSV function called...");
    try {
      const locationId = selectedListings.map(id => parseInt(id, 10));
      setIsGeneratingCSV(true);
      const response = await generateCSVForBulkMapRanking({
        listingIds: locationId
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
  return <div className="flex-1 space-y-6 ">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t('page.title')}</h1>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-start items-start">
            {/* Column 1: Banner Section */}
            <div className="relative hidden lg:block min-h-[400px] lg:min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5" style={{
              border: "1px solid black"
            }}>
              <img src="/lovable-uploads/bg-img/map-bg-image.webp" alt="Banner" className="w-full h-full object-cover " />
            </div>
            {/* Column 2: Form Section */}
            <div className="space-y-6">
              <div className="flex justify-end mb-[-25px]">
                <Button type="button" variant="ghost" className="text-[15px] cursor-pointer  ml-auto" onClick={() => setIsVisibleImportCSV(!isVisibleImportCSV)}>
                  {isVisibleImportCSV ? t('buttons.manuallyCheck')  : t('buttons.importCsv') }
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Business Name - Multi Select */}
                <div className="h-[90px] ">
                  <div className="space-y-2 relative">
                    <MultiListingSelector selectedListings={selectedListings} onListingsChange={setSelectedListings} label={t('form.businessNameLabel') } className="absolute z-10 space-y-3 w-full" />
                  </div>
                </div>
                {!isVisibleImportCSV ? <div className="space-y-2">
                  {/* Keywords */}
                  <Label htmlFor="keywords">
                    {t('form.keywordsLabel')  }
                  </Label>
                  <Input id="keywords" type="text" placeholder={t('form.keywordsPlaceholder')} value={keywords} onChange={handleKeywordChange} className={keywordError ? "border-destructive focus-visible:ring-destructive" : ""} />
                  {keywordError && <p className="text-xs text-destructive">
                    {t('form.keywordsLimitMessage') }{" "}
                    {keywords.trim().split(",").map(k => k.trim()).filter(k => k.length > 0).length}{" "}
                    {t('form.keywordsLabel')  } .
                  </p>}
                  <p className="text-xs text-muted-foreground">
                   {t('form.keywordsExample') }
                  </p>
                </div> : <div className="space-y-6 ">
                  {!showCSVSection && !isGeneratingCSV && <Button className="w-full" variant="outline" type="button" onClick={handleGenerateCSV}>
                   {t('buttons.generateSampleCsv') }{" "}
                    {selectedListings.length > 0 && `for ${selectedListings.length} listings`}
                  </Button>}

                  {isGeneratingCSV && <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">{t('csv.generatingCsv')}</span>
                  </div>}

                  {showCSVSection && <>
                    <a href={generatedCSVFileUrl} download>
                      <Button className="w-full btn-secondary" type="button">
                        {t('buttons.downloadCsvSample')  } <Download />
                      </Button>
                    </a>
                    <div className="space-y-2">
                      <Label htmlFor="csv-upload" className="text-sm font-medium">
                        {t('csv.uploadLabel')}<span>*</span>
                      </Label>
                      <Input id="csv-upload" type="file" accept=".csv" onChange={handleCSVFileUpload} className="cursor-pointer file:mr-4 file:py-1 h-[45px] file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                      {uploadedCSVFile && <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                        <span>{t('csv.selectedFile')}{uploadedCSVFile.name}</span>
                      </div>}
                      {csvUploadError && <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {csvUploadError}
                      </p>}
                    </div>
                  </>}
                </div>}

                {/* Select Language (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="language"> {t('form.languageSelect')  } </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t('form.languageSelectPlaceholder')  } />
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
                  <Label htmlFor="search-by">{t('form.searchByLabel')}</Label>
                  <Select value={searchBy} onValueChange={setSearchBy}>
                    <SelectTrigger id="search-by">
                      <SelectValue placeholder={t('form.searchByPlaceholder') } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="City">{t('searchByOptions.city')}</SelectItem>
                      <SelectItem value="postalcode">{t('searchByOptions.postalCode')} </SelectItem>
                      <SelectItem value="latLong">{t('searchByOptions.latLong')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Schedule Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="schedule-frequency">{t('form.scheduleFrequencyLabel')}</Label>
                  <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                    <SelectTrigger id="schedule-frequency">
                      <SelectValue placeholder={t('form.scheduleFrequencyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onetime">{t('scheduleFrequencyOptions.onetime')}</SelectItem>
                      <SelectItem value="weekly">{t('scheduleFrequencyOptions.weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('scheduleFrequencyOptions.monthly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting
                    ? (isVisibleImportCSV ? t('buttons.uploadingCsv') : t('buttons.processing'))
                    : (isVisibleImportCSV ? t('buttons.uploadCheckRank')   : t('buttons.checkRankNow'))
                  }
                </Button>
              </form>

              {/* Submit Button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* CSV Validation Error Modal */}
    <CSVValidationErrorModal
      isOpen={isErrorModalOpen}
      onClose={() => setIsErrorModalOpen(false)}
      errorCount={csvErrorCount}
      errors={csvErrors}
      onReupload={handleReuploadCSV}
    />
  </div>;
};