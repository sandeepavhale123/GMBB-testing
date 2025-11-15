
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface GoogleAccountAvatarProps {
  name: string;
  avatar: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const GoogleAccountAvatar: React.FC<GoogleAccountAvatarProps> = ({
  name,
  avatar,
  size = 'md'
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6';
      case 'md':
        return 'h-10 w-10';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  const getFallbackClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return '';
      default:
        return 'text-sm';
    }
  };

  return (
    <Avatar className={getSizeClasses()}>
      <AvatarImage src={avatar || ''}  alt="user-profile" />
      <AvatarFallback className={`bg-blue-100 text-blue-700 font-semibold ${getFallbackClasses()}`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
