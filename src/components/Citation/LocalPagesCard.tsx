// src/components/Citation/LocalPagesCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FileSearch } from "lucide-react";

type Props = { t: (key: string) => string };

export const LocalPagesCard: React.FC<Props> = React.memo(({ t }) => {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
          <FileSearch className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <CardTitle className="text-base sm:text-lg">
          {t("citationPage.localPagesCard.title")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground px-2">
          {t("citationPage.localPagesCard.description")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
});
