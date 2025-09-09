import React from "react";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, MapPin, Phone, Globe, Users } from "lucide-react";
import { ProgressCard } from "../components/ProgressCard";
import { RankingFactorsGrid } from "../components/RankingFactorsGrid";
import { PostsOnGMB } from "../components/PostsOnGMB";
import { PhotoGallery } from "../components/PhotoGallery";
import { ReviewsSection } from "../components/ReviewsSection";
import { CompetitorTable } from "../components/CompetitorTable";
import { BusinessHours } from "../components/BusinessHours";
import { CTASection } from "../components/CTASection";

import { PieChart, Pie, Tooltip } from "recharts";
export const GmbHealthReport: React.FC = () => {
  // Comprehensive mock data - replace with actual data fetching
  const reportData = {
    title: "GMB Health Report",
    listingName: "Bella Vista Restaurant & Bar",
    address: "123 Main Street, Downtown, CA 90210",
    logo: "",
    date: "January 15, 2025",
    healthScore: 85,
    leadScore: 1224,
    avgRating: 4.9,
    totalReviews: 847,
    totalPhotos: 156,
    responseRate: 92,
    listingViews: 15420,
    webClicks: 892,
    phoneClicks: 234,
    directionRequests: 1560
  };
  const rankingFactors = [{
    id: "3",
    label: "Phone Number",
    status: "good" as const,
    description: "This represents your primary business phone number",
    icon: "phone"
  }, {
    id: "4", 
    label: "Business Website",
    status: "good" as const,
    description: "Having a website for your business enables potential customers to ...",
    icon: "globe"
  }, {
    id: "5",
    label: "Business Hours",
    status: "good" as const,
    description: "Provide your regular customer-facing hours of operation.",
    icon: "clock"
  }, {
    id: "6",
    label: "Business Description", 
    status: "good" as const,
    description: "This represents your primary business phone number",
    icon: "file-text"
  }, {
    id: "7",
    label: "Category",
    status: "good" as const,
    description: "Categories are used to describe your business.",
    icon: "tag"
  }, {
    id: "9",
    label: "Photos",
    status: "needs-work" as const,
    description: "Having a website for your business enables potential customers",
    icon: "camera"
  }];
  const photos = [{
    id: "1",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=300&fit=crop",
    alt: "Restaurant interior",
    category: "Interior"
  }, {
    id: "2",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
    alt: "Signature dish",
    category: "Food"
  }, {
    id: "3",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop",
    alt: "Bar area",
    category: "Interior"
  }, {
    id: "4",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop",
    alt: "Outdoor seating",
    category: "Exterior"
  }, {
    id: "5",
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop",
    alt: "Chef special",
    category: "Food"
  }, {
    id: "6",
    url: "https://images.unsplash.com/photo-1510626176543-5745bbc17d40?w=300&h=300&fit=crop",
    alt: "Wine selection",
    category: "Drinks"
  }];
  const reviews = [{
    id: "1",
    author: "Sarah Johnson",
    rating: 5,
    text: "Amazing food and excellent service! The atmosphere is perfect for a romantic dinner.",
    date: "2 days ago",
    platform: "Google"
  }, {
    id: "2",
    author: "Mike Chen",
    rating: 4,
    text: "Great pasta dishes and friendly staff. Will definitely come back!",
    date: "1 week ago",
    platform: "Yelp"
  }, {
    id: "3",
    author: "Emily Rodriguez",
    rating: 5,
    text: "Best Italian restaurant in the area. The wine selection is outstanding.",
    date: "2 weeks ago",
    platform: "Google"
  }];
  const competitors = [{
    rank: 1,
    businessName: "Bella Vista Restaurant & Bar",
    rating: 4.9,
    reviewCount: 847,
    category: "Italian Restaurant",
    distance: "0.0 mi"
  }, {
    rank: 2,
    businessName: "Mario's Trattoria",
    rating: 4.7,
    reviewCount: 623,
    category: "Italian Restaurant",
    distance: "0.3 mi"
  }, {
    rank: 3,
    businessName: "Giuseppe's Kitchen",
    rating: 4.6,
    reviewCount: 456,
    category: "Italian Restaurant",
    distance: "0.5 mi"
  }, {
    rank: 4,
    businessName: "Nonna's Place",
    rating: 4.5,
    reviewCount: 389,
    category: "Italian Restaurant",
    distance: "0.7 mi"
  }, {
    rank: 5,
    businessName: "Tony's Bistro",
    rating: 4.4,
    reviewCount: 234,
    category: "Italian Restaurant",
    distance: "0.8 mi"
  }, {
    rank: 6,
    businessName: "Casa Italia",
    rating: 4.3,
    reviewCount: 567,
    category: "Italian Restaurant",
    distance: "1.0 mi"
  }, {
    rank: 7,
    businessName: "Villa Romano",
    rating: 4.2,
    reviewCount: 345,
    category: "Italian Restaurant",
    distance: "1.2 mi"
  }, {
    rank: 8,
    businessName: "Pasta Palace",
    rating: 4.1,
    reviewCount: 189,
    category: "Italian Restaurant",
    distance: "1.3 mi"
  }, {
    rank: 9,
    businessName: "Little Italy",
    rating: 4.0,
    reviewCount: 267,
    category: "Italian Restaurant",
    distance: "1.5 mi"
  }, {
    rank: 10,
    businessName: "Roma Restaurant",
    rating: 3.9,
    reviewCount: 156,
    category: "Italian Restaurant",
    distance: "1.7 mi"
  }];
  const businessHours = [{
    day: "Monday",
    hours: "11:00 AM - 10:00 PM"
  }, {
    day: "Tuesday",
    hours: "11:00 AM - 10:00 PM",
    isToday: true
  }, {
    day: "Wednesday",
    hours: "11:00 AM - 10:00 PM"
  }, {
    day: "Thursday",
    hours: "11:00 AM - 10:00 PM"
  }, {
    day: "Friday",
    hours: "11:00 AM - 11:00 PM"
  }, {
    day: "Saturday",
    hours: "10:00 AM - 11:00 PM"
  }, {
    day: "Sunday",
    hours: "10:00 AM - 9:00 PM"
  }];
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
  const brandingData = {
    company_name: "Digital Marketing Solutions",
    company_logo: "",
    company_website: "www.digitalmarketing.com",
    company_email: "contact@digitalmarketing.com",
    company_phone: "(555) 123-4567",
    company_address: "456 Business Ave, Marketing City, MC 67890"
  };
  return <PublicReportLayout title={reportData.title} listingName={reportData.listingName} address={reportData.address} logo={reportData.logo} date={reportData.date} brandingData={brandingData}>
      <div className="space-y-6">
        {/* Main Health Score - Large Display */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          
        </Card>

        {/* GMB Lead Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard title="GMB Health Score" value="45" percentage={45} color="red" />
          <ProgressCard title="GMB Review" value={reportData.totalReviews} color="blue" />
          <ProgressCard title="GMB Post" value="2551" color="blue" />
          <ProgressCard title="GMB Average Rating" value={reportData.avgRating} color="blue" />
        </div>

        {/* Business Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="font-medium">Business Name:</span> {reportData.listingName}</div>
            <div><span className="font-medium">Address:</span> {reportData.address}</div>
            <div><span className="font-medium">Category:</span> Italian Restaurant</div>
            <div><span className="font-medium">Phone number:</span> +1 (555) 123-4567</div>
            <div><span className="font-medium">Website:</span> https://bellavista.com/</div>
          </CardContent>
        </Card>

        {/* GMB Lead Score Detailed Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">GMB Lead Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="text-sm text-red-500 font-medium mb-1">GMB Lead Score</div>
                  <div className="text-3xl font-bold text-red-500">45%</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="text-sm text-green-500 font-medium mb-1">No. Of Reviews</div>
                  <div className="text-3xl font-bold text-green-500">{reportData.totalReviews}</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="text-sm text-blue-500 font-medium mb-1">GMB Average Rating</div>
                  <div className="text-3xl font-bold text-blue-500">{reportData.avgRating}</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <PieChart width={192} height={192}>
                    <Pie
                      data={[
                        { name: 'GMB Leads', value: 45, fill: '#ef4444' },
                        { name: 'Reviews', value: reportData.totalReviews, fill: '#22c55e' },
                        { name: 'Average Rating', value: Number(reportData.avgRating) * 100, fill: '#3b82f6' }
                      ]}
                      cx={96}
                      cy={96}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'Average Rating' ? `${(Number(value) / 100).toFixed(1)}` : value,
                        name
                      ]}
                    />
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold">Lead Score</div>
                      <div className="text-sm text-muted-foreground">Distribution</div>
                    </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.listingViews}</div>
                <div className="text-sm text-muted-foreground">Listing Views</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.webClicks}</div>
                <div className="text-sm text-muted-foreground">Website Clicks</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{reportData.phoneClicks}</div>
                <div className="text-sm text-muted-foreground">Phone Calls</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.directionRequests}</div>
                <div className="text-sm text-muted-foreground">Direction Requests</div>
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Business Name</div>
                  <div className="font-medium">{reportData.listingName}</div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone No</div>
                  <div className="font-medium">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{reportData.address}</div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Website</div>
                  <div className="font-medium">https://bellavista.com/</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GMB Ranking Factors */}
        <RankingFactorsGrid factors={rankingFactors} />

        {/* Posts On GMB */}
        <PostsOnGMB posts={[
          {
            id: "1",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
            description: "Come out the this customers home and upgraded some plumbing fixtures around their home!"
          },
          {
            id: "2", 
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
            description: "Come out the this customers home and upgraded some plumbing fixtures around their home!"
          },
          {
            id: "3",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop", 
            description: "Come out the this customers home and upgraded some plumbing fixtures around their home!"
          }
        ]} />

        {/* Route to GMB - Photo Gallery */}
        <PhotoGallery photos={photos} totalCount={reportData.totalPhotos} />

        {/* Business Hours */}
        <BusinessHours hours={businessHours} />


        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} averageRating={reportData.avgRating} totalReviews={reportData.totalReviews} />

        {/* Top 10 Competitors */}
        <CompetitorTable competitors={competitors} />

        {/* CTA Section */}
        <CTASection />

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">1. Primary Category</span>
                  <span className="text-green-600 font-semibold">Complete</span>
                </div>
                <p className="text-sm text-muted-foreground">Italian Restaurant</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">2. Secondary Categories</span>
                  <span className="text-yellow-600 font-semibold">Partial</span>
                </div>
                <p className="text-sm text-muted-foreground">Bar, Wine Bar (Add: Pizza Restaurant)</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">3. Service Areas</span>
                  <span className="text-green-600 font-semibold">Complete</span>
                </div>
                <p className="text-sm text-muted-foreground">Downtown, Beverly Hills, Santa Monica</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">4. Attributes</span>
                  <span className="text-red-600 font-semibold">Needs Work</span>
                </div>
                <p className="text-sm text-muted-foreground">Add: Outdoor Seating, Delivery, Takeout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary of Recommendations */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Summary of Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-red-700">Add Missing Holiday Hours</h4>
                  <p className="text-sm text-red-600">Complete your holiday schedule to avoid customer confusion</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-orange-700">Expand Business Attributes</h4>
                  <p className="text-sm text-orange-600">Add amenities like outdoor seating, delivery options, and accessibility features</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-blue-700">Connect Social Media</h4>
                  <p className="text-sm text-blue-600">Link Twitter and LinkedIn profiles to improve online presence</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-green-700">Maintain Photo Activity</h4>
                  <p className="text-sm text-green-600">Continue uploading photos regularly - you're doing great!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>;
};