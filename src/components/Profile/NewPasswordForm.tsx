
import React from 'react';
import { Button } from '../ui/button';
import { PasswordInput } from './PasswordInput';

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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      <div className="text-xs text-gray-500 space-y-1">
        <p>Password requirements:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>At least 8 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include at least one number</li>
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
          disabled={isUpdating}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};
