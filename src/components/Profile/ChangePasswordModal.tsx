
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Lock } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useProfile } from '../../hooks/useProfile';
import { profileService } from '../../services/profileService';
import { CurrentPasswordForm } from './CurrentPasswordForm';
import { NewPasswordForm } from './NewPasswordForm';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const { profileData, updateProfile, isUpdating } = useProfile();
  const [step, setStep] = useState<'current' | 'new'>('current');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleCurrentPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const isValid = await profileService.verifyCurrentPassword({ currentPassword });
      
      if (isValid) {
        setStep('new');
        toast({
          title: "Password Verified",
          description: "Current password verified successfully.",
        });
      } else {
        toast({
          title: "Invalid Password",
          description: "The current password you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify current password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast({
        title: "Error",
        description: "New password must be different from your current password.",
        variant: "destructive",
      });
      return;
    }

    if (!profileData) {
      toast({
        title: "Error",
        description: "Profile data not available. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProfile({
        first_name: profileData.frist_name,
        last_name: profileData.last_name,
        timezone: profileData.timezone,
        username: profileData.username,
        dashboardType: 1,
        language: profileData.language,
        profilePic: profileData.profilePic || '',
        password: newPassword
      });
      
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setStep('current');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswords({ current: false, new: false, confirm: false });
    onClose();
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-purple-600" />
            Change Password
          </DialogTitle>
        </DialogHeader>

        {step === 'current' ? (
          <CurrentPasswordForm
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            showCurrentPassword={showPasswords.current}
            toggleCurrentPasswordVisibility={() => togglePasswordVisibility('current')}
            onSubmit={handleCurrentPasswordSubmit}
            onCancel={handleClose}
            isVerifying={isVerifying}
          />
        ) : (
          <NewPasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showNewPassword={showPasswords.new}
            showConfirmPassword={showPasswords.confirm}
            toggleNewPasswordVisibility={() => togglePasswordVisibility('new')}
            toggleConfirmPasswordVisibility={() => togglePasswordVisibility('confirm')}
            onSubmit={handleNewPasswordSubmit}
            onBack={() => setStep('current')}
            isUpdating={isUpdating}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
