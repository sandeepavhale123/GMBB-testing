
import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useListingContext } from '../../context/ListingContext';

interface PostPreviewProps {
  data: {
    title: string;
    description: string;
    ctaButton: string;
    ctaUrl: string;
    image: File | string | null;
    platforms: string[];
  };
}

// CTA button options mapping
const ctaOptions = [{
  value: 'LEARN_MORE',
  label: 'Learn More'
}, {
  value: 'BOOK',
  label: 'Book Now'
}, {
  value: 'CALL',
  label: 'Call Now'
}, {
  value: 'ORDER',
  label: 'Order Online'
}, {
  value: 'SHOP',
  label: 'Shop Now'
}, {
  value: 'SIGN_UP',
  label: 'Sign Up'
}];

export const PostPreview: React.FC<PostPreviewProps> = ({
  data
}) => {
  const {
    selectedListing
  } = useListingContext();

  // Helper function to get image URL
  const getImageUrl = () => {
    if (!data.image) return null;
    if (typeof data.image === 'string') {
      // It's a URL from AI generation
      return data.image;
    } else {
      // It's a File object - create object URL
      return URL.createObjectURL(data.image);
    }
  };

  // Helper function to get business name with character limit
  const getBusinessName = () => {
    if (!selectedListing?.name) return 'Business Name';
    return selectedListing.name.length > 40 ? selectedListing.name.slice(0, 40) + '...' : selectedListing.name;
  };

  // Helper function to get business initials for avatar fallback
  const getBusinessInitials = () => {
    if (!selectedListing?.name) return 'B';
    return selectedListing.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Helper function to limit description text to 200 characters
  const getLimitedDescription = (description: string) => {
    if (!description) return '';
    return description.length > 200 ? description.slice(0, 200) + '...' : description;
  };

  // Helper function to get CTA button label
  const getCTAButtonLabel = (value: string) => {
    const option = ctaOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const imageUrl = getImageUrl();
  return <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Mock Business Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
              {getBusinessInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{getBusinessName()}</h4>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {data.title && <h3 className="font-semibold text-gray-900 mb-3 text-base leading-tight">{data.title}</h3>}
        {data.description && <p className="text-gray-700 text-sm mb-1 leading-relaxed">{getLimitedDescription(data.description)}</p>}
      </div>

      {/* Image */}
      {imageUrl ? <img src={imageUrl} alt="Post" className="w-full h-48 object-cover" /> : <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-medium">Upload an image</span>
        </div>}

      {/* CTA Button */}
      {data.ctaButton && <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
            {getCTAButtonLabel(data.ctaButton)}
          </Button>
        </div>}

      {/* Engagement Placeholder */}
      <div className="px-4 pb-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span>👍</span> Like
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span>💬</span> Comment
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span>📤</span> Share
        </button>
      </div>

      {/* Platform Tags */}
      {data.platforms.length > 0 && <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1">
            {data.platforms.slice(0, 3).map((platform, idx) => <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {platform}
              </span>)}
            {data.platforms.length > 3 && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                +{data.platforms.length - 3} more
              </span>}
          </div>
        </div>}
    </div>;
};
