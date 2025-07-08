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
  Zap,
  X
} from 'lucide-react';
import { PageBreadcrumb } from '../Header/PageBreadcrumb';

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

const typeColors = {
  'one-time': 'bg-purple-100 text-purple-800 border-purple-200',
  'recurring': 'bg-blue-100 text-blue-800 border-blue-200'
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
  const [showHighPriorityAlert, setShowHighPriorityAlert] = useState(true);

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
        <CardContent className="p-4">
          {/* Title and Description Row */}
          <div className="flex items-start gap-3 mb-3">
            <CategoryIcon className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>

          {/* Status, Type and Actions Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[task.status]} variant="outline">
                <StatusIcon className="w-3 h-3 mr-1" />
                {task.status.replace('-', ' ')}
              </Badge>
              <Badge className={typeColors[task.type]} variant="outline">
                {task.type}
              </Badge>
            </div>

            {task.status !== 'completed' && (
              <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>
    );
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const oneTimeCount = tasks.filter(t => t.type === 'one-time').length;
  const recurringCount = tasks.filter(t => t.type === 'recurring').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              One-time Tasks
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-purple-500 to-purple-600">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {oneTimeCount}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              Recurring Tasks
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {recurringCount}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              Pending Tasks
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
              Completed Tasks
            </CardTitle>
            <div className="p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br from-green-500 to-green-600">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
              {completedCount}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
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