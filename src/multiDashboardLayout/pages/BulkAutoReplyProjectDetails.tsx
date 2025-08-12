import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainBody } from '../components/MainBody';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { BulkTemplateManager } from '@/components/BulkAutoReply/BulkTemplateManager';
import { BulkAIConfigurationManager } from '@/components/BulkAutoReply/BulkAIConfigurationManager';
import { ProjectListingsTable } from '@/components/BulkAutoReply/ProjectListingsTable';
import { useGetBulkProjectDetailsMutation } from '@/api/bulkAutoReplyApi';
import { toast } from '@/hooks/use-toast';

export const BulkAutoReplyProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [getBulkProjectDetails, { data: projectData, isLoading, error }] = useGetBulkProjectDetailsMutation();

  useEffect(() => {
    if (projectId) {
      getBulkProjectDetails({ projectId });
    }
  }, [projectId, getBulkProjectDetails]);

  const handleSaveChanges = () => {
    // TODO: Implement save changes functionality
    toast({
      title: "Save Changes",
      description: "Changes saved successfully!",
    });
  };

  const handleAISettingsSave = (settings: any) => {
    // TODO: Implement AI settings save functionality
    console.log('Saving AI settings:', settings);
  };

  // Get project type from the data
  const projectType = projectData?.data?.project?.type;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load project details</p>
          <Button 
            onClick={() => projectId && getBulkProjectDetails({ projectId })}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData?.data?.project?.projectName || 'Project Details'}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage auto-reply templates and locations for this project
            </p>
          </div>
          <Button 
            onClick={handleSaveChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Conditional Layout Based on Project Type */}
        {projectType === 'template' ? (
          /* Template Project: 2-Column Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: Template Manager */}
            <div className="space-y-6">
              <BulkTemplateManager autoSettings={projectData?.data?.autoSettings} />
            </div>

            {/* Column 2: Locations Table */}
            <div className="space-y-6">
              <ProjectListingsTable 
                showAddModal={showAddLocationModal}
                onCloseAddModal={() => setShowAddLocationModal(false)}
                listingDetails={projectData?.data?.listingDetails}
              />
            </div>
          </div>
        ) : projectType === 'ai' ? (
          /* AI Project: 2-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Configuration Manager */}
            <BulkAIConfigurationManager 
              autoAiSettings={projectData?.data?.autoSettings}
              onSave={handleAISettingsSave}
              isEnabled={aiEnabled}
              onToggle={setAiEnabled}
            />
            
            {/* Locations Table */}
            <ProjectListingsTable 
              showAddModal={showAddLocationModal}
              onCloseAddModal={() => setShowAddLocationModal(false)}
              listingDetails={projectData?.data?.listingDetails}
            />
          </div>
        ) : (
          /* Fallback for unknown project types */
          <div className="text-center py-12">
            <p className="text-gray-600">Unsupported project type: {projectType}</p>
          </div>
        )}
      </div>
  );
};