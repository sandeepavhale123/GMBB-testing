import React from "react";
import { Edit, Trash2, Share2, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface TeamMemberCardProps {
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    role: string;
    password: string;
    listingsCount: number;
    isActive: boolean;
  };
  onEdit: (member: any) => void;
  onDelete: (member: any) => void;
  onShare: (member: any) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const roleColors = {
  Moderator: "bg-purple-100 text-purple-700 border-purple-200",
  Staff: "bg-blue-100 text-blue-700 border-blue-200",
  Client: "bg-green-100 text-green-700 border-green-200",
  "Lead Generator": "bg-orange-100 text-orange-700 border-orange-200",
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onShare,
  showPassword,
  onTogglePassword,
}) => {
  const { t } = useI18nNamespace("Settings/teamMemberCard");
  const getRoleBadgeClass = (role: string) => {
    return (
      roleColors[role as keyof typeof roleColors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header with Avatar and Actions */}
      <div className="flex items-center justify-between mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.profilePicture} alt="team-member-profile" />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
            {member.firstName[0]}
            {member.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(member)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(member)}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(member)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex align-center"></div>
        <h3 className="font-medium text-gray-900">
          {member.firstName} {member.lastName}
        </h3>
        <Badge variant="outline" className={getRoleBadgeClass(member.role)}>
          {member.role}
        </Badge>
      </div>
      <p className="text-sm text-gray-500">{member.email}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">
          {showPassword ? member.password : "••••••••"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePassword}
          className="h-5 w-5 p-0"
        >
          {showPassword ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Listings Card - Full Width */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-900">
            {member.listingsCount}
          </div>
          <div className="text-xs text-gray-500">
            {t("teamMemberCard.labels.listings")}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            member.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm text-gray-600">
          {member.isActive
            ? t("teamMemberCard.labels.active")
            : t("teamMemberCard.labels.inactive")}
        </span>
      </div>
    </div>
  );
};
