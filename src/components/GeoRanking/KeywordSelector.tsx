
import React, { useState, memo, useMemo } from 'react';
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
  keywordsVersion?: number; // Add version prop for reactivity
}

export const KeywordSelector: React.FC<KeywordSelectorProps> = memo(({
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

  // Memoize filtered keywords to prevent unnecessary recalculations
  // Include keywordsVersion in dependency array to force refresh when keywords update
  const displayedKeywords = useMemo(() => {
    console.log(`🔄 [${new Date().toISOString()}] KeywordSelector: Recalculating displayed keywords, version:`, keywordsVersion, 'total keywords:', keywords.length);
    const filteredKeywords = keywords.filter(keyword => 
      keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return searchTerm ? filteredKeywords : keywords;
  }, [keywords, searchTerm, keywordsVersion]);

  // Memoize available dates for the selected keyword
  const availableDates = useMemo(() => {
    return keywordDetails?.dates || [];
  }, [keywordDetails?.dates]);

  // Memoize selected keyword name for display
  // Include keywordsVersion to ensure it updates when keywords change
  const selectedKeywordName = useMemo(() => {
    const selectedKeywordData = keywords.find(k => k.id === selectedKeyword);
    const keywordName = selectedKeywordData?.keyword || '';
    console.log(`🎯 [${new Date().toISOString()}] KeywordSelector: Selected keyword name:`, keywordName, 'for ID:', selectedKeyword);
    return keywordName;
  }, [keywords, selectedKeyword, keywordsVersion]);

  const handleKeywordSelect = (keywordId: string) => {
    console.log(`🎯 [${new Date().toISOString()}] KeywordSelector: Keyword selected:`, keywordId);
    onKeywordChange(keywordId);
    setSearchTerm('');
  };

  console.log(`🔄 [${new Date().toISOString()}] KeywordSelector: Rendering with`, displayedKeywords.length, 'keywords, version:', keywordsVersion);

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
        <SelectContent className="z-[9999] bg-white">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search keywords..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" 
              />
            </div>
          </div>
          {displayedKeywords.length > 0 ? (
            displayedKeywords.map(keyword => (
              <SelectItem 
                key={`${keyword.id}-${keywordsVersion}`} 
                value={keyword.id}
                className="bg-white hover:bg-gray-50"
              >
                {keyword.keyword}
              </SelectItem>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 bg-white">
              {loading ? "Loading..." : "No keywords found"}
            </div>
          )}
        </SelectContent>
      </Select>

      <div>
        <Select 
          value={selectedDate} 
          onValueChange={onDateChange} 
          disabled={isRefreshing ? false : (loading || availableDates.length === 0 || dateChanging)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading ? "Loading dates..." : "Select report date"} />
          </SelectTrigger>
          <SelectContent className="z-[9999] bg-white">
            {availableDates.map(date => (
              <SelectItem 
                key={date.id} 
                value={date.id}
                className="bg-white hover:bg-gray-50"
              >
                {date.date || `Report ${date.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});
