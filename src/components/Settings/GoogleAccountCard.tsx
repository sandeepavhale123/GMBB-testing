
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, RefreshCw, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TeamMember {
  name: string;
  role: string;
}

interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  listings: number;
  activeListings: number;
  lastSynced: string;
  isEnabled: boolean;
  visibilityScore: number;
  reviewResponseRate: number;
  keywordsTracked: number;
  qaResponseHealth: number;
  teamMembers: TeamMember[];
}

interface GoogleAccountCardProps {
  account: GoogleAccount;
  viewMode: 'grid' | 'list';
}

export const GoogleAccountCard: React.FC<GoogleAccountCardProps> = ({
  account,
  viewMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(account.isEnabled);

  const usagePercentage = (account.activeListings / 100) * 100;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      viewMode === 'list' ? 'w-full' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={account.avatar || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {getInitials(account.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{account.name}</h3>
              <p className="text-sm text-gray-600">{account.email}</p>
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Section */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Listings in Account:</span>
            <span className="font-medium">{account.listings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Active Listings:</span>
            <span className="font-medium">{account.activeListings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Synced:</span>
            <span className="font-medium">{account.lastSynced}</span>
          </div>
        </div>

        {/* Toggle and Progress */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Enable Syncing</span>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Listing Usage</span>
              <span>{account.activeListings}/100</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        </div>

        {/* Team Members */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Team</span>
          </div>
          <div className="flex -space-x-2">
            {account.teamMembers.slice(0, 3).map((member, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Avatar className="h-6 w-6 border-2 border-white">
                    <AvatarFallback className="text-xs bg-gray-200">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{member.name} - {member.role}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {account.teamMembers.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{account.teamMembers.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable SEO Info */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-0 h-auto"
          >
            <span className="text-sm font-medium text-gray-700">SEO Performance</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {isExpanded && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Visibility Score</span>
                <Badge variant="outline" className="text-xs">
                  {account.visibilityScore}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Review Response Rate</span>
                <Badge variant="outline" className="text-xs">
                  {account.reviewResponseRate}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Keywords Tracked</span>
                <Badge variant="outline" className="text-xs">
                  {account.keywordsTracked}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Q&A Response Health</span>
                <Badge variant="outline" className="text-xs">
                  {account.qaResponseHealth}%
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
