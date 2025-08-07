import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useBulkPostPreview } from '@/hooks/useBulkPostPreview';

interface BulkPostPreviewSectionProps {
  bulkId: string;
  onBack: () => void;
}

const PostPreview = memo(({ bulkPost }: { bulkPost: any }) => {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (!bulkPost) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Image */}
        {bulkPost?.media?.images && (
          <div className="w-full">
            <img 
              src={bulkPost.media.images} 
              alt="Post media" 
              className="w-full h-48 object-cover rounded-lg border border-border" 
            />
          </div>
        )}

        {/* Title */}
        {bulkPost?.title && (
          <h3 className="text-xl font-bold text-foreground">{bulkPost.title}</h3>
        )}

        {/* Description */}
        {bulkPost?.content && (
          <p className="text-muted-foreground text-sm leading-relaxed">{bulkPost.content}</p>
        )}

        {/* Action Type */}
        {bulkPost?.actionType && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Action:</span>
            <Badge variant="secondary" className="capitalize">
              {bulkPost.actionType.replace('_', ' ')}
            </Badge>
          </div>
        )}

        {/* CTA URL */}
        {bulkPost?.ctaUrl && (
          <div className="space-y-1">
            <span className="text-sm font-medium text-foreground block">CTA URL:</span>
            <p className="text-xs text-muted-foreground break-all bg-muted/50 p-2 rounded">
              {bulkPost.ctaUrl}
            </p>
          </div>
        )}

        {/* Tags */}
        {bulkPost?.tags && (
          <div className="space-y-1">
            <span className="text-sm font-medium text-foreground block">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {bulkPost.tags.split(',').map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Publish Date */}
        {bulkPost?.publishDate && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Scheduled: {formatDateTime(bulkPost.publishDate)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export const BulkPostPreviewSection: React.FC<BulkPostPreviewSectionProps> = memo(({ 
  bulkId, 
  onBack 
}) => {
  const { bulkPost, loading, error } = useBulkPostPreview(bulkId);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
          <p className="text-sm text-muted-foreground">Loading bulk post details...</p>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="w-full h-48 bg-muted rounded-lg"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
          <p className="text-sm text-destructive">Error loading bulk post details: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
        <p className="text-sm text-muted-foreground">View details of the selected bulk post</p>
      </div>
      <div className="lg:col-span-1">
        <PostPreview bulkPost={bulkPost} />
      </div>
    </div>
  );
});