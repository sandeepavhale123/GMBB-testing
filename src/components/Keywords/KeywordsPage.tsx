import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AddKeywordModal } from './AddKeywordModal';
import { KeywordsTable } from './KeywordsTable';

export interface Keyword {
  id: string;
  keyword: string;
  ranking: number | null;
  createdAt: string;
}

export const KeywordsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: '1',
      keyword: 'restaurant near me',
      ranking: 3,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      keyword: 'best pizza delivery',
      ranking: null,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      keyword: 'coffee shop downtown',
      ranking: 7,
      createdAt: '2024-01-13'
    }
  ]);

  const handleAddKeywords = (newKeywords: string[]) => {
    const newKeywordObjects = newKeywords.map(keyword => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      keyword,
      ranking: null,
      createdAt: new Date().toISOString().split('T')[0]
    }));
    
    setKeywords(prev => [...prev, ...newKeywordObjects]);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const csvContent = [
        ['Sr. No', 'Keyword', 'Ranking', 'Created At'],
        ...keywords.map((keyword, index) => [
          (index + 1).toString(),
          keyword.keyword,
          keyword.ranking?.toString() || 'Not ranked',
          keyword.createdAt
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'keywords.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(keywords, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'keywords.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keywords</h1>
          <p className="text-gray-600 mt-1">Manage and track keyword rankings for your business</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Keyword
        </Button>
      </div>

      {/* Keywords Table */}
      <KeywordsTable 
        keywords={keywords}
        onExport={handleExport}
      />

      {/* Add Keyword Modal */}
      <AddKeywordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddKeywords={handleAddKeywords}
      />
    </div>
  );
};