import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Star,
  Loader2,
} from "lucide-react";
import {
  fetchGoals,
  saveGoals,
} from "@/store/slices/onboarding/onboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface SelectGoalStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const SelectGoalStep = ({
  formData,
  updateFormData,
  onNext,
}: SelectGoalStepProps) => {
  const { t } = useI18nNamespace("Onboarding/selectGoalStep");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const {
    goalsData,
    goalsLoading,
    goalsError,
    goalsSaveLoading,
    goalsSaveError,
  } = useSelector((state: RootState) => state.onboarding);

  useEffect(() => {
    dispatch(fetchGoals());
  }, []);

  /// Update selected goals when API data loads
  useEffect(() => {
    if (goalsData?.data && !hasInitialized) {
      // Check if there are pre-selected goals from API activeList
      const activeList = (goalsData.data as any).activeList;
      if (activeList && Array.isArray(activeList) && activeList.length > 0) {
        const preSelectedGoals = activeList.map((item: any) => item.toString());
        setSelectedGoals(preSelectedGoals);
        updateFormData({ goals: preSelectedGoals });
      } else if (formData.goals && formData.goals.length > 0) {
        // Use goals from form data if no API pre-selection
        setSelectedGoals(formData.goals);
      } else {
        // No pre-selected goals, start with empty selection
        setSelectedGoals([]);
      }
    }
  }, [goalsData, hasInitialized]);

  // Handle API errors
  useEffect(() => {
    if (goalsError) {
      // console.error("Goals loading error:", goalsError);
      toast({
        variant: "destructive",
        title: t("selectGoalStep.errorLoading"),
        description: goalsError,
      });
    }
  }, [goalsError, toast]);

  useEffect(() => {
    if (goalsSaveError) {
      // console.error("Goals save error:", goalsSaveError);
      toast({
        variant: "destructive",
        title: t("selectGoalStep.errorSaving"),
        description: goalsSaveError,
      });
    }
  }, [goalsSaveError, toast]);

  // Icon mapping for API goals
  const getIconForGoal = (title: string) => {
    if (title.includes("GMB") || title.includes("Optimization")) return Target;
    if (title.includes("SEO")) return TrendingUp;
    if (title.includes("Media") || title.includes("Content"))
      return MessageSquare;
    if (title.includes("Review") || title.includes("Reputation")) return Star;
    if (title.includes("Report") || title.includes("GSC")) return Calendar;
    if (title.includes("Client") || title.includes("Onboarding")) return Users;
    return Target; // Default icon
  };

  const handleGoalToggle = useCallback(
    (goalId: string) => {
      const updatedGoals = selectedGoals.includes(goalId)
        ? selectedGoals.filter((id: string) => id !== goalId)
        : [...selectedGoals, goalId];

      setSelectedGoals(updatedGoals);
      // Immediately update form data for persistence
      updateFormData({ goals: updatedGoals });
    },
    [selectedGoals, updateFormData]
  );

  const handleNext = async () => {
    try {
      // Convert string IDs to numbers for API
      const goalIds = selectedGoals.map((id) => parseInt(id, 10));

      //Save goals to API
      await dispatch(saveGoals(goalIds)).unwrap();

      // Update form data and proceed
      updateFormData({ goals: selectedGoals });

      // Show success message
      toast({
        title: t("selectGoalStep.saveSuccessTitle"),
        description: t("selectGoalStep.saveSuccessDescription", {
          count: selectedGoals.length,
        }),
        // `${selectedGoals.length} goals have been saved.`,
      });

      onNext();
    } catch (error) {
      // console.error("Error in handleNext:", error);
    }
  };

  // Show loading state during initial load
  if (goalsLoading) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t("selectGoalStep.title")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t("selectGoalStep.loadingMessage")}
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const goals = goalsData?.data?.goalList || [];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          {t("selectGoalStep.title")}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {t("selectGoalStep.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {goals.map((goal) => {
          const IconComponent = getIconForGoal(goal.title);
          const isSelected = selectedGoals.includes(goal.id);

          return (
            <Card
              key={goal.id}
              className={`p-4 sm:p-5 lg:p-6 cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleGoalToggle(goal.id)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <Checkbox checked={isSelected} className="mt-0.5 sm:mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <IconComponent
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        isSelected ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                      {goal.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {goal.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={handleNext}
          disabled={goalsSaveLoading}
          className="px-6 sm:px-8 py-2 text-sm sm:text-base h-10"
        >
          {goalsSaveLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("selectGoalStep.saving")}
            </>
          ) : selectedGoals.length > 0 ? (
            t("selectGoalStep.continueWithCount", {
              count: selectedGoals.length,
            })
          ) : (
            ""
          )}
        </Button>
      </div>
    </div>
  );
};

export default SelectGoalStep;
