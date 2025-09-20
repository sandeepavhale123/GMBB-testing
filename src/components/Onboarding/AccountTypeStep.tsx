import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, User } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AccountTypeStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const AccountTypeStep = ({
  formData,
  updateFormData,
  onNext,
}: AccountTypeStepProps) => {
  const { t } = useI18nNamespace("Onboarding/accountTypeStep");
  const handleAccountTypeSelect = (accountType: string) => {
    updateFormData({ accountType });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("accountTypeStep.title")}
        </h1>
        <p className="text-xl text-gray-600">
          {t("accountTypeStep.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card
          className="p-8 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500"
          onClick={() => handleAccountTypeSelect("agency")}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("accountTypeStep.agency.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("accountTypeStep.agency.description")}
            </p>
            <ul className="text-left text-gray-600 space-y-2 mb-8">
              {/* <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Manage multiple client accounts
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                White-label reporting options
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Team collaboration features
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Advanced analytics dashboard
              </li> */}
              {t("accountTypeStep.agency.features", {
                returnObjects: true,
              }).map((feature: string, i: number) => (
                <li key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" size="lg">
              {t("accountTypeStep.agency.button")}
            </Button>
          </div>
        </Card>

        <Card
          className="p-8 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-500"
          onClick={() => handleAccountTypeSelect("personal")}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("accountTypeStep.personal.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("accountTypeStep.personal.description")}
            </p>
            <ul className="text-left text-gray-600 space-y-2 mb-8">
              {/* <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Manage your own business
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Easy-to-use interface
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Performance insights
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Local SEO tools
              </li> */}
              {t("accountTypeStep.personal.features", {
                returnObjects: true,
              }).map((feature: string, i: number) => (
                <li key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {t("accountTypeStep.personal.button")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountTypeStep;
