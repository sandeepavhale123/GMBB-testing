
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { RefreshCcw, Copy, Sparkles } from 'lucide-react';
import { CircularProgress } from '../ui/circular-progress';
import { KeywordDetailsResponse } from '../../api/geoRankingApi';

interface MetricsCardsProps {
  keywordDetails: KeywordDetailsResponse['data'] | null;
  totalKeywords: number;
  onCheckRank: () => void;
  isShareableView?: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  keywordDetails,
  totalKeywords,
  onCheckRank,
  isShareableView = false,
}) => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  
  // Use ATRP for Overall Visibility as requested
  const overallVisibility = keywordDetails?.rankStats?.atrp || '6.20';
  const visibilityValue = parseFloat(overallVisibility);

  const handleGetInsights = () => {
    // Get keyword data from keywordDetails.projectDetails
    const keyword = keywordDetails?.projectDetails?.keyword || '';
    const keywordId = keywordDetails?.projectDetails?.id || '';
    
    // Navigate with keyword parameters
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (keywordId) params.set('keywordId', keywordId);
    
    navigate(`/ai-chatbot/${listingId || 'default'}?${params.toString()}`);
  };

  return (
    <>
      {/* Overall Visibility Card - Using ATRP */}
      <div className={isShareableView ? 'lg:col-span-5' : 'lg:col-span-3'}>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 py-8 rounded-lg h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="text-xs text-blue-600 font-medium mb-1">Overall Visibility</div>
              <div className="text-2xl font-bold text-blue-900">{overallVisibility}</div>
            </div>
            <div className="w-12 h-12 flex-shrink-0">
              <CircularProgress value={visibilityValue} size={48} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Total Keywords Card */}
      <div className={isShareableView ? 'lg:col-span-4' : 'lg:col-span-3'}>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 py-8 rounded-lg h-full">
          <div className="text-xs text-orange-600 font-medium mb-1">Total Keywords</div>
          <div className="text-2xl font-bold text-orange-900">{totalKeywords}</div>
          {/* <div className="text-xs text-green-600">Active keywords</div> */}
        </div>
      </div>

      {/* AI Genie Recommendation Card - Hidden in shareable view */}
      {!isShareableView && (
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4  py-8 rounded-lg h-full">
            <div className="text-xs text-blue-100 font-medium mb-2 text-center">AI Genie Recommendation</div>
            <Button 
              size="sm" 
              className="w-full bg-white text-blue-600 hover:bg-blue-50 text-xs font-medium"
              onClick={handleGetInsights}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Let's Chat
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
