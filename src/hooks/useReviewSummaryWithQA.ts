import { useAppSelector, useAppDispatch } from './useRedux';
import { useListingContext } from '@/context/ListingContext';
import { useEffect } from 'react';
import { fetchReviewSummary } from '../store/slices/reviews';

export interface UseReviewSummaryWithQAReturn {
  // Review data
  summaryCards: any;
  starDistribution: any;
  sentimentAnalysis: any;
  
  // Q&A data
  qaData: { totalQuestion: number; totalAnswer: number; } | null;
  totalQuestions: number;
  totalAnswers: number;
  pendingQuestions: number;
  responseRate: number;
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Refetch function
  refetch: () => void;
}

export const useReviewSummaryWithQA = (listingId: number | null): UseReviewSummaryWithQAReturn => {
  const dispatch = useAppDispatch();
  const { 
    summaryCards, 
    starDistribution, 
    sentimentAnalysis, 
    qaData,
    summaryLoading, 
    summaryError 
  } = useAppSelector((state) => state.reviews);

  const refetch = () => {
    if (listingId) {
      dispatch(fetchReviewSummary(listingId.toString()));
    }
  };

  useEffect(() => {
    if (listingId) {
      dispatch(fetchReviewSummary(listingId.toString()));
    }
  }, [dispatch, listingId]);

  const totalQuestions = qaData?.totalQuestion || 0;
  const totalAnswers = qaData?.totalAnswer || 0;
  const pendingQuestions = totalQuestions - totalAnswers;
  const responseRate = totalQuestions > 0 ? Math.round((totalAnswers / totalQuestions) * 100) : 0;

  return {
    // Review data
    summaryCards,
    starDistribution,
    sentimentAnalysis,
    
    // Q&A data
    qaData,
    totalQuestions,
    totalAnswers,
    pendingQuestions,
    responseRate,
    
    // Loading and error states
    loading: summaryLoading,
    error: summaryError,
    
    // Refetch function
    refetch,
  };
};