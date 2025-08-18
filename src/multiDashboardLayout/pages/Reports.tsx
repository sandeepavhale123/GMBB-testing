import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { FileText, TrendingUp, BarChart3, PieChart, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  
  const quickStats = [{
    icon: FileText,
    label: 'Total Reports',
    value: '24',
    color: 'text-blue-600'
  }, {
    icon: TrendingUp,
    label: 'This Month',
    value: '8',
    color: 'text-green-600'
  }, {
    icon: BarChart3,
    label: 'Pending',
    value: '3',
    color: 'text-yellow-600'
  }, {
    icon: PieChart,
    label: 'Completed',
    value: '21',
    color: 'text-purple-600'
  }];
  
  const projectData = [{
    id: 1,
    projectName: 'Luxury Hotel Chain Analysis',
    locations: 12,
    scheduledStatus: 'Monthly',
    lastUpdate: new Date('2024-01-15'),
    nextUpdate: new Date('2024-02-15')
  }, {
    id: 2,
    projectName: 'Boutique Restaurant Reviews',
    locations: 8,
    scheduledStatus: 'Weekly',
    lastUpdate: new Date('2024-01-14'),
    nextUpdate: new Date('2024-01-21')
  }, {
    id: 3,
    projectName: 'Resort Media Optimization',
    locations: 5,
    scheduledStatus: 'ONE TIME',
    lastUpdate: new Date('2024-01-13'),
    nextUpdate: null
  }, {
    id: 4,
    projectName: 'Urban Property Performance',
    locations: 15,
    scheduledStatus: 'Monthly',
    lastUpdate: new Date('2024-01-10'),
    nextUpdate: new Date('2024-02-10')
  }];

  const getScheduleBadgeVariant = (status: string) => {
    switch (status) {
      case 'ONE TIME':
        return 'secondary';
      case 'Weekly':
        return 'default';
      case 'Monthly':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage reports across multiple listings
          </p>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate('/main-dashboard/generate-bulk-report')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      

      {/* Projects Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Project Management</h2>
        </div>
        <div className="p-0">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left font-semibold">Project Name</TableHead>
                  <TableHead className="text-center font-semibold">Scheduled Status</TableHead>
                  <TableHead className="text-center font-semibold">Last Update</TableHead>
                  <TableHead className="text-center font-semibold">Next Update</TableHead>
                  <TableHead className="text-center font-semibold w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectData.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    <TableCell className="font-semibold text-foreground">
                      <div>
                        <div className="font-bold">{project.projectName}</div>
                        <div className="text-sm text-muted-foreground">{project.locations} locations</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getScheduleBadgeVariant(project.scheduledStatus)}>
                        {project.scheduledStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {format(project.lastUpdate, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {project.nextUpdate ? format(project.nextUpdate, 'dd MMM yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View project</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit project</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete project</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </div>
    </div>;
};