import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Show toast notification
    toast.error({
      title: "Something went wrong",
      description: "An error occurred. Please try refreshing the page."
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground">
                There was an error in this component. Please try refreshing or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium">Error Details (Dev Mode)</summary>
                  <pre className="mt-2 text-xs text-destructive whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <Button onClick={this.handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}