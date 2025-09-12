import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts On GMB</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Google My Business Q&A and posts allow businesses to provide information and engage with potential customers in real time. 
          They enable businesses to quickly answer frequently asked questions and respond to customer feedback, which can improve 
          customer satisfaction and build trust. GBP Posts also enable businesses to share updates and promotions, which can help to 
          attract new customers and boost sales.
        </p>
        
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
                  onClick={() => post.link && window.open(post.link, '_blank')}
                >
                  View Post
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};