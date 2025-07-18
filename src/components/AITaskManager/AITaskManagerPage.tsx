import React, { useState, useEffect } from 'react';
import { useListingContext } from '../../context/ListingContext';
import { NoListingSelected } from '../ui/no-listing-selected';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const AITaskManagerPage: React.FC = () => {
  const { selectedListing, isInitialLoading } = useListingContext();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: '1',
      name: 'Generate Social Media Posts',
      description: 'Create engaging posts for Facebook and Instagram.',
      type: 'Content Creation',
      dueDate: '2024-07-15',
      isRecurring: true,
      status: 'In Progress',
    },
    {
      id: '2',
      name: 'Analyze Customer Reviews',
      description: 'Summarize recent customer feedback and identify key trends.',
      type: 'Data Analysis',
      dueDate: '2024-07-22',
      isRecurring: false,
      status: 'Completed',
    },
  ]);

  // Show no listing state
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected />;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">AI Task Manager</h1>

      {/* Task Creation Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="taskDescription">Task Description</Label>
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="taskType">Task Type</Label>
            <Select onValueChange={setTaskType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Content Creation">Content Creation</SelectItem>
                <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                <SelectItem value="SEO Optimization">SEO Optimization</SelectItem>
                <SelectItem value="Customer Engagement">Customer Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(!!checked)}
            />
            <Label htmlFor="isRecurring">Recurring Task</Label>
          </div>
          <Button onClick={() => {
            const newTask = {
              id: String(tasks.length + 1),
              name: taskName,
              description: taskDescription,
              type: taskType,
              dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
              isRecurring: isRecurring,
              status: 'Pending',
            };
            setTasks([...tasks, newTask]);
            setTaskName('');
            setTaskDescription('');
            setTaskType('');
            setDueDate(undefined);
            setIsRecurring(false);
          }}>
            Create Task
          </Button>
        </CardContent>
      </Card>

      {/* Task List */}
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{task.description}</p>
              <div className="mt-2">
                <p>
                  <span className="font-semibold">Type:</span> {task.type}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {task.dueDate}
                </p>
                <p>
                  <span className="font-semibold">Recurring:</span> {task.isRecurring ? 'Yes' : 'No'}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {task.status}
                </p>
              </div>
              <Button className="mt-4">Mark as Complete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
