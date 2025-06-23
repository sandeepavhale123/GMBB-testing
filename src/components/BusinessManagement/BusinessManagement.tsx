import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBusinessInfo, refreshAndFetchBusinessInfo } from '../../store/slices/businessInfoSlice';
import { BusinessProfileCard } from './BusinessProfileCard';
import { EditableBusinessHours } from './EditableBusinessHours';
import { transformBusinessInfo, transformWorkingHours, transformEditLogs } from '../../utils/businessDataTransform';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

type TabType = 'business-info' | 'opening-hours' | 'edit-log';

export const BusinessManagement: React.FC = () => {
  const { listingId } = useParams();
  const dispatch = useAppDispatch();
  const { data, isLoading, error, isRefreshing, refreshError } = useAppSelector(state => state.businessInfo);
  const [activeTab, setActiveTab] = useState<TabType>('business-info');
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (listingId) {
      dispatch(fetchBusinessInfo({
        listingId: parseInt(listingId)
      }));
    }
  }, [dispatch, listingId]);

  const handleRefresh = async () => {
    if (listingId) {
      try {
        await dispatch(refreshAndFetchBusinessInfo({
          listingId: parseInt(listingId)
        })).unwrap();
        
        toast({
          title: "Success",
          description: "GMB profile info refreshed successfully",
          variant: "success"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to refresh business info",
          variant: "error"
        });
      }
    }
  };

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

  const formatFieldValue = (value: string | null | undefined): string => {
    return value && value.trim() !== '' ? value : '-';
  };

  if (error) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Business Info</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>;
  }

  return (
    <div className="space-y-6">
      {/* Business Profile Card with integrated tabs */}
      <BusinessProfileCard 
        businessInfo={businessInfo} 
        statistics={statistics} 
        isLoading={isLoading} 
        isRefreshing={isRefreshing}
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {activeTab === 'business-info' && (
          <div className="p-8">
            {isLoading ? (
              <div className="space-y-6">
                <div className="animate-pulse">
                  {[...Array(10)].map((_, i) => <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>)}
                </div>
              </div>
            ) : transformedBusinessInfo ? (
              <div className="space-y-6">
                {/* Business Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Name</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.name)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Address</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.address)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Phone</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.phone)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Website</span>
                    <span className="text-sm text-gray-900 w-2/3  break-all">{formatFieldValue(transformedBusinessInfo.website)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Store code</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.storeCode)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Category</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.category)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Additional category</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.additionalCategory)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Labels</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.labels)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Appointment url</span>
                    <span className="text-sm text-gray-900 w-2/3  break-all">{formatFieldValue(transformedBusinessInfo.appointmentUrl)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Map url</span>
                    <span className="text-sm text-gray-900 w-2/3  break-all">{formatFieldValue(transformedBusinessInfo.mapUrl)}</span>
                  </div>
                  
                  <div className="flex justify-between items-start py-4">
                    <span className="text-sm font-medium text-gray-700 w-1/3">Description</span>
                    <span className="text-sm text-gray-900 w-2/3 ">{formatFieldValue(transformedBusinessInfo.description)}</span>
                  </div>
                </div>

                {/* Yellow Warning Banner */}
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="flex items-center justify-between">
                      <span>To avoid getting suspended, don't add fake info to get more reviews and other policy violating content.</span>
                      <button className="flex items-center text-yellow-800 hover:text-yellow-900 font-medium">
                        Learn more
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No business information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'opening-hours' && (
          <div className="p-6">
            <EditableBusinessHours initialWorkingHours={transformedWorkingHours} editMode={editMode} onSave={handleWorkingHoursSave} onCancel={handleWorkingHoursCancel} onEdit={handleWorkingHoursEdit} />
          </div>
        )}

        {activeTab === 'edit-log' && (
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse border-b border-gray-200 pb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>)}
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
                      <span className={`px-2 py-1 text-xs rounded-full ${log.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
