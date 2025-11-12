import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface Post {
  id: string;
  image: string;
  description: string;
  link?: string;
}

interface PostsOnGMBProps {
  posts: Post[];
}

export const PostsOnGMB: React.FC<PostsOnGMBProps> = ({ posts }) => {
  const { t } = useI18nNamespace("Lead-module-public-report/postsOnGMB");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">{t("description")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="aspect-video">
                <img
                  src={post.image}
                  alt="GMB Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
                  {post.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => post.link && window.open(post.link, "_blank")}
                >
                  {t("button")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
