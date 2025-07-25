import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Plus, X, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getKeywordSearchVolume, KeywordSearchData } from '../../api/geoRankingApi';
import { useToast } from '../../hooks/use-toast';
interface AddKeywordsPageProps {
  onAddKeywords: (keywords: string[]) => void;
  isLoading?: boolean;
}
interface RecommendedKeyword {
  keyword: string;
  searches: number;
  localPack?: boolean;
  competition?: string;
}
const recommendedKeywords: RecommendedKeyword[] = [];
export const AddKeywordsPage: React.FC<AddKeywordsPageProps> = ({
  onAddKeywords
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<RecommendedKeyword[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleAddKeyword = () => {
    const trimmedKeyword = keywordInput.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword) && keywords.length < 5) {
      setKeywords(prev => [...prev, trimmedKeyword]);
      setKeywordInput('');
    }
  };
  const handleSearchKeyword = async () => {
    const trimmedKeyword = keywordInput.trim();
    if (!trimmedKeyword) return;
    setIsSearching(true);
    try {
      const response = await getKeywordSearchVolume({
        keywords: [trimmedKeyword]
      });
      if (response.code === 200) {
        const newResults: RecommendedKeyword[] = response.data.map((item: KeywordSearchData) => ({
          keyword: item.keyword,
          searches: item.search_volume,
          competition: item.competition,
          localPack: false
        }));
        setSearchResults(newResults);
        setKeywordInput('');
        toast({
          title: "Keywords Found",
          description: `Found ${newResults.length} keyword(s) with search data.`
        });
      }
    } catch (error: any) {
      console.error('Keyword search error:', error);
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Unable to fetch keyword data. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSearching(false);
    }
  };
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(prev => prev.filter(keyword => keyword !== keywordToRemove));
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };
  const handleAddRecommended = (keyword: string) => {
    if (!keywords.includes(keyword) && keywords.length < 5) {
      setKeywords(prev => [...prev, keyword]);
    }
  };
  const handleCheckPosition = () => {
    if (keywords.length > 0) {
      onAddKeywords(keywords);
      navigate(-1); // Go back to previous page
    }
  };
  return <div className="bg-background p-4 sm:p-6 h-[90vh]">
      <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

        <div className="py-[20px] px-[30px] border border-border rounded-lg bg-white  mb-4">
        {/* Header */}
        <div className="flex items-center justify-between text-base sm:text-lg font-medium text-foreground mb-6 sm:mb-8">
          <div className="flex items-center mb-0">
            <Search className="h-5 w-5 text-primary" />
            Search keyword
          </div>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search keyword" value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyPress={handleKeyPress} className="pl-10 h-12" disabled={keywords.length >= 5} />
          </div>
          <Button onClick={handleSearchKeyword} disabled={!keywordInput.trim() || keywords.length >= 5 || isSearching} className="h-12 px-6 w-full sm:w-auto">
            {isSearching ? 'Searching...' : 'Search Keyword'}
          </Button>
        </div>
          </div>


        {/* Added Keywords */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-1.5 text-sm">
              {keyword}
              <button onClick={() => handleRemoveKeyword(keyword)} className="hover:bg-muted rounded-full p-0.5 transition-colors" aria-label={`Remove ${keyword}`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>)}
          </div>
          {keywords.length > 0 && <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-sm text-muted-foreground">
                {keywords.length}/5
              </span>
              <Button onClick={handleCheckPosition} size="sm" className="h-8 px-4 whitespace-nowrap" disabled={isLoading}>
                {isLoading ? "Adding Keywords..." : "Check Current Rank"}
              </Button>
            </div>}
        </div>


        {/* Recommended Keywords */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recommended keywords
          </h3>
          <div className="space-y-3">
            {isSearching ?
          // Skeleton loaders during API call
          Array.from({
            length: 3
          }).map((_, index) => <div key={`skeleton-${index}`} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                </div>) :
          // Display combined results: search results first, then recommended
          [...searchResults, ...recommendedKeywords].map((item, index) => <div key={`keyword-${index}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{item.keyword}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex flex-col sm:text-right gap-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                        <span className="whitespace-nowrap">~ {item.searches.toLocaleString()} searches</span>
                        {item.competition && <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Competition:</span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${item.competition === 'LOW' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : item.competition === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : item.competition === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-muted text-muted-foreground'}`}>
                              {item.competition}
                            </span>
                          </div>}
                        {item.localPack && <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-primary">Local pack</span>
                          </div>}
                      </div>
                    </div>
                    <Button onClick={() => handleAddRecommended(item.keyword)} size="sm" variant="outline" disabled={keywords.includes(item.keyword) || keywords.length >= 5} className="w-8 h-8 p-0 self-end sm:self-center">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>)}
          </div>
        </div>

        {/* Bottom Note */}
        
      </div>
    </div>;
};