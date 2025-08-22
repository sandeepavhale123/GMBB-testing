import React, { useState } from "react";

const defaultImage = "/default-featured-image.jpg";

interface PostImageProps {
  src?: string;
}

export const PostImage: React.FC<PostImageProps> = ({ src }) => {
  const [error, setError] = useState(false);
  // Detect Google-hosted images
  const isGoogleImage = src?.includes("googleusercontent.com");

  // Decide final URL
  const finalSrc =
    !error && src
      ? isGoogleImage && !src.includes("/p/")
        ? `${src}=w300-h300` // only for resizable google photos links
        : src // keep original if it's /p/ style
      : defaultImage;

  return (
    <>
      <img
        src={finalSrc}
        alt="Post"
        onError={() => setError(true)}
        className={`w-20 h-20 object-cover rounded ${
          error || !src ? "grayscale opacity-80" : ""
        }`}
      />
    </>
  );
};
