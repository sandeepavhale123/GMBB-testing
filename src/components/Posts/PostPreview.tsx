
import React from 'react';
import { Button } from '../ui/button';

interface PostPreviewProps {
  data: {
    title: string;
    description: string;
    ctaButton: string;
    ctaUrl: string;
    image: File | null;
    platforms: string[];
  };
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  data
}) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Mock Business Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">B</span>
          </div>
          <div>
            <h4 className="font-medium text-sm">Business Name</h4>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {data.title && <h3 className="font-semibold text-gray-900 mb-3 text-base leading-tight">{data.title}</h3>}
        {data.description && <p className="text-gray-700 text-sm mb-4 leading-relaxed">{data.description}</p>}
      </div>

      {/* Image */}
      {data.image ? (
        <img src={URL.createObjectURL(data.image)} alt="Post" className="w-full h-48 object-cover" />
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-medium">Upload an image</span>
        </div>
      )}

      {/* CTA Button */}
      {data.ctaButton && (
        <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
            {data.ctaButton.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        </div>
      )}

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
      {data.platforms.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1">
            {data.platforms.slice(0, 3).map((platform, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {platform}
              </span>
            ))}
            {data.platforms.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                +{data.platforms.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
