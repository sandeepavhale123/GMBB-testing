import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  RefreshCw, 
  Star,
  MapPin,
  Image,
  MessageSquare,
  FileText,
  BarChart3,
  Zap
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'one-time' | 'recurring';
  priority: 'low' | 'medium' | 'high';
  category: 'seo' | 'content' | 'reviews' | 'insights' | 'listings';
  estimatedTime: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Optimize Business Description',
    description: 'Update your GMB business description with relevant keywords and clear value proposition to improve local search visibility.',
    status: 'pending',
    type: 'one-time',
    priority: 'high',
    category: 'seo',
    estimatedTime: '15 min'
  },
  {
    id: '2',
    title: 'Add Missing Business Hours',
    description: 'Complete your business hours information including holiday hours to improve customer experience and search rankings.',
    status: 'pending',
    type: 'one-time',
    priority: 'medium',
    category: 'listings',
    estimatedTime: '10 min'
  },
  {
    id: '3',
    title: 'Upload High-Quality Photos',
    description: 'Add professional photos of your business exterior, interior, products, and team to increase customer engagement.',
    status: 'in-progress',
    type: 'recurring',
    priority: 'high',
    category: 'content',
    estimatedTime: '30 min'
  },
  {
    id: '4',
    title: 'Respond to Recent Reviews',
    description: 'Reply to 3 recent customer reviews to show engagement and improve your business reputation.',
    status: 'pending',
    type: 'recurring',
    priority: 'high',
    category: 'reviews',
    estimatedTime: '20 min'
  },
  {
    id: '5',
    title: 'Create Weekly Post',
    description: 'Publish a weekly GMB post featuring your latest offers, updates, or seasonal content to boost visibility.',
    status: 'completed',
    type: 'recurring',
    priority: 'medium',
    category: 'content',
    estimatedTime: '25 min'
  },
  {
    id: '6',
    title: 'Monitor Keyword Rankings',
    description: 'Check your local keyword rankings and identify opportunities for improvement in search visibility.',
    status: 'pending',
    type: 'recurring',
    priority: 'medium',
    category: 'insights',
    estimatedTime: '15 min'
  }
];

const statusIcons = {
  pending: Clock,
  'in-progress': PlayCircle,
  completed: CheckCircle
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  seo: BarChart3,
  content: FileText,
  reviews: Star,
  insights: BarChart3,
  listings: MapPin
};

export const AITaskManagerPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeTab, setActiveTab] = useState('all');

  const handleMarkCompleted = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const handleFixTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'in-progress' as const }
        : task
    ));
  };

  const filterTasks = (filter: string) => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'in-progress':
        return tasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'recurring':
        return tasks.filter(task => task.type === 'recurring');
      case 'high-priority':
        return tasks.filter(task => task.priority === 'high');
      default:
        return tasks;
    }
  };

  const filteredTasks = filterTasks(activeTab);

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const StatusIcon = statusIcons[task.status];
    const CategoryIcon = categoryIcons[task.category];

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CategoryIcon className="w-5 h-5 text-gray-600 shrink-0" />
              <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={priorityColors[task.priority]} variant="outline">
                {task.priority}
              </Badge>
              {task.type === 'recurring' && (
                <RefreshCw className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {task.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={statusColors[task.status]} variant="outline">
                <StatusIcon className="w-3 h-3 mr-1" />
                {task.status.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-gray-500">
                Est. {task.estimatedTime}
              </span>
            </div>
          </div>

          {task.status !== 'completed' && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFixTask(task.id)}
                disabled={task.status === 'in-progress'}
              >
                <Zap className="w-4 h-4 mr-1" />
                {task.status === 'in-progress' ? 'In Progress' : 'Fix'}
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleMarkCompleted(task.id)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Completed
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Task Manager</h1>
          <p className="text-gray-600 mt-1">
            Optimize your Google My Business presence with AI-powered recommendations
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-yellow-600">{pendingCount}</div>
            <div className="text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{inProgressCount}</div>
            <div className="text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{completedCount}</div>
            <div className="text-gray-500">Done</div>
          </div>
        </div>
      </div>

      {/* High Priority Alert */}
      {highPriorityCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-800 font-medium">
                {highPriorityCount} high-priority task{highPriorityCount > 1 ? 's' : ''} need{highPriorityCount === 1 ? 's' : ''} attention
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {activeTab === 'completed' 
                    ? "Great job! Complete some tasks to see them here."
                    : "No tasks match the current filter."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};