import React, { useState } from "react";

const defaultImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80";

interface PostImageProps {
  src?: string;
}

export const PostImage: React.FC<PostImageProps> = ({ src }) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={!error && src ? `${src}=w300-h300` : defaultImage}
      alt="Post"
      onError={() => setError(true)}
      className={`w-20 h-20 object-cover rounded ${
        error || !src ? "grayscale opacity-80" : ""
      }`}
    />
  );
};
