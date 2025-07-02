import { useState, useCallback } from "react";
import { ZodSchema, ZodError } from "zod";

export const useFormValidation = <T extends Record<string, any>>(
  schema: ZodSchema<T>
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: T) => {
    const result = schema.safeParse(data);

    if (result.success) {
      setErrors({});
      return { isValid: true };
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((issue) => {
        const fieldName = issue.path?.[0];
        if (typeof fieldName === "string") {
          fieldErrors[fieldName] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return { isValid: false };
    }
  };

  const getFieldError = (field: string) => {
    console.log(`Getting error for field ${field}:`, errors[field]);
    return errors[field] || "";
  };

  const hasFieldError = (field: string) => {
    const hasError = !!errors[field];
    console.log(`Field ${field} has error:`, hasError);
    return hasError;
  };

  const clearErrors = () => {
    console.log("Clearing all errors");
    setErrors({});
  };

  const clearFieldError = (field: string) => {
    console.log(`Clearing error for field ${field}`);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  return {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
    errors, // Added for debugging
  };
};
