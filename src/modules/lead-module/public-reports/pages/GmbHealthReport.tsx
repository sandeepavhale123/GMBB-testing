import React from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, MapPin, Phone, Globe, Users, Loader2 } from "lucide-react";
import { ProgressCard } from "../components/ProgressCard";
import { RankingFactorsGrid } from "../components/RankingFactorsGrid";
import { PostsOnGMB } from "../components/PostsOnGMB";
import { PhotoGallery } from "../components/PhotoGallery";
import { ReviewsSection } from "../components/ReviewsSection";
import { CompetitorTable } from "../components/CompetitorTable";
import { BusinessHours } from "../components/BusinessHours";
import { CTASection } from "../components/CTASection";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetGmbHealthReport } from "@/api/leadApi";
import { useGetLeadReportBranding } from "@/hooks/useReportBranding";

export const GmbHealthReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { data: apiResponse, isLoading, error } = useGetGmbHealthReport(reportId || '');
  const { data: brandingResponse } = useGetLeadReportBranding(reportId || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading GMB Health Report...</p>
        </div>
      </div>
    );
  }

  if (error || !apiResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading report</p>
          <p className="text-muted-foreground">Please check the report ID and try again.</p>
        </div>
      </div>
    );
  }

  const reportData = apiResponse.data;
  // Transform API data
  const transformedReportData = {
    title: "GMB Health Report",
    listingName: reportData.businessInfo.businessName,
    address: reportData.businessInfo.address,
    logo: "",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    healthScore: parseInt(reportData.healthScore),
    leadScore: parseInt(reportData.healthScore),
    avgRating: parseFloat(reportData.reviewRating),
    totalReviews: parseInt(reportData.reviewCount),
    totalPhotos: reportData.communication.photos.length,
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
    description: "This represents your primary business phone number",
    icon: "phone"
  }, {
    id: "4",
    label: "Business Website",
    status: reportData.businessInfo.website ? "good" as const : "needs-work" as const,
    description: "Having a website for your business enables potential customers to find more information about your services",
    icon: "globe"
  }, {
    id: "5",
    label: "Business Hours",
    status: reportData.communication.businessHours.per_day.length > 0 ? "good" as const : "needs-work" as const,
    description: "Provide your regular customer-facing hours of operation.",
    icon: "clock"
  }, {
    id: "6",
    label: "Business Description",
    status: "good" as const,
    description: "Business description helps customers understand your services",
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
    status: reportData.communication.photos.length > 5 ? "good" as const : "needs-work" as const,
    description: "Photos help customers visualize your business and services",
    icon: "camera"
  }];
  // Transform photos from API data
  const photos = reportData.communication.photos.map((photo, index) => ({
    id: (index + 1).toString(),
    url: photo.image,
    alt: `Business photo ${index + 1}`,
    category: "Business"
  }));
  // Transform reviews from API data
  const reviews = reportData.listingReputation.reviews.slice(0, 10).map((review, index) => ({
    id: review.id,
    author: review.source,
    rating: review.rating,
    text: review.body,
    date: review.date,
    source_image: review.source_image,
    date_utc: review.date_utc
  }));
  // Transform competitors from API data
  const competitors = reportData.top20Competitors.competitors.slice(0, 10).map((competitor) => ({
    rank: competitor.position,
    businessName: competitor.name,
    rating: competitor.averageRating,
    reviewCount: competitor.reviewCount,
    category: competitor.category,
    distance: competitor.isYourBusiness ? "0.0 mi" : `${(competitor.position * 0.2).toFixed(1)} mi`
  }));
  // Transform business hours from API data
  const businessHours = reportData.communication.businessHours.per_day.map((day) => ({
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
  const posts = reportData.communication.posts.slice(0, 3).map((post) => ({
    id: post.position.toString(),
    image: post.image,
    description: post.body,
    link: post.link
  }));

  return <PublicReportLayout title={transformedReportData.title} listingName={transformedReportData.listingName} address={transformedReportData.address} logo={transformedReportData.logo} date={transformedReportData.date} brandingData={brandingData}>
      <div className="space-y-6">
        {/* Main Health Score - Large Display */}
        

        {/* GMB Lead Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard title="GMB Health Score" value={transformedReportData.healthScore.toString()} percentage={transformedReportData.healthScore} color={transformedReportData.healthScore >= 70 ? "green" : transformedReportData.healthScore >= 50 ? "yellow" : "red"} />
          <ProgressCard title="GMB Review" value={transformedReportData.totalReviews} color="blue" />
          <ProgressCard title="GMB Post" value={reportData.communication.posts.length.toString()} color="blue" />
          <ProgressCard title="GMB Average Rating" value={transformedReportData.avgRating} color="blue" />
        </div>

        {/* Business Details Section */}
        <Card>
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

        {/* GMB Lead Score Detailed Section */}
        <Card>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">GMB Lead Score</h2>
                <div className={`${transformedReportData.healthScore > 50 ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'} rounded-lg p-4`}>
                  <div className={`text-sm ${transformedReportData.healthScore > 50 ? 'text-green-900' : 'text-red-900'} font-medium mb-1`}>GMB Lead Score</div>
                  <div className={`text-3xl font-bold ${transformedReportData.healthScore > 50 ? 'text-green-900' : 'text-red-900'}`}>{transformedReportData.healthScore}%</div>
                </div>
                <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-green-900 font-medium mb-1">No. Of Reviews</div>
                  <div className="text-3xl font-bold text-green-900">{transformedReportData.totalReviews}</div>
                </div>
                <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-900 font-medium mb-1">GMB Average Rating</div>
                  <div className="text-3xl font-bold text-blue-900">{transformedReportData.avgRating}</div>
                </div>
              </div>
              <div className="p-6 flex justify-center items-center">
                <div className="flex flex-col items-center justify-center">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{
                        name: 'GMB Leads',
                        value: transformedReportData.healthScore,
                        fill: '#ef4444'
                      }, {
                        name: 'Reviews',
                        value: transformedReportData.totalReviews,
                        fill: '#22c55e'
                      }, {
                        name: 'Average Rating',
                        value: Number(transformedReportData.avgRating) * 100,
                        fill: '#3b82f6'
                      }]} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value" />
                    <Tooltip formatter={(value, name) => [name === 'Average Rating' ? `${(Number(value) / 100).toFixed(1)}` : value, name]} />
                  </PieChart>
                    </ResponsiveContainer>
                  
                </div>
              </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Listing Reputation */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Reputation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Google reviews are important because they provide potential customers with insights and feedback from other customers, which can influence their decision to use your business. They also improve your visibility and search ranking on Google.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

        {/* Listing Presence */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Your Google Business Profile emerges precisely when people are seeking your business or similar ones on Google Search or Maps. With Google Business Profile, managing and enhancing your Business Profile is simple, enabling you to distinguish yourself and attract more customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${reportData.businessInfo.businessName ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 ${reportData.businessInfo.businessName ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <MapPin className={`h-5 w-5 ${reportData.businessInfo.businessName ? 'text-green-600' : 'text-red-600'}`} />
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
                  <div className="font-medium">{reportData.businessInfo.website || 'Website is missing'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GMB Ranking Factors */}
        <RankingFactorsGrid factors={rankingFactors} />

        {/* Posts On GMB */}
        <PostsOnGMB posts={posts} />

        {/* Route to GMB - Photo Gallery */}
        <PhotoGallery photos={photos} totalCount={transformedReportData.totalPhotos} />

        {/* Business Hours */}
        <BusinessHours hours={businessHours} />


        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} averageRating={transformedReportData.avgRating} totalReviews={transformedReportData.totalReviews} />

        {/* Top 10 Competitors */}
        <CompetitorTable competitors={competitors} />

        {/* CTA Section */}
        <CTASection />


        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>The top 3 category used by competitors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              We found the following twenty businesses on the map that complicate your business. By analyzing and using this data, 
              you can increase the chances of your business appearing higher on Googles search results and attracting more 
              customers.
            </p>
            
            <div className="space-y-6">
              {reportData.categories.topCategory.slice(0, 3).map((categoryGroup) => (
                <div key={categoryGroup.rank} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {categoryGroup.rank}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {categoryGroup.categories[0].category}
                    </h3>
                    <p className="text-gray-600">
                      {categoryGroup.categories[0].count} of competitors are utilizing this category.
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
            <CardTitle>All Category List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {reportData.categories.all.slice(0, 10).map((category, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-900">{category.category}</div>
                  <div className="text-xs text-gray-600">{category.count} businesses</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>;
};