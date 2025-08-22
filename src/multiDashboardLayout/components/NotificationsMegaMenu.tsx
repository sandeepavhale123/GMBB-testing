import React, { useState, useRef, useEffect } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const NotificationsMegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

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

  const handleViewAllFeatures = () => {
    setIsOpen(false);
    window.open('https://docs.google.com/spreadsheets/d/19_eBpk-PvKqU9Q_vn83GfYLBZT3zsIM2IBJPU-uTdNQ/edit?gid=0#gid=0', '_blank');
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="text-white hover:text-black relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4 h-4" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
        >
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-foreground mb-2">Feature List</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explore the application's features – including what's already available, what's coming soon, and what's being deprecated.
              </p>
            </div>
            
            <Button
              onClick={handleViewAllFeatures}
              className="w-full justify-between bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <span>View All Features</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};