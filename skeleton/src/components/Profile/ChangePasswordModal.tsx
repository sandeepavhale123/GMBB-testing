import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Lock, X } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useProfile } from "../../hooks/useProfile";
import { profileService } from "../../services/profileService";
import { CurrentPasswordForm } from "./CurrentPasswordForm";
import { NewPasswordForm } from "./NewPasswordForm";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18nNamespace("Profile/changePassword");
  const { toast } = useToast();
  const { profileData, updateProfile, isUpdating, getStoredPassword } =
    useProfile();
  const [step, setStep] = useState<"current" | "new">("current");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleCurrentPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      toast.error({
        title: t("toast.currentRequired.title"),
        description: t("toast.currentRequired.description"),
      });
      return;
    }

    setIsVerifying(true);

    try {
      const storedPassword = getStoredPassword();
      const isValid = await profileService.verifyCurrentPassword(
        { currentPassword },
        storedPassword
      );

      if (isValid) {
        setStep("new");
        // Clear current password for security
        setCurrentPassword("");
        toast.success({
          title: t("toast.verified.title"),
          description: t("toast.verified.description"),
        });
      } else {
        toast.error({
          title: t("toast.invalid.title"),
          description: t("toast.invalid.description"),
        });
      }
    } catch (error) {
      toast.error({
        title: t("toast.verifyFailed.title"),
        description: t("toast.verifyFailed.description"),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error({
        title: t("toast.missing.title"),
        description: t("toast.missing.description"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error({
        title: t("toast.mismatch.title"),
        description: t("toast.mismatch.description"),
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error({
        title: t("toast.tooShort.title"),
        description: t("toast.tooShort.description"),
      });
      return;
    }

    const storedPassword = getStoredPassword();
    if (newPassword === storedPassword) {
      toast.error({
        title: t("toast.same.title"),
        description: t("toast.same.description"),
      });
      return;
    }

    if (!profileData) {
      toast.error({
        title: t("toast.profileError.title"),
        description: t("toast.profileError.description"),
      });
      return;
    }

    try {
      await updateProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        timezone: profileData.timezone,
        username: profileData.username,
        dashboardType: 1,
        language: profileData.language,
        profilePic: profileData.profilePic || "",
        password: newPassword,
      });

      toast.success({
        title: t("toast.updated.title"),
        description: t("toast.updated.description"),
      });
      handleClose();
    } catch (error) {
      toast.error({
        title: t("toast.updateFailed.title"),
        description: t("toast.updateFailed.description"),
      });
    }
  };

  const handleClose = () => {
    setStep("current");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords({ current: false, new: false, confirm: false });
    onClose();
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-purple-600" />
              {t("dialog.title")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {step === "current" ? (
          <CurrentPasswordForm
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            showCurrentPassword={showPasswords.current}
            toggleCurrentPasswordVisibility={() =>
              togglePasswordVisibility("current")
            }
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
            toggleNewPasswordVisibility={() => togglePasswordVisibility("new")}
            toggleConfirmPasswordVisibility={() =>
              togglePasswordVisibility("confirm")
            }
            onSubmit={handleNewPasswordSubmit}
            onBack={() => setStep("current")}
            isUpdating={isUpdating}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
