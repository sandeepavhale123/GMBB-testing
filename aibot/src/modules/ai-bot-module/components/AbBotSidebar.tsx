import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAbWorkspaceContext } from '../context/AbWorkspaceContext';
import { AbWorkspaceSwitcher } from './workspace/AbWorkspaceSwitcher';
import { AbCreateWorkspaceDialog } from './workspace/AbCreateWorkspaceDialog';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Palette,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/module/ai-bot/dashboard', icon: LayoutDashboard },
  { label: 'Team', path: '/module/ai-bot/workspace/team', icon: Users },
  { label: 'Branding', path: '/module/ai-bot/workspace/branding', icon: Palette },
  { label: 'Settings', path: '/module/ai-bot/workspace/settings', icon: Settings },
];

export const AbBotSidebar: React.FC = () => {
  const location = useLocation();
  const { isLoading } = useAbWorkspaceContext();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (isLoading) {
    return (
      <aside className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <>
      <aside className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Workspace Switcher */}
        <div className={cn("p-3 border-b border-border", collapsed && "px-2")}>
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={() => setCollapsed(false)}
            >
              <Bot className="h-5 w-5" />
            </Button>
          ) : (
            <AbWorkspaceSwitcher onCreateClick={() => setCreateDialogOpen(true)} />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      <AbCreateWorkspaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};
