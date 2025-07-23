import React, { useState } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const CitationTrackerCard = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg">Citation Tracker</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <div className="flex-1">
        <div className="relative w-32 h-32 mx-auto">
          {/* Donut Chart */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="40"
              stroke="hsl(var(--primary))"
              strokeWidth="16"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset="0"
              className="opacity-90"
            />
            <circle
              cx="60"
              cy="60"
              r="25"
              fill="white"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          </svg>
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
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-200 text-blue-800 rounded text-sm">
          <span>Not Listed</span>
          <span className="font-semibold">100</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

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
  { siteName: "Directory A", action: "Submit" },
  { siteName: "Directory B", action: "Submit" },
  { siteName: "Directory C", action: "Submit" },
  { siteName: "Directory D", action: "Submit" },
  { siteName: "Directory E", action: "Submit" },
];

export const CitationPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Citation Management</h1>
                <p className="text-muted-foreground">Monitor and manage your business citations across directories</p>
              </div>
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
                <Button variant="default">Place Order</Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="existing" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
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
                            <TableCell>
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
          </div>
        </div>
      </div>
    </div>
  );
};