
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBusinessInfo } from '../../store/slices/businessInfoSlice';
import { BusinessProfileCard } from './BusinessProfileCard';
import { BusinessTabs } from './BusinessTabs';
import { EditableBusinessHours } from './EditableBusinessHours';
import { transformBusinessInfo, transformWorkingHours, transformEditLogs } from '../../utils/businessDataTransform';

type TabType = 'business-info' | 'opening-hours' | 'edit-log';

export const BusinessManagement: React.FC = () => {
  const { listingId } = useParams();
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector(state => state.businessInfo);
  
  const [activeTab, setActiveTab] = useState<TabType>('business-info');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (listingId) {
      dispatch(fetchBusinessInfo({ listingId: parseInt(listingId) }));
    }
  }, [dispatch, listingId]);

  const businessInfo = data?.business_info || null;
  const statistics = data?.statistics || null;
  const workingHours = data?.working_hours || [];
  const editLogs = data?.edit_logs || [];

  const transformedBusinessInfo = businessInfo ? transformBusinessInfo(businessInfo) : null;
  const transformedWorkingHours = transformWorkingHours(workingHours);
  const transformedEditLogs = transformEditLogs(editLogs);

  const handleWorkingHoursSave = (hours: any) => {
    console.log('Saving working hours:', hours);
    setEditMode(false);
  };

  const handleWorkingHoursCancel = () => {
    setEditMode(false);
  };

  const handleWorkingHoursEdit = () => {
    setEditMode(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Business Info</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Profile Card */}
      <BusinessProfileCard
        businessInfo={businessInfo}
        statistics={statistics}
        isLoading={isLoading}
      />

      {/* Tab Navigation */}
      <BusinessTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="bg-white">
        {activeTab === 'business-info' && (
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : transformedBusinessInfo ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <p className="text-gray-900">{transformedBusinessInfo.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <p className="text-gray-900">{transformedBusinessInfo.category}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <p className="text-gray-900">{transformedBusinessInfo.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{transformedBusinessInfo.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <p className="text-gray-900">{transformedBusinessInfo.website || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-gray-900">{transformedBusinessInfo.description || 'No description available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>No business information available</div>
            )}
          </div>
        )}

        {activeTab === 'opening-hours' && (
          <div className="p-6">
            <EditableBusinessHours
              initialWorkingHours={transformedWorkingHours}
              editMode={editMode}
              onSave={handleWorkingHoursSave}
              onCancel={handleWorkingHoursCancel}
              onEdit={handleWorkingHoursEdit}
            />
          </div>
        )}

        {activeTab === 'edit-log' && (
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse border-b border-gray-200 pb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            ) : transformedEditLogs.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
                {transformedEditLogs.map((log, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-600">{log.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No edit history available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
