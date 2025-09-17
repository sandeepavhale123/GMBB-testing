import React from "react";
import { Info } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PersonalizationGuide: React.FC = () => {
  const { t } = useI18nNamespace("Reviews/personalizationGuide");
  const variables = [
    {
      name: "{full_name}",
      description: t("personalizationGuide.variables.fullName"),
    },
    {
      name: "{first_name}",
      description: t("personalizationGuide.variables.firstName"),
    },
    {
      name: "{last_name}",
      description: t("personalizationGuide.variables.lastName"),
    },
    {
      name: "{owner_name}",
      description: t("personalizationGuide.variables.ownerName"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t("personalizationGuide.title")}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {t("personalizationGuide.description")}
      </p>

      <div className="space-y-3">
        {variables.map((variable) => (
          <div
            key={variable.name}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border"
          >
            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0">
              {variable.name}
            </code>
            <span className="text-sm text-gray-700">
              {variable.description}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          {t("personalizationGuide.example.title")}
        </h4>
        <div className="bg-white p-3 rounded border text-sm">
          <p className="text-gray-700">
            {t("personalizationGuide.example.message")}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t("personalizationGuide.example.signature")}
          </p>
        </div>
      </div>
    </div>
  );
};
