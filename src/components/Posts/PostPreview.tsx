
import React from 'react';
import { Button } from '../ui/button';

interface PostPreviewProps {
  data: {
    title: string;
    description: string;
    ctaButton: string;
    image: File | null;
  };
}

export const PostPreview: React.FC<PostPreviewProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Mock Business Header */}
      <div className="p-3 border-b">
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
      <div className="p-3">
        {data.title && (
          <h3 className="font-medium text-gray-900 mb-2">{data.title}</h3>
        )}
        {data.description && (
          <p className="text-gray-700 text-sm mb-3">{data.description}</p>
        )}
      </div>

      {/* Image Placeholder */}
      {data.image ? (
        <img
          src={URL.createObjectURL(data.image)}
          alt="Post"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-medium">Post Image</span>
        </div>
      )}

      {/* CTA Button */}
      {data.ctaButton && (
        <div className="p-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            {data.ctaButton.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        </div>
      )}

      {/* Engagement Placeholder */}
      <div className="px-3 pb-3 flex items-center justify-between text-xs text-gray-500">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>📤 Share</span>
      </div>
    </div>
  );
};
