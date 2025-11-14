import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useListingContext } from "../../context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface PostPreviewProps {
  data: {
    title: string;
    description: string;
    ctaButton: string;
    ctaUrl: string;
    image: File | string | null;
    platforms: string[];
    scheduledDate?: string;
  };
}

export const PostPreview: React.FC<PostPreviewProps> = ({ data }) => {
  const { selectedListing } = useListingContext();
  const { t } = useI18nNamespace("Post/postPreview");
  // CTA button options mapping
  const ctaOptions = [
    {
      value: "LEARN_MORE",
      label: t("cta.LEARN_MORE"),
    },
    {
      value: "BOOK",
      label: t("cta.BOOK"),
    },
    {
      value: "CALL",
      label: t("cta.CALL"),
    },
    {
      value: "ORDER",
      label: t("cta.ORDER"),
    },
    {
      value: "SHOP",
      label: t("cta.SHOP"),
    },
    {
      value: "SIGN_UP",
      label: t("cta.SIGN_UP"),
    },
  ];

  // Add debug logging
  // React.useEffect(() => {
  //   return () => {
  //     //
  //   };
  // }, []);

  React.useEffect(() => {
    //
  }, [data]);

  // Helper function to get image URL with proper cleanup
  const getImageUrl = () => {
    if (!data.image) return null;
    if (typeof data.image === "string") {
      // It's a URL from AI generation
      return data.image;
    } else {
      // It's a File object - create object URL
      return URL.createObjectURL(data.image);
    }
  };

  // Add cleanup for object URLs
  React.useEffect(() => {
    let objectUrl: string | null = null;

    if (data.image && typeof data.image !== "string") {
      objectUrl = URL.createObjectURL(data.image);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [data.image]);

  // Helper function to get business name with character limit
  const getBusinessName = () => {
    if (!selectedListing?.name) return t("placeholders.businessName");
    return selectedListing.name.length > 40
      ? selectedListing.name.slice(0, 40) + "..."
      : selectedListing.name;
  };

  // Helper function to get business initials for avatar fallback
  const getBusinessInitials = () => {
    if (!selectedListing?.name) return "B";
    return selectedListing.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to limit description text to 200 characters
  const getLimitedDescription = (description: string) => {
    if (!description) return "";
    return description.length > 200
      ? description.slice(0, 200) + "..."
      : description;
  };

  // Helper function to get CTA button label
  const getCTAButtonLabel = (value: string) => {
    const option = ctaOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };
  const imageUrl = getImageUrl();

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
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
            <p className="text-xs text-gray-500">
              {data.scheduledDate || t("placeholders.timeAgo")}
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Post"
          className="w-full  h-fulll max-h-[300px] object-cover"
        />
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-medium">
            {t("placeholders.uploadImage")}{" "}
          </span>
        </div>
      )}

      {/* Post Content - Now below the image */}
      <div className="p-4">
        {data.title && (
          <h3 className="font-semibold text-gray-900 mb-3 text-base leading-tight">
            {data.title}
          </h3>
        )}
        {data.description && (
          <p className="text-gray-700 text-sm mb-1 leading-relaxed">
            {getLimitedDescription(data.description)}
          </p>
        )}
      </div>

      {/* CTA Button */}
      {data.ctaButton && (
        <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
            {getCTAButtonLabel(data.ctaButton)}
          </Button>
        </div>
      )}

      {/* Engagement Placeholder */}
      <div className="px-4 pb-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span>👍</span> {t("engagement.like")}
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span>💬</span> {t("engagement.comment")}
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <span>📤</span> {t("engagement.share")}
        </button>
      </div>

      {/* Platform Tags */}
      {data.platforms.length > 0 && <div className="px-4 pb-4"></div>}
    </div>
  );
};
