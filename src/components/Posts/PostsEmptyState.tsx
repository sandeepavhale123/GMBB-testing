import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PostsEmptyStateProps {
  hasActiveFilters: boolean;
  onCreatePost: () => void;
}

export const PostsEmptyState: React.FC<PostsEmptyStateProps> = ({
  hasActiveFilters,
  onCreatePost,
}) => {
  const { t } = useI18nNamespace("Post/postsEmptyState");
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t("postsEmptyState.title")}{" "}
      </h3>
      <p className="text-gray-500 mb-4">
        {hasActiveFilters
          ? t("postsEmptyState.description.withFilters")
          : t("postsEmptyState.description.withoutFilters")}
      </p>
      <Button onClick={onCreatePost}>
        <Plus className="w-4 h-4 mr-1" />
        {t("postsEmptyState.createButton")}
      </Button>
    </div>
  );
};
