
import React from 'react';
import { Bell, Settings, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export const HeaderActions: React.FC = () => {
  const navigate = useNavigate();

  const handleAddNewListing = () => {
    navigate('/settings');
  };

  return (
    <>
      {/* Add New Listing Button */}
      <Button 
        variant="default"
        size="sm"
        onClick={handleAddNewListing}
        className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 px-3 py-2"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add New Listing</span>
        <span className="sm:hidden">Add</span>
      </Button>

      {/* Notification and Settings */}
      <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 relative">
        <Bell className="w-4 h-4 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
      </Button>

      <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 hidden sm:flex">
        <Settings className="w-4 h-4 text-gray-600" />
      </Button>
    </>
  );
};
