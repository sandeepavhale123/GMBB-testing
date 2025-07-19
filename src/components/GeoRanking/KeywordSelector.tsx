
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';
import { Loader } from '../ui/loader';
import { KeywordData, KeywordDetailsResponse } from '../../api/geoRankingApi';

interface KeywordSelectorProps {
  keywords: KeywordData[];
  selectedKeyword: string;
  selectedDate: string;
  keywordDetails: KeywordDetailsResponse['data'] | null;
  onKeywordChange: (keywordId: string) => void;
  onDateChange: (dateId: string) => void;
  loading: boolean;
  keywordChanging: boolean;
  dateChanging: boolean;
  isRefreshing?: boolean;
  keywordsVersion?: number; // Add version prop to force re-renders
}

export const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  keywords,
  selectedKeyword,
  selectedDate,
  keywordDetails,
  onKeywordChange,
  onDateChange, 
  loading,
  keywordChanging,
  dateChanging,
  isRefreshing = false,
  keywordsVersion = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Add keywordsVersion to dependencies to ensure re-calculation when keywords update
  const displayedKeywords = useMemo(() => {
    console.log(`🔄 KeywordSelector: Recalculating displayed keywords (version: ${keywordsVersion}, count: ${keywords.length})`);
    const filteredKeywords = keywords.filter(keyword => 
      keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return searchTerm ? filteredKeywords : keywords;
  }, [keywords, searchTerm, keywordsVersion]);

  // Memoize available dates for the selected keyword
  const availableDates = useMemo(() => {
    return keywordDetails?.dates || [];
  }, [keywordDetails?.dates]);

  // Memoize selected keyword name for display with keywordsVersion dependency
  const selectedKeywordName = useMemo(() => {
    const selectedKeywordData = keywords.find(k => k.id === selectedKeyword);
    const name = selectedKeywordData?.keyword || '';
    console.log(`🔄 KeywordSelector: Selected keyword name updated (version: ${keywordsVersion}): ${name}`);
    return name;
  }, [keywords, selectedKeyword, keywordsVersion]);

  const handleKeywordSelect = (keywordId: string) => {
    console.log(`🔄 KeywordSelector: Keyword selected: ${keywordId}`);
    onKeywordChange(keywordId);
    setSearchTerm('');
  };

  // Log when component re-renders
  console.log(`🔄 KeywordSelector: Rendering with ${keywords.length} keywords (version: ${keywordsVersion})`);

  return (
    <div className="lg:col-span-3 space-y-3">
      <div className="text-sm text-gray-500 font-medium mb-1">Keyword</div>
      <Select 
        key={`keyword-select-${keywordsVersion}`} // Force re-render when keywords update
        value={selectedKeyword} 
        onValueChange={handleKeywordSelect} 
        disabled={isRefreshing ? false : (loading || keywordChanging)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? "Loading keywords..." : "Select keyword"}>
            {selectedKeywordName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search keywords..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>
          {displayedKeywords.length > 0 ? (
            displayedKeywords.map(keyword => (
              <SelectItem key={keyword.id} value={keyword.id}>
                {keyword.keyword}
              </SelectItem>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              {loading ? "Loading..." : "No keywords found"}
            </div>
          )}
        </SelectContent>
      </Select>

      <div>
        <Select value={selectedDate} onValueChange={onDateChange} disabled={isRefreshing ? false : (loading || availableDates.length === 0 || dateChanging)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading ? "Loading dates..." : "Select report date"} />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {availableDates.map(date => (
              <SelectItem key={date.id} value={date.id}>
                {date.date || `Report ${date.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
