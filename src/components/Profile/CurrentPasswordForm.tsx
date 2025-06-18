
import React from 'react';
import { Button } from '../ui/button';
import { PasswordInput } from './PasswordInput';

interface CurrentPasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  showCurrentPassword: boolean;
  toggleCurrentPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isVerifying: boolean;
}

export const CurrentPasswordForm: React.FC<CurrentPasswordFormProps> = ({
  currentPassword,
  setCurrentPassword,
  showCurrentPassword,
  toggleCurrentPasswordVisibility,
  onSubmit,
  onCancel,
  isVerifying
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordInput
        id="currentPassword"
        label="Current Password"
        value={currentPassword}
        onChange={setCurrentPassword}
        placeholder="Enter your current password"
        showPassword={showCurrentPassword}
        onToggleVisibility={toggleCurrentPasswordVisibility}
        required
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isVerifying || !currentPassword}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </form>
  );
};
