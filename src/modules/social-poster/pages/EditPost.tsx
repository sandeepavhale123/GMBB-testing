import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../hooks/useSocialPoster";
import { SocialPosterCreatePost } from "./CreatePost";
import { Loader2 } from "lucide-react";

export const SocialPosterEditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePost(postId || "");

  useEffect(() => {
    if (error) {
      navigate("/social-poster/posts");
    }
  }, [error, navigate]);

  // Check if post can be edited (only draft or scheduled)
  useEffect(() => {
    if (data?.data && !["draft", "scheduled"].includes(data.data.status)) {
      navigate("/social-poster/posts");
    }
  }, [data, navigate]);

  if (isLoading || !postId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  return <SocialPosterCreatePost editMode postData={data.data} postId={postId} />;
};
