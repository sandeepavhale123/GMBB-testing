
import React, { useState } from 'react';
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Show all keywords (remove the slice limitation)
  const filteredKeywords = keywords.filter(keyword => 
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayedKeywords = searchTerm ? filteredKeywords : keywords;

  // Get available dates for the selected keyword
  const availableDates = keywordDetails?.dates || [];

  // Get selected keyword name for display
  const selectedKeywordName = keywords.find(k => k.id === selectedKeyword)?.keyword || '';

  const handleKeywordSelect = (keywordId: string) => {
    onKeywordChange(keywordId);
    setSearchTerm('');
  };

  return (
    <div className="lg:col-span-3 space-y-3">
      <div className="text-sm text-gray-500 font-medium mb-1">Keyword</div>
      <Select value={selectedKeyword} onValueChange={handleKeywordSelect} disabled={loading || keywordChanging}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? "Loading keywords..." : "Select keyword"}>
            {selectedKeywordName || (loading ? "Loading keywords..." : "Select keyword")}
          </SelectValue>
          {keywordChanging && <Loader size="sm" className="ml-2" />}
        </SelectTrigger>
        <SelectContent className="z-[60]">
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
        <Select value={selectedDate} onValueChange={onDateChange} disabled={loading || availableDates.length === 0 || dateChanging}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading ? "Loading dates..." : "Select report date"} />
            {dateChanging && <Loader size="sm" className="ml-2" />}
          </SelectTrigger>
          <SelectContent className="z-[60]">
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
