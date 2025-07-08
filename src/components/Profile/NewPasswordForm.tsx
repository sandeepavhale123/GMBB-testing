
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { PasswordInput } from './PasswordInput';
import { useFormValidation } from '../../hooks/useFormValidation';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const confirmPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface NewPasswordFormProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  toggleNewPasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isUpdating: boolean;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showNewPassword,
  showConfirmPassword,
  toggleNewPasswordVisibility,
  toggleConfirmPasswordVisibility,
  onSubmit,
  onBack,
  isUpdating
}) => {
  const { validate, getFieldError, hasFieldError, clearFieldError } = useFormValidation(confirmPasswordSchema);

  // Validate on password change
  useEffect(() => {
    if (newPassword || confirmPassword) {
      validate({ newPassword, confirmPassword });
    }
  }, [newPassword, confirmPassword]);

  const newPasswordError = getFieldError('newPassword');
  const confirmPasswordError = getFieldError('confirmPassword');
  const isFormValid = !hasFieldError('newPassword') && !hasFieldError('confirmPassword') && newPassword && confirmPassword;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <PasswordInput
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Enter new password"
          showPassword={showNewPassword}
          onToggleVisibility={toggleNewPasswordVisibility}
          required
        />
        {newPasswordError && (
          <p className="text-sm text-red-600 mt-1">{newPasswordError}</p>
        )}
      </div>

      <div>
        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm new password"
          showPassword={showConfirmPassword}
          onToggleVisibility={toggleConfirmPasswordVisibility}
          required
        />
        {confirmPasswordError && (
          <p className="text-sm text-red-600 mt-1">{confirmPasswordError}</p>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Password requirements:</p>
        <ul className="list-disc list-inside space-y-1">
          <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>At least 8 characters long</li>
          <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-green-600' : ''}>Include uppercase and lowercase letters</li>
          <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>Include at least one number</li>
          <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>Include at least one special character</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isUpdating || !isFormValid}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};
