export interface SurveyValidationResult {
  isValid: boolean;
  errors: string[];
  stats: {
    totalQuestions: number;
    requiredQuestions: number;
    pageCount: number;
  };
}

export const validateSurveyJSON = (json: any): SurveyValidationResult => {
  const errors: string[] = [];
  let totalQuestions = 0;
  let requiredQuestions = 0;
  let pageCount = 0;

  // Check if JSON exists
  if (!json) {
    errors.push("Survey JSON is empty");
    return {
      isValid: false,
      errors,
      stats: { totalQuestions: 0, requiredQuestions: 0, pageCount: 0 },
    };
  }

  // Check if pages exist
  if (!json.pages || !Array.isArray(json.pages)) {
    errors.push("Survey must have at least one page");
    return {
      isValid: false,
      errors,
      stats: { totalQuestions: 0, requiredQuestions: 0, pageCount: 0 },
    };
  }

  pageCount = json.pages.length;

  // Count questions and required questions
  json.pages.forEach((page: any, pageIndex: number) => {
    if (!page.elements || !Array.isArray(page.elements)) {
      errors.push(`Page ${pageIndex + 1} has no elements`);
      return;
    }

    page.elements.forEach((element: any) => {
      totalQuestions++;
      if (element.isRequired) {
        requiredQuestions++;
      }
    });
  });

  // Validation rules
  if (totalQuestions === 0) {
    errors.push("Survey must have at least one question");
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    stats: {
      totalQuestions,
      requiredQuestions,
      pageCount,
    },
  };
};

export const getSurveyStats = (json: any) => {
  const validation = validateSurveyJSON(json);
  return validation.stats;
};

export const hasSurveyQuestions = (json: any): boolean => {
  const validation = validateSurveyJSON(json);
  return validation.stats.totalQuestions > 0;
};
