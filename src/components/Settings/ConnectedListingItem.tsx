
import React from 'react';
import { MapPin } from 'lucide-react';

interface ConnectedListing {
  id: string;
  name: string;
  address: string;
  status: 'connected' | 'disconnected' | 'pending';
  type: 'Restaurant' | 'Retail' | 'Service' | 'Healthcare';
}

interface ConnectedListingItemProps {
  listing: ConnectedListing;
  size?: 'sm' | 'md';
}

export const ConnectedListingItem: React.FC<ConnectedListingItemProps> = ({
  listing,
  size = 'md'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-400';
      case 'pending':
        return 'bg-yellow-400';
      case 'disconnected':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const sizeClasses = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const textClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`${sizeClasses} rounded-full bg-blue-100 border-2 border-white flex items-center justify-center relative group`}>
      <MapPin className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${getStatusColor(listing.status)}`} />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
        <div className="font-medium">{listing.name}</div>
        <div className="text-gray-300">{listing.address}</div>
        <div className="text-gray-300 capitalize">{listing.status}</div>
      </div>
    </div>
  );
};
