import { useQuery } from '@tanstack/react-query';
import type { CreditHistoryItem } from '../types';

// Mock data - replace with actual API calls
const mockCreditHistory: CreditHistoryItem[] = [
  {
    id: '1',
    keyword: 'best pizza near me',
    rankType: 'local',
    credit: 5,
    date: '2024-01-20',
    projectName: 'Local Restaurant Campaign',
  },
  {
    id: '2',
    keyword: 'italian restaurant',
    rankType: 'organic',
    credit: 3,
    date: '2024-01-19',
    projectName: 'Local Restaurant Campaign',
  },
  {
    id: '3',
    keyword: 'dentist near me',
    rankType: 'local',
    credit: 5,
    date: '2024-01-18',
    projectName: 'Medical Practice SEO',
  },
  {
    id: '4',
    keyword: 'family doctor',
    rankType: 'local',
    credit: 5,
    date: '2024-01-17',
    projectName: 'Medical Practice SEO',
  },
];

const fetchCreditHistory = async (): Promise<CreditHistoryItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockCreditHistory;
};

export const useCreditHistory = () => {
  const query = useQuery({
    queryKey: ['credit-history'],
    queryFn: fetchCreditHistory,
  });

  return {
    creditHistory: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};