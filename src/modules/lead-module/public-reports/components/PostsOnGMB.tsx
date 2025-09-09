import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  image: string;
  description: string;
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
            <div key={post.id} className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt="GMB Post" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {post.description}
              </p>
              <Button variant="outline" className="w-full">
                View Post
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};