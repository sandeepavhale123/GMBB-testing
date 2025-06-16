
import React, { useState } from 'react';
import { QAHeader } from './QAHeader';
import { QAFilters } from './QAFilters';
import { QASEOTipBanner } from './QASEOTipBanner';
import { QAList } from './QAList';
import { QAEmptyState } from './QAEmptyState';

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
  const [questions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');
  const [showTipBanner, setShowTipBanner] = useState(true);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.listingName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || question.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const unansweredCount = questions.filter(q => q.status === 'unanswered').length;

  return (
    <div className="space-y-6">
      <QAHeader />
      
      <QAFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        unansweredCount={unansweredCount}
      />

      {showTipBanner && (
        <QASEOTipBanner onDismiss={() => setShowTipBanner(false)} />
      )}

      {filteredQuestions.length > 0 ? (
        <QAList questions={filteredQuestions} />
      ) : (
        <QAEmptyState hasQuestions={questions.length > 0} />
      )}
    </div>
  );
};
