import React from 'react';
import { Upload, Image, Video, FileText, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BulkMedia: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Media Management</h1>
          <p className="text-muted-foreground">Upload and organize media across multiple listings</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Image className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">342</div>
                <div className="text-sm text-muted-foreground">Images</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm text-muted-foreground">Videos</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">67</div>
                <div className="text-sm text-muted-foreground">Documents</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Folders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Media Library</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border hover:border-primary cursor-pointer transition-colors">
                  <Image className="w-8 h-8 text-muted-foreground" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};