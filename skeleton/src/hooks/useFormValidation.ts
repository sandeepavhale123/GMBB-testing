import { useState, useCallback } from "react";
import { ZodSchema, ZodError } from "zod";

interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export const useFormValidation = <T extends Record<string, any>>(
  schema: ZodSchema<T>
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: T): ValidationResult<T> => {
    const result = schema.safeParse(data);

    if (result.success) {
      setErrors({});
      return {
        isValid: true,
        data: result.data,
      };
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((issue) => {
        const fieldName = issue.path?.[0];
        if (typeof fieldName === "string") {
          fieldErrors[fieldName] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return {
        isValid: false,
        errors: fieldErrors,
      };
    }
  }, [schema]);

  const getFieldError = useCallback((field: string) => {
    return errors[field] || "";
  }, [errors]);

  const hasFieldError = useCallback((field: string) => {
    return !!errors[field];
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  return {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
    errors,
  };
};
