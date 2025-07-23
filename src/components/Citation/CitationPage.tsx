
import React, { useState } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { GooglePlacesInput } from '../ui/google-places-input';
import { Label } from '../ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { PlaceOrderModal } from './PlaceOrderModal';

const CitationTrackerCard = () => {
  const chartData = [
    { name: 'Listed', value: 0, fill: 'hsl(var(--primary))' },
    { name: 'Not Listed', value: 100, fill: 'hsl(var(--muted))' }
  ];

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-col gap-2 ml-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 px-3 py-2 rounded text-sm" 
             style={{ backgroundColor: entry.color + '20', color: entry.color }}>
          <span>{entry.value}</span>
          <span className="font-semibold">{entry.payload.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Citation Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex-1">
          <div className="relative w-32 h-32 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={64}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-muted-foreground">Not Listed</span>
              <span className="text-lg font-semibold">100%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded text-sm">
            <span>Listed</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded text-sm">
            <span>Not Listed</span>
            <span className="font-semibold">100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LocalPagesCard = () => (
  <Card className="h-full">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-primary/20 rounded"></div>
      </div>
      <CardTitle className="text-lg">Local Pages & Directories</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        Your local page and directory score is based on the number of places in which your listing is present, divided by the number of local page and directories we've checked.
      </CardDescription>
    </CardHeader>
  </Card>
);

const existingCitationData = [
  { website: "example1.com", businessName: "Business A", phone: "+1-234-567-8901", you: "Listed" },
  { website: "example2.com", businessName: "Business B", phone: "+1-234-567-8902", you: "Listed" },
  { website: "example3.com", businessName: "Business C", phone: "+1-234-567-8903", you: "Not Listed" },
];

const possibleCitationData = [
  { siteName: "Directory A", action: "Fix" },
  { siteName: "Directory B", action: "Fix" },
  { siteName: "Directory C", action: "Fix" },
  { siteName: "Directory D", action: "Fix" },
  { siteName: "Directory E", action: "Fix" },
];

export const CitationPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchData, setSearchData] = useState({
    businessName: '',
    phone: '',
    city: ''
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePlaceOrder = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar 
        activeTab="citation" 
        onTabChange={() => {}} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {!hasSearched ? (
              // Search Form Screen
              <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Citation Audit Report</CardTitle>
                    <CardDescription>
                      Enter your business details to start the citation audit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Enter business name"
                          value={searchData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={searchData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <GooglePlacesInput
                          id="city"
                          type="text"
                          placeholder="Enter city name"
                          value={searchData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          onPlaceSelect={(place) => {
                            if (place.name) {
                              handleInputChange('city', place.name);
                            }
                          }}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" size="lg">
                        Search
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Citation Management Content
              <>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Citation Management</h1>
                    <p className="text-muted-foreground">Monitor and manage your business citations across directories</p>
                  </div>
                  <Button variant="outline" onClick={() => setHasSearched(false)}>
                    New Search
                  </Button>
                </div>

                {/* Two Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CitationTrackerCard />
                  <LocalPagesCard />
                </div>

                {/* Citation Audit Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Citation Audit</CardTitle>
                    </div>
                    <Button variant="default" onClick={handlePlaceOrder}> className="d-none"
                      Place Order
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="existing" className="w-full">
                      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                        <TabsTrigger value="existing">Existing Citation (10)</TabsTrigger>
                        <TabsTrigger value="possible">Possible Citation (50)</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="existing" className="mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Website</TableHead>
                              <TableHead>Business Name</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>You</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {existingCitationData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{row.website}</TableCell>
                                <TableCell>{row.businessName}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    row.you === 'Listed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {row.you}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="possible" className="mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Site Name</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {possibleCitationData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{row.siteName}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm">
                                    {row.action}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <PlaceOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
