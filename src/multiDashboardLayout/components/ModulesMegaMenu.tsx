import React, { useState, useRef, useEffect } from 'react';
import { Grid3X3, TrendingUp, Users, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const modules = [
  {
    name: 'GRO Ranking',
    description: 'Track and optimize your local search rankings',
    icon: TrendingUp,
    href: '/main-dashboard/gro-ranking',
  },
  {
    name: 'Lead Management',
    description: 'Manage and track your leads effectively',
    icon: Users,
    href: '/main-dashboard/lead-management',
  },
  {
    name: 'Reputation',
    description: 'Monitor and manage your online reputation',
    icon: Star,
    href: '/main-dashboard/reputation',
  },
];

export const ModulesMegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="text-white hover:text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Modules</h3>
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-0 text-xs"
              >
                Coming Soon
              </Badge>
            </div>
            <div className="space-y-2">
              {modules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <a
                    key={module.name}
                    href={module.href}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{module.name}</div>
                      <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 mt-1">
                        {module.description}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};