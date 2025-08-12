import React, { useState } from 'react';
import { MainBody } from '../components/MainBody';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BulkTemplateManager } from '@/components/BulkAutoReply/BulkTemplateManager';
import { ProjectListingsTable } from '@/components/BulkAutoReply/ProjectListingsTable';

export const BulkAutoReplyProjectDetails: React.FC = () => {
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Project Details
            </h1>
            <p className="text-gray-600 mt-1">
              Manage auto-reply templates and locations for this project
            </p>
          </div>
          <Button 
            onClick={() => setShowAddLocationModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Template Manager */}
          <div className="space-y-6">
            <BulkTemplateManager />
          </div>

          {/* Column 2: Locations Table */}
          <div className="space-y-6">
            <ProjectListingsTable 
              showAddModal={showAddLocationModal}
              onCloseAddModal={() => setShowAddLocationModal(false)}
            />
          </div>
        </div>
      </div>
  );
};