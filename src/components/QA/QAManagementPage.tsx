
import React, { useState } from 'react';
import { QAHeader } from './QAHeader';
import { QAFilters } from './QAFilters';
import { QASEOTipBanner } from './QASEOTipBanner';
import { QAList } from './QAList';
import { QAEmptyState } from './QAEmptyState';
import { CreateQAModal } from './CreateQAModal';
import { useListingContext } from '@/context/ListingContext';

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
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');
  const [showTipBanner, setShowTipBanner] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const unansweredCount = listingQuestions.filter(q => q.status === 'unanswered').length;

  const handleAddQA = (question: string, answer: string) => {
    const newQA = {
      id: Date.now().toString(),
      question,
      listingName: selectedListing?.name || 'Manual Entry',
      location: selectedListing?.address || 'Multiple Locations',
      userName: 'Admin',
      timestamp: 'Just now',
      status: 'answered' as const,
      answer
    };
    setQuestions([newQA, ...questions]);
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
        unansweredCount={unansweredCount}
        onAddQA={() => setShowCreateModal(true)}
      />

      {showTipBanner && (
        <QASEOTipBanner onDismiss={() => setShowTipBanner(false)} />
      )}

      {filteredQuestions.length > 0 ? (
        <QAList questions={filteredQuestions} />
      ) : (
        <QAEmptyState hasQuestions={listingQuestions.length > 0} />
      )}

      <CreateQAModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleAddQA}
      />
    </div>
  );
};
