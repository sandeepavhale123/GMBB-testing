import React, { useState } from 'react';
import { BarChart3, Menu, X } from 'lucide-react';

interface TopHeaderProps {
  reportId?: string;
  brandingData?: {
    company_logo?: string;
    company_name?: string;
    company_website?: string;
    company_email?: string;
    company_phone?: string;
    company_address?: string;
  } | null;
  reportType?: 'gmb-health' | 'citation' | 'prospect';
  reportTitle?: string;
}

const navigationItems = [
  { id: 'overall-section', label: 'Overall' },
  { id: 'presence-section', label: 'Presence' },
  { id: 'post-section', label: 'Post' },
  { id: 'competitors-section', label: 'Competitors' },
  { id: 'reviews-section', label: 'Reviews' }
];

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  brandingData, 
  reportType = 'gmb-health',
  reportTitle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header height
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
    }
  };

  // Use branding data if available, otherwise fallback to default
  const displayLogo = brandingData?.company_logo;
  const displayName = brandingData?.company_name || 'Report Ranking';
  const displaySubtitle = reportTitle || 'Professional Business Reports';

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[405] w-full px-4 py-3 border-b border-border bg-background"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {displayLogo ? (
              <img 
                src={displayLogo} 
                alt="Company Logo" 
                className="h-8 w-8 object-contain rounded-lg"
              />
            ) : (
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div className="border-l border-border/30 pl-3 hidden md:block">
              <h1 className="text-md font-semibold text-foreground mb-0 p-0">{displayName}</h1>
              <p className="text-sm text-muted-foreground mt-0 p-0">{displaySubtitle}</p>
            </div>
          </div>
        </div>

        {/* Right section - Navigation Menu */}
        {reportType === 'gmb-health' && (
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSmoothScroll(item.id)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50 md:hidden">
                <nav className="py-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSmoothScroll(item.id)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};