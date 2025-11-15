import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { WithTranslation, withTranslation } from "react-i18next";

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PostPreviewErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("🚨 PostPreview error caught by boundary:", error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 PostPreview error details:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
            <div>
              <h3 className="text-sm font-medium text-red-900 mb-1">
                {t("title")}
              </h3>
              <p className="text-xs text-red-700">{t("description")}</p>
            </div>
            <Button
              onClick={this.handleRetry}
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default withTranslation("Post/postPreviewErrorBoundary")(
  PostPreviewErrorBoundary
);
