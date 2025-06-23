
import React, { useState } from 'react';
import { QAHeader } from './QAHeader';
import { QAFilters } from './QAFilters';
import { QASEOTipBanner } from './QASEOTipBanner';
import { QAList } from './QAList';
import { QAEmptyState } from './QAEmptyState';
import { useListingContext } from '@/context/ListingContext';
import { useToast } from '@/hooks/use-toast';

const mockQuestions = [
  {
    id: '1',
    question: 'What are your business hours on weekends?',
    listingName: 'Downtown Coffee Shop',
    location: 'New York, NY',
    userName: 'Sarah M.',
    timestamp: '2 days ago',
    status: 'unanswered' as const,
    answer: null
  },
  {
    id: '2',
    question: 'Do you offer delivery services in Brooklyn?',
    listingName: 'Downtown Coffee Shop',
    location: 'New York, NY',
    userName: 'Mike Johnson',
    timestamp: '5 days ago',
    status: 'answered' as const,
    answer: 'Yes, we offer delivery services throughout Brooklyn and Manhattan. Our delivery partners cover most areas within 5 miles of our downtown NYC location.'
  },
  {
    id: '3',
    question: 'Is parking available near your restaurant?',
    listingName: 'Italian Bistro',
    location: 'Brooklyn, NY',
    userName: 'Anonymous',
    timestamp: '1 week ago',
    status: 'unanswered' as const,
    answer: null
  }
];

export const QAManagementPage: React.FC = () => {
  const { selectedListing } = useListingContext();
  const { toast } = useToast();
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');
  const [showTipBanner, setShowTipBanner] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter questions by selected listing
  const listingQuestions = selectedListing 
    ? questions.filter(q => q.listingName === selectedListing.name)
    : questions;

  const filteredQuestions = listingQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.listingName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Q&A data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh Q&A data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!selectedListing) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Listing Selected
          </h2>
          <p className="text-gray-600">Please select a business listing to view Q&A.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QAHeader />
      
      <QAFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {showTipBanner && (
        <QASEOTipBanner onDismiss={() => setShowTipBanner(false)} />
      )}

      {filteredQuestions.length > 0 ? (
        <QAList questions={filteredQuestions} />
      ) : (
        <QAEmptyState hasQuestions={listingQuestions.length > 0} />
      )}
    </div>
  );
};
