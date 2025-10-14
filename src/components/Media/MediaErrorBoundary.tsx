import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { WithTranslation, withTranslation } from "react-i18next";

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MediaErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // console.error("Media page error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("title")}
              </h3>
              <p className="text-sm text-gray-600">{t("description")}</p>
            </div>
            <Button onClick={this.handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-1" />
              {t("tryAgain")}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default withTranslation("Media/mediaErrorBoundary")(MediaErrorBoundary);
