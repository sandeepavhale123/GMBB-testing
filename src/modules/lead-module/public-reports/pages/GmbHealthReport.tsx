import React from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Heart,
  Star,
  MapPin,
  Phone,
  Globe,
  Users,
  Loader2,
  Check,
  X,
  CheckCircle,
  Lightbulb,
  Building2,
} from "lucide-react";
import { ProgressCard } from "../components/ProgressCard";
import { RankingFactorsGrid } from "../components/RankingFactorsGrid";
import { PostsOnGMB } from "../components/PostsOnGMB";
import { PhotoGallery } from "../components/PhotoGallery";
import { ReviewsSection } from "../components/ReviewsSection";

import { BusinessHours } from "../components/BusinessHours";
import { CTASection } from "../components/CTASection";
import { SingleCTASection } from "../components/SingleCTASection";
import { Top20CompetitorsCard } from "../components/Top20CompetitorsCard";
import { CircularProgress } from "@/components/ui/circular-progress";
import { useGetGmbHealthReport } from "@/api/leadApi";
import { useGetLeadReportBranding } from "@/hooks/useReportBranding";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import i18n from "@/i18n";

// export const namespaces = ["Lead-module-public-report/gmbHealthReport"];

export const GmbHealthReport: React.FC = () => {
  const { t, loaded } = useI18nNamespace(
    "Lead-module-public-report/gmbHealthReport"
  );
  const { reportId } = useParams<{
    reportId: string;
  }>();
  interface Language {
    code: string;
    name: string;
  }

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "fr", name: "French" },
  ];

  const currentLang = i18n.language || "en";

  // Find the full name
  const currentLangName = languages.find(
    (lang) => lang.code === currentLang
  )?.name;
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetGmbHealthReport(reportId || "", currentLangName);

  const { data: brandingResponse } = useGetLeadReportBranding(
    reportId || "",
    currentLangName
  );
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }
  if (error || !apiResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t("error_title")}</p>
          <p className="text-muted-foreground">{t("error_description")}</p>
        </div>
      </div>
    );
  }
  const reportData = apiResponse.data;
  // Transform API data
  const transformedReportData = {
    title: t("health_report"),
    listingName: reportData.businessInfo.businessName,
    address: reportData.businessInfo.address,
    logo: "",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    healthScore: parseInt(reportData.healthScore),
    leadScore: parseInt(reportData.healthScore),
    avgRating: parseFloat(reportData.reviewRating),
    totalReviews: parseInt(reportData.reviewCount),
    totalPhotos: reportData.communication?.photos?.length || 0,
    responseRate: 92,
    listingViews: 15420,
    webClicks: 892,
    phoneClicks: 234,
    directionRequests: 1560,
  };
  // Transform ranking factors based on API data
  const rankingFactors = [
    {
      id: "3",
      label: t("phone_no"),
      status: reportData.businessInfo.phoneNumber
        ? ("good" as const)
        : ("needs-work" as const),
      description: t("phone_desc"),
      icon: "phone",
    },
    {
      id: "4",
      label: t("business"),
      status: reportData.businessInfo.website
        ? ("good" as const)
        : ("needs-work" as const),
      description: t("business_desc"),
      icon: "globe",
    },
    {
      id: "5",
      label: t("hour"),
      status:
        (reportData.communication?.businessHours?.per_day?.length || 0) > 0
          ? ("good" as const)
          : ("needs-work" as const),
      description: t("hour_desc"),
      icon: "clock",
    },
    {
      id: "6",
      label: t("description"),
      status: "good" as const,
      description: t("desc"),
      icon: "file-text",
    },
    {
      id: "7",
      label: t("category1"),
      status: reportData.businessInfo.category
        ? ("good" as const)
        : ("needs-work" as const),
      description: t("category_desc"),
      icon: "tag",
    },
    {
      id: "9",
      label: t("photo"),
      status:
        (reportData.communication?.photos?.length || 0) > 5
          ? ("good" as const)
          : ("needs-work" as const),
      description: t("photo_desc"),

      icon: "camera",
    },
  ];
  // Transform photos from API data
  const photos = (reportData.communication?.photos || []).map(
    (photo, index) => ({
      id: (index + 1).toString(),
      url: photo.image,
      alt: `Business photo ${index + 1}`,
      category: "Business",
    })
  );
  // Transform reviews from API data
  const reviews = (reportData.listingReputation?.reviews || [])
    .slice(0, 10)
    .map((review, index) => ({
      id: review.id,
      author: review.source,
      rating: review.rating,
      text: review.body,
      date: review.date,
      source_image: review.source_image,
      date_utc: review.date_utc,
    }));
  // Transform competitors from API data
  const competitors = (reportData.top20Competitors?.competitors || [])
    .slice(0, 10)
    .map((competitor) => ({
      rank: competitor?.position || 0,
      businessName: competitor?.name || "",
      rating: competitor?.averageRating || 0,
      reviewCount: competitor?.reviewCount || 0,
      category: competitor?.category || "",
      distance: competitor?.isYourBusiness
        ? "0.0 mi"
        : `${((competitor?.position || 0) * 0.2).toFixed(1)} mi`,
    }));
  // Transform business hours from API data
  const businessHours = (
    reportData.communication?.businessHours?.per_day || []
  ).map((day) => ({
    day: day.name,
    hours: day.value,
    isToday: new Date().getDay() === day.day_number,
  }));
  const socialPlatforms = [
    {
      name: t("fb"),
      connected: true,
      followers: 2450,
    },
    {
      name: t("insta"),
      connected: true,
      followers: 1890,
    },
    {
      name: t("twiter"),
      connected: false,
    },
    {
      name: t("linkedin"),
      connected: false,
    },
  ];
  // Use branding data from API or fallback to empty object
  const brandingData = brandingResponse?.data || null;

  // Transform posts from API data
  const posts = (reportData.communication?.posts || [])
    .slice(0, 9)
    .map((post) => ({
      id: post.position.toString(),
      image: post.image,
      description: post.body,
      link: post.link,
    }));

  // Transform top 20 competitors data
  const top20CompetitorsData = {
    searchInfo: reportData.top20Competitors.searchInfo,
    yourBusiness: reportData.top20Competitors.yourBusiness,
    competitorStats: {
      totalCompetitors: reportData.top20Competitors?.competitors?.length || 0,
      averageRating:
        (reportData.top20Competitors?.competitors?.reduce(
          (sum, comp) => sum + comp.averageRating,
          0
        ) || 0) / (reportData.top20Competitors?.competitors?.length || 1),
      totalReviews:
        reportData.top20Competitors?.competitors?.reduce(
          (sum, comp) => sum + comp.reviewCount,
          0
        ) || 0,
      yourPosition: reportData.top20Competitors?.yourBusiness?.position || 0,
    },
  };

  // Transform comparison data
  const comparisonData = (reportData.comparison || []).map((business) => ({
    name: business?.name || "",
    category: business?.category || "",
    additionalCategory: business?.additionalCategory || "",
    website: business?.website || "",
    reviewCount: business?.reviewCount || 0,
    rating: business?.rating || 0,
    keywordInName: business?.keywordInName || "",
  }));
  return (
    <PublicReportLayout
      title={transformedReportData.title}
      listingName={transformedReportData.listingName}
      address={transformedReportData.address}
      logo={transformedReportData.logo}
      date={transformedReportData.date}
      brandingData={brandingData}
      reportId={reportId}
      reportType="gmb-health"
    >
      <div className=" mx-auto space-y-6">
        {/* Main Health Score - Large Display */}

        {/* GMB Lead Score Section */}
        <div
          id="overall-section"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <ProgressCard
            title={t("health_score")}
            value={transformedReportData.healthScore.toString()}
            percentage={transformedReportData.healthScore}
            color={
              transformedReportData.healthScore >= 70
                ? "green"
                : transformedReportData.healthScore >= 50
                ? "yellow"
                : "red"
            }
          />
          <ProgressCard
            title={t("review")}
            value={transformedReportData.totalReviews}
            color="blue"
          />
          <ProgressCard
            title={t("post")}
            value={(reportData.communication?.posts?.length || 0).toString()}
            color="blue"
          />
          <ProgressCard
            title={t("average_rating")}
            value={transformedReportData.avgRating}
            color="blue"
          />
        </div>

        {/* Business Details Section */}
        <Card className="hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("business_det")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">{t("business_name")}:</span>{" "}
              {transformedReportData.listingName}
            </div>
            <div>
              <span className="font-medium">{t("address")}:</span>{" "}
              {transformedReportData.address}
            </div>
            <div>
              <span className="font-medium">{t("category")}:</span>{" "}
              {reportData.businessInfo.category}
            </div>
            <div>
              <span className="font-medium">{t("phone_no")}:</span>{" "}
              {reportData.businessInfo.phoneNumber}
            </div>
            <div>
              <span className="font-medium">{t("website")}:</span>{" "}
              {reportData.businessInfo.website}
            </div>
          </CardContent>
        </Card>

        {/* Listing Reputation & GMB Lead Score - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Listing Reputation Section - 8 columns on large screens */}
          <div className="lg:col-span-8 col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>{t("listing_reputation_title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("listing_reputation_description")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {transformedReportData.totalReviews}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("review_count")}
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {transformedReportData.avgRating}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("average_rating")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GMB Lead Score Section - 4 columns on large screens */}
          <div className="lg:col-span-4 col-span-12">
            <Card className="h-full">
              <CardContent className="pt-5 flex flex-col items-center justify-center h-full">
                <h2 className="text-lg font-semibold text-center mb-4">
                  {t("lead_score_title")}
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  <CircularProgress
                    value={transformedReportData.healthScore}
                    size={160}
                    strokeWidth={10}
                    className={
                      transformedReportData.healthScore > 70
                        ? "text-success"
                        : transformedReportData.healthScore > 40
                        ? "text-warning"
                        : "text-destructive"
                    }
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {transformedReportData.healthScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("health_score_label")}
                      </div>
                    </div>
                  </CircularProgress>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Listing Presence */}
        <Card id="presence-section">
          <CardHeader>
            <CardTitle>{t("listing_presence_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              {t("listing_presence_description")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className={`${
                  reportData.businessInfo.businessName
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } border rounded-lg p-4 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 ${
                    reportData.businessInfo.businessName
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Building2
                    className={`h-5 w-5 ${
                      reportData.businessInfo.businessName
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("business_name")}
                  </div>
                  <div className="font-medium">
                    {reportData.businessInfo.businessName || t("missing_name")}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  reportData.businessInfo.phoneNumber
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } border rounded-lg p-4 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 ${
                    reportData.businessInfo.phoneNumber
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Phone
                    className={`h-5 w-5 ${
                      reportData.businessInfo.phoneNumber
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("phone")}
                  </div>
                  <div className="font-medium">
                    {reportData.businessInfo.phoneNumber || t("missing_phone")}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  reportData.businessInfo.category
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } border rounded-lg p-4 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 ${
                    reportData.businessInfo.category
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Users
                    className={`h-5 w-5 ${
                      reportData.businessInfo.category
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("category")}
                  </div>
                  <div className="font-medium">
                    {reportData.businessInfo.category || t("missing_category")}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  reportData.businessInfo.address
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } border rounded-lg p-4 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 ${
                    reportData.businessInfo.address
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg flex items-center justify-center`}
                >
                  <MapPin
                    className={`h-5 w-5 ${
                      reportData.businessInfo.address
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("location")}
                  </div>
                  <div className="font-medium">
                    {reportData.businessInfo.address || t("missing_add")}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  reportData.businessInfo.website
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } border rounded-lg p-4 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 ${
                    reportData.businessInfo.website
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Globe
                    className={`h-5 w-5 ${
                      reportData.businessInfo.website
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("website")}
                  </div>
                  <div className="font-medium">
                    {reportData.businessInfo.website ? (
                      <a
                        href={
                          reportData.businessInfo.website.startsWith("http")
                            ? reportData.businessInfo.website
                            : `https://${reportData.businessInfo.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {reportData.businessInfo.website}
                      </a>
                    ) : (
                      t("missing_web")
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GMB Ranking Factors */}
        <RankingFactorsGrid factors={rankingFactors} />

        {/* Posts On GMB */}
        <div id="post-section">
          <PostsOnGMB posts={posts} />
        </div>

        {/* Route to GMB - Photo Gallery */}
        <PhotoGallery
          photos={photos}
          totalCount={transformedReportData.totalPhotos}
        />

        {/* Call CTA Section */}
        <SingleCTASection reportId={reportId || ""} ctaType="call" />

        {/* Top 20 Competitors Analysis */}
        <div id="competitors-section">
          <Top20CompetitorsCard
            searchInfo={top20CompetitorsData.searchInfo}
            yourBusiness={top20CompetitorsData.yourBusiness}
            competitorStats={top20CompetitorsData.competitorStats}
            comparisonData={comparisonData}
          />
        </div>

        {/* Business Hours */}
        <BusinessHours hours={businessHours} />

        {/* Reviews Section */}
        <div id="reviews-section">
          <ReviewsSection
            reviews={reviews}
            averageRating={transformedReportData.avgRating}
            totalReviews={transformedReportData.totalReviews}
          />
        </div>

        {/* Appointment CTA Section */}
        <SingleCTASection reportId={reportId || ""} ctaType="appointment" />

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>{t("top_categories_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              {t("top_categories_description")}
            </p>

            <div className="space-y-6">
              {(reportData.categories?.topCategory || [])
                .slice(0, 3)
                .map((categoryGroup) => (
                  <div
                    key={categoryGroup?.rank || Math.random()}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {categoryGroup?.rank || 0}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {categoryGroup?.categories?.[0]?.category ||
                          "Unknown Category"}
                      </h3>
                      <p className="text-gray-600">
                        {categoryGroup?.categories?.[0]?.count || 0}{" "}
                        {t("competitor")}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* All Category List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("all_categories_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(reportData.categories?.all || [])
                .slice(0, 10)
                .map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {category?.category || t("unknown")}
                    </div>
                    <div className="text-xs text-gray-600">
                      {category?.count || 0} {t("bus")}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 15 Keywords Used by Competitors */}
        {(reportData as any).top15Keywords &&
          Array.isArray((reportData as any).top15Keywords) &&
          (reportData as any).top15Keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("top_keywords_title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  {t("top_keywords_description")}
                </p>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>{t("keyword")}</TableHead>
                        <TableHead className="text-center">
                          {t("count")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("in_name")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("in_description")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(reportData as any).top15Keywords
                        ?.slice(0, 15)
                        .map((keyword: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {keyword.keyword}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {keyword.count}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {keyword.inName ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {keyword.inDesc ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Recommendations Section */}
        {(reportData as any).recommendations && (
          <Card>
            <CardHeader>
              <CardTitle>{t("recommendations")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* GMB Checklist */}
              {(reportData as any).recommendations?.gmbChecklist &&
                Array.isArray(
                  (reportData as any).recommendations?.gmbChecklist
                ) &&
                ((reportData as any).recommendations?.gmbChecklist?.length ||
                  0) > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      {t("gmb_checklist")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(
                        (reportData as any).recommendations?.gmbChecklist || []
                      ).map((item: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <h4 className="font-semibold text-green-800 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-green-700 text-sm">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Quick Hacks */}
              {(reportData as any).recommendations?.quickHack &&
                Array.isArray((reportData as any).recommendations?.quickHack) &&
                ((reportData as any).recommendations?.quickHack?.length || 0) >
                  0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-yellow-600" />
                      {t("quick_hacks")}
                    </h3>
                    <div className="space-y-3">
                      {(
                        (reportData as any).recommendations?.quickHack || []
                      ).map((hack: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <p className="text-yellow-800">{hack}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </PublicReportLayout>
  );
};

export default GmbHealthReport;
