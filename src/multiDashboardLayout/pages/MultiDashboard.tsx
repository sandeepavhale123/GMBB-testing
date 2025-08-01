import React, { useState } from 'react';
import { Search, Filter, BarChart3, MapPin, TrendingUp, AlertTriangle, Star, Eye, Phone, ExternalLink, Grid3X3, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
export const MultiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardType, setDashboardType] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const metricsCards = [{
    title: 'Total Listings',
    value: '20',
    subtitle: 'of 100 selected',
    trend: '+2 this month',
    icon: MapPin,
    bgColor: 'bg-blue-100',
    iconBgColor: 'bg-blue-500',
    textColor: 'text-gray-900'
  }, {
    title: 'Avg. Health Score',
    value: '76%',
    subtitle: '↑ 8% from last month',
    trend: 'Improving',
    icon: TrendingUp,
    bgColor: 'bg-green-100',
    iconBgColor: 'bg-green-500',
    textColor: 'text-gray-900'
  }, {
    title: 'Critical Issues',
    value: '3',
    subtitle: 'Require attention',
    trend: '-2 resolved',
    icon: AlertTriangle,
    bgColor: 'bg-red-100',
    iconBgColor: 'bg-red-500',
    textColor: 'text-gray-900'
  }, {
    title: 'Avg. Rating',
    value: '4.2',
    subtitle: 'Across all listings',
    trend: '↑ 0.3 points',
    icon: Star,
    bgColor: 'bg-yellow-100',
    iconBgColor: 'bg-yellow-500',
    textColor: 'text-gray-900'
  }];
  const listings = [{
    id: 'GMB1234567',
    name: 'Downtown Dental Care',
    category: 'Healthcare',
    location: 'New York, NY',
    healthScore: 85,
    status: 'Excellent',
    views: '1.2K',
    calls: '45',
    statusColor: 'text-green-600'
  }, {
    id: 'GMB2345678',
    name: 'Pizza Palace',
    category: 'Restaurant',
    location: 'Brooklyn, NY',
    healthScore: 72,
    status: 'Good',
    views: '890',
    calls: '23',
    statusColor: 'text-blue-600'
  }, {
    id: 'GMB3456789',
    name: 'Auto Repair Shop',
    category: 'Automotive',
    location: 'Queens, NY',
    healthScore: 45,
    status: 'Poor',
    views: '567',
    calls: '12',
    statusColor: 'text-red-600'
  }, {
    id: 'GMB4567890',
    name: 'Fashion Boutique',
    category: 'Retail',
    location: 'Manhattan, NY',
    healthScore: 78,
    status: 'Good',
    views: '1.5K',
    calls: '67',
    statusColor: 'text-blue-600'
  }, {
    id: 'GMB5678901',
    name: 'Coffee Corner',
    category: 'Food & Drink',
    location: 'Bronx, NY',
    healthScore: 92,
    status: 'Excellent',
    views: '2.1K',
    calls: '89',
    statusColor: 'text-green-600'
  }, {
    id: 'GMB6789012',
    name: 'Fitness Center',
    category: 'Health & Fitness',
    location: 'Staten Island, NY',
    healthScore: 67,
    status: 'Good',
    views: '743',
    calls: '34',
    statusColor: 'text-blue-600'
  }];
  return <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsCards.map((metric, index) => {
        const Icon = metric.icon;
        return <div key={index} className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-500">{metric.subtitle}</div>
                  <div className="text-xs text-gray-400 mt-2">{metric.trend}</div>
                </div>
                <div className={`${metric.iconBgColor} rounded-lg p-3 flex items-center justify-center ml-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>;
      })}
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input placeholder="Search listings by name, location, or category..." className="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Health Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Health Scores</SelectItem>
                  <SelectItem value="excellent">Excellent (80+)</SelectItem>
                  <SelectItem value="good">Good (60-79)</SelectItem>
                  <SelectItem value="poor">Poor (0-59)</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="brooklyn">Brooklyn</SelectItem>
                  <SelectItem value="queens">Queens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
        </div>

        {/* GMB Listings */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold">GMB Listings</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Select value={dashboardType} onValueChange={setDashboardType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Dashboard Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default dashboard</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="insight">Insight</SelectItem>
                  <SelectItem value="group">Group dashboard</SelectItem>
                  <SelectItem value="listing">Listing dashboard</SelectItem>
                  <SelectItem value="post">Post dashboard</SelectItem>
                  <SelectItem value="adv-posts">Adv.posts</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup type="single" value={viewMode} onValueChange={value => value && setViewMode(value)}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          {viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(listing => <div key={listing.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{listing.name}</h4>
                      <p className="text-sm text-muted-foreground">{listing.id}</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                        {listing.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Health Score:</span>
                      <span className={`font-semibold ${listing.statusColor}`}>
                        {listing.healthScore}% {listing.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{listing.views}</span>
                        <span className="text-xs">Total Views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{listing.calls}</span>
                        <span className="text-xs">Calls</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-muted rounded flex items-center px-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground ml-1">Trend</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/location-dashboard/${listing.id}`)}>
                      <span className="mr-2">View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>)}
            </div> : <div className="space-y-3">
              {listings.map(listing => <div key={listing.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-foreground">{listing.name}</h4>
                          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                            {listing.category}
                          </span>
                        </div>
                        
                      </div>
                      <p className="text-sm text-muted-foreground">{listing.id}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{listing.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{listing.calls}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Health:</span>
                        <span className={`font-semibold ${listing.statusColor}`}>
                          {listing.healthScore}%
                        </span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/location-dashboard/${listing.id}`)}>
                        View Details
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
};