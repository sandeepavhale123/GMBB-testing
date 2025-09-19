import React from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Star, MapPin, Phone, Globe, Users, Loader2, Check, X, CheckCircle, Lightbulb , Building2  } from "lucide-react";
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
export const GmbHealthReport: React.FC = () => {
  const {
    reportId
  } = useParams<{
    reportId: string;
  }>();
  const {
    data: apiResponse,
    isLoading,
    error
  } = useGetGmbHealthReport(reportId || '');
  const {
    data: brandingResponse
  } = useGetLeadReportBranding(reportId || '');
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading GMB Health Report...</p>
        </div>
      </div>;
  }
  if (error || !apiResponse?.data) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading report</p>
          <p className="text-muted-foreground">Please check the report ID and try again.</p>
        </div>
      </div>;
  }
  const reportData = apiResponse.data;
  // Transform API data
  const transformedReportData = {
    title: "GMB Health Report",
    listingName: reportData.businessInfo.businessName,
    address: reportData.businessInfo.address,
    logo: "",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    healthScore: parseInt(reportData.healthScore),
    leadScore: parseInt(reportData.healthScore),
    avgRating: parseFloat(reportData.reviewRating),
    totalReviews: parseInt(reportData.reviewCount),
    totalPhotos: (reportData.communication?.photos?.length || 0),
    responseRate: 92,
    listingViews: 15420,
    webClicks: 892,
    phoneClicks: 234,
    directionRequests: 1560
  };
  // Transform ranking factors based on API data
  const rankingFactors = [{
    id: "3",
    label: "Phone Number",
    status: reportData.businessInfo.phoneNumber ? "good" as const : "needs-work" as const,
    description: "This represents your primary business phone number.",
    icon: "phone"
  }, {
    id: "4",
    label: "Business Website",
    status: reportData.businessInfo.website ? "good" as const : "needs-work" as const,
    description: "Having a website for your business enables potential customers to find more information about your services.",
    icon: "globe"
  }, {
    id: "5",
    label: "Business Hours",
    status: ((reportData.communication?.businessHours?.per_day?.length || 0) > 0 ? "good" as const : "needs-work" as const),
    description: "Provide your regular customer-facing hours of operation.",
    icon: "clock"
  }, {
    id: "6",
    label: "Business Description",
    status: "good" as const,
    description: "Business description helps customers understand your services.",
    icon: "file-text"
  }, {
    id: "7",
    label: "Category",
    status: reportData.businessInfo.category ? "good" as const : "needs-work" as const,
    description: "Categories are used to describe your business.",
    icon: "tag"
  }, {
    id: "9",
    label: "Photos",
    status: ((reportData.communication?.photos?.length || 0) > 5 ? "good" as const : "needs-work" as const),
    description: "Photos help customers visualize your business and services.",
    icon: "camera"
  }];
  // Transform photos from API data
  const photos = (reportData.communication?.photos || []).map((photo, index) => ({
    id: (index + 1).toString(),
    url: photo.image,
    alt: `Business photo ${index + 1}`,
    category: "Business"
  }));
  // Transform reviews from API data
  const reviews = (reportData.listingReputation?.reviews || []).slice(0, 10).map((review, index) => ({
    id: review.id,
    author: review.source,
    rating: review.rating,
    text: review.body,
    date: review.date,
    source_image: review.source_image,
    date_utc: review.date_utc
  }));
  // Transform competitors from API data
  const competitors = (reportData.top20Competitors?.competitors || []).slice(0, 10).map(competitor => ({
    rank: competitor?.position || 0,
    businessName: competitor?.name || '',
    rating: competitor?.averageRating || 0,
    reviewCount: competitor?.reviewCount || 0,
    category: competitor?.category || '',
    distance: competitor?.isYourBusiness ? "0.0 mi" : `${((competitor?.position || 0) * 0.2).toFixed(1)} mi`
  }));
  // Transform business hours from API data
  const businessHours = (reportData.communication?.businessHours?.per_day || []).map(day => ({
    day: day.name,
    hours: day.value,
    isToday: new Date().getDay() === day.day_number
  }));
  const socialPlatforms = [{
    name: "Facebook",
    connected: true,
    followers: 2450
  }, {
    name: "Instagram",
    connected: true,
    followers: 1890
  }, {
    name: "Twitter",
    connected: false
  }, {
    name: "LinkedIn",
    connected: false
  }];
  // Use branding data from API or fallback to empty object
  const brandingData = brandingResponse?.data || null;

  // Transform posts from API data
  const posts = (reportData.communication?.posts || []).slice(0, 3).map(post => ({
    id: post.position.toString(),
    image: post.image,
    description: post.body,
    link: post.link
  }));

  // Transform top 20 competitors data
  const top20CompetitorsData = {
    searchInfo: reportData.top20Competitors.searchInfo,
    yourBusiness: reportData.top20Competitors.yourBusiness,
    competitorStats: {
      totalCompetitors: (reportData.top20Competitors?.competitors?.length || 0),
      averageRating: ((reportData.top20Competitors?.competitors?.reduce((sum, comp) => sum + comp.averageRating, 0) || 0) / (reportData.top20Competitors?.competitors?.length || 1)),
      totalReviews: (reportData.top20Competitors?.competitors?.reduce((sum, comp) => sum + comp.reviewCount, 0) || 0),
      yourPosition: (reportData.top20Competitors?.yourBusiness?.position || 0)
    }
  };

  // Transform comparison data
  const comparisonData = (reportData.comparison || []).map(business => ({
    name: business?.name || '',
    category: business?.category || '',
    additionalCategory: business?.additionalCategory || '',
    website: business?.website || '',
    reviewCount: business?.reviewCount || 0,
    rating: business?.rating || 0,
    keywordInName: business?.keywordInName || ''
  }));
  return <PublicReportLayout 
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
        <div id="overall-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard title="GMB Health Score" value={transformedReportData.healthScore.toString()} percentage={transformedReportData.healthScore} color={transformedReportData.healthScore >= 70 ? "green" : transformedReportData.healthScore >= 50 ? "yellow" : "red"} />
          <ProgressCard title="GMB Review" value={transformedReportData.totalReviews} color="blue" />
          <ProgressCard title="GMB Post" value={(reportData.communication?.posts?.length || 0).toString()} color="blue" />
          <ProgressCard title="GMB Average Rating" value={transformedReportData.avgRating} color="blue" />
        </div>

        {/* Business Details Section */}
        <Card className="hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="font-medium">Business Name:</span> {transformedReportData.listingName}</div>
            <div><span className="font-medium">Address:</span> {transformedReportData.address}</div>
            <div><span className="font-medium">Category:</span> {reportData.businessInfo.category}</div>
            <div><span className="font-medium">Phone number:</span> {reportData.businessInfo.phoneNumber}</div>
            <div><span className="font-medium">Website:</span> {reportData.businessInfo.website}</div>
          </CardContent>
        </Card>

        {/* Listing Reputation & GMB Lead Score - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Listing Reputation Section - 8 columns on large screens */}
          <div className="lg:col-span-8 col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Listing Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Google reviews are important because they provide potential customers with insights and feedback from other customers, which can influence their decision to use your business. They also improve your visibility and search ranking on Google.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{transformedReportData.totalReviews}</div>
                    <div className="text-sm text-muted-foreground">Review Count</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{transformedReportData.avgRating}</div>
                    <div className="text-sm text-muted-foreground">GMB Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GMB Lead Score Section - 4 columns on large screens */}
          <div className="lg:col-span-4 col-span-12">
            <Card className="h-full">
              <CardContent className="pt-5 flex flex-col items-center justify-center h-full">
                <h2 className="text-lg font-semibold text-center mb-4">GMB Lead Score</h2>
                <div className="flex flex-col items-center space-y-4">
                  <CircularProgress value={transformedReportData.healthScore} size={160} strokeWidth={10} className={transformedReportData.healthScore > 70 ? 'text-success' : transformedReportData.healthScore > 40 ? 'text-warning' : 'text-destructive'}>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{transformedReportData.healthScore}%</div>
                      <div className="text-sm text-muted-foreground">Health Score</div>
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
            <CardTitle>Listing Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Your Google Business Profile emerges precisely when people are seeking your business or similar ones on Google Search or Maps. With Google Business Profile, managing and enhancing your Business Profile is simple, enabling you to distinguish yourself and attract more customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`${reportData.businessInfo.businessName ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${reportData.businessInfo.businessName ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <Building2 className={`h-5 w-5 ${reportData.businessInfo.businessName ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Business Name</div>
                  <div className="font-medium">{reportData.businessInfo.businessName || 'Business name is missing'}</div>
                </div>
              </div>
              <div className={`${reportData.businessInfo.phoneNumber ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${reportData.businessInfo.phoneNumber ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <Phone className={`h-5 w-5 ${reportData.businessInfo.phoneNumber ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone No</div>
                  <div className="font-medium">{reportData.businessInfo.phoneNumber || 'Phone number is missing'}</div>
                </div>
              </div>
              <div className={`${reportData.businessInfo.category ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${reportData.businessInfo.category ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <Users className={`h-5 w-5 ${reportData.businessInfo.category ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-medium">{reportData.businessInfo.category || 'Category is missing'}</div>
                </div>
              </div>
              <div className={`${reportData.businessInfo.address ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${reportData.businessInfo.address ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <MapPin className={`h-5 w-5 ${reportData.businessInfo.address ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{reportData.businessInfo.address || 'Address is missing'}</div>
                </div>
              </div>
              <div className={`${reportData.businessInfo.website ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${reportData.businessInfo.website ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <Globe className={`h-5 w-5 ${reportData.businessInfo.website ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Website</div>
                  <div className="font-medium">
                    {reportData.businessInfo.website ? (
                      <a 
                        href={reportData.businessInfo.website.startsWith('http') ? reportData.businessInfo.website : `https://${reportData.businessInfo.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {reportData.businessInfo.website}
                      </a>
                    ) : (
                      'Website is missing'
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
        <PhotoGallery photos={photos} totalCount={transformedReportData.totalPhotos} />

        {/* Call CTA Section */}
        <SingleCTASection reportId={reportId || ''} ctaType="call" />

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
          <ReviewsSection reviews={reviews} averageRating={transformedReportData.avgRating} totalReviews={transformedReportData.totalReviews} />
        </div>


        {/* Appointment CTA Section */}
        <SingleCTASection reportId={reportId || ''} ctaType="appointment" />


        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>The top 3 categories used by competitors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              We found the following twenty businesses on the map that complicate your business. By analyzing and using this data, 
              you can increase the chances of your business appearing higher on Google's search results and attracting more 
              customers.
            </p>
            
            <div className="space-y-6">
              {(reportData.categories?.topCategory || []).slice(0, 3).map(categoryGroup => <div key={categoryGroup?.rank || Math.random()} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {categoryGroup?.rank || 0}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {categoryGroup?.categories?.[0]?.category || 'Unknown Category'}
                    </h3>
                    <p className="text-gray-600">
                      {categoryGroup?.categories?.[0]?.count || 0} of competitors are utilizing this category.
                    </p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* All Category List */}
        <Card>
          <CardHeader>
            <CardTitle>All Category List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(reportData.categories?.all || []).slice(0, 10).map((category, index) => <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-900">{category?.category || 'Unknown Category'}</div>
                  <div className="text-xs text-gray-600">{category?.count || 0} businesses</div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Top 15 Keywords Used by Competitors */}
        {(reportData as any).top15Keywords && Array.isArray((reportData as any).top15Keywords) && (reportData as any).top15Keywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>The top 15 keywords used by competitors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                These are the most common keywords found in competitor business names and descriptions. 
                Understanding these keywords can help you optimize your business profile to improve visibility.
              </p>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-center">Count</TableHead>
                      <TableHead className="text-center">In Name</TableHead>
                      <TableHead className="text-center">In Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(reportData as any).top15Keywords?.slice(0, 15).map((keyword: any, index: number) => (
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
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* GMB Checklist */}
              {(reportData as any).recommendations?.gmbChecklist && Array.isArray((reportData as any).recommendations?.gmbChecklist) && (((reportData as any).recommendations?.gmbChecklist?.length || 0) > 0) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    GMB Checklist
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((reportData as any).recommendations?.gmbChecklist || []).map((item: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <h4 className="font-semibold text-green-800 mb-2">{item.title}</h4>
                        <p className="text-green-700 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Hacks */}
              {(reportData as any).recommendations?.quickHack && Array.isArray((reportData as any).recommendations?.quickHack) && (((reportData as any).recommendations?.quickHack?.length || 0) > 0) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                    Quick Hacks
                  </h3>
                  <div className="space-y-3">
                    {((reportData as any).recommendations?.quickHack || []).map((hack: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
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
    </PublicReportLayout>;
};