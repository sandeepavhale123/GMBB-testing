import React from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const PostsLoadingState: React.FC = () => {
  const { t } = useI18nNamespace("Post/postsLoadingState");
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-500">{t("postsLoadingState.loading")}</p>
    </div>
  );
};
