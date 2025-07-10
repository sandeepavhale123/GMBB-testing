import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PublicReportLayoutProps {
  children: React.ReactNode;
  title: string;
  companyName?: string;
  companyLogo?: string;
  onExport?: () => void;
  onShare?: () => void;
}

export const PublicReportLayout: React.FC<PublicReportLayoutProps> = ({
  children,
  title,
  companyName = 'Company Name',
  companyLogo,
  onExport,
  onShare
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/public-reports')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Reports
              </Button>
              
              <div className="flex items-center gap-3">
                {companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt={companyName}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {companyName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="font-semibold text-lg">{title}</h1>
                  <p className="text-sm text-muted-foreground">{companyName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {onExport && (
                <Button size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 {companyName}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Generated on {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};