import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Globe, Clock, FileText, Tag, Camera } from "lucide-react";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["Lead-module-public-report/rankingFactorsGrid"];
interface RankingFactor {
  id: string;
  label: string;
  status: "good" | "needs-work";
  description?: string;
  icon?: string;
}

interface RankingFactorsGridProps {
  factors: RankingFactor[];
}

const iconMap = {
  phone: Phone,
  globe: Globe,
  clock: Clock,
  "file-text": FileText,
  tag: Tag,
  camera: Camera,
};

export const RankingFactorsGrid: React.FC<RankingFactorsGridProps> = ({
  factors,
}) => {
  const { t } = usePublicI18n(namespaces);
  const getStatusBadge = (status: string) => {
    if (status === "good") {
      return (
        <div className="inline-block bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          {t("status.passed")}
        </div>
      );
    } else {
      return (
        <div className="inline-block bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          {t("status.failed")}
        </div>
      );
    }
  };

  const getCardBackground = (status: string) => {
    return status === "good"
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">{t("description")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((factor) => {
            const IconComponent = factor.icon
              ? iconMap[factor.icon as keyof typeof iconMap]
              : null;

            return (
              <div
                key={factor.id}
                className={`relative p-6 rounded-lg border text-center ${getCardBackground(
                  factor.status
                )}`}
              >
                <div className="absolute -top-4 right-5">
                  {getStatusBadge(factor.status)}
                </div>
                {IconComponent && (
                  <div className="w-12 h-12 mx-auto mb-4 mt-2 bg-white rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {factor.label}
                </h3>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
