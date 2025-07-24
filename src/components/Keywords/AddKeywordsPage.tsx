import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, X, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface AddKeywordsPageProps {
  onAddKeywords: (keywords: string[]) => void;
}
interface RecommendedKeyword {
  keyword: string;
  searches: number;
  localPack: boolean;
}
const recommendedKeywords: RecommendedKeyword[] = [{
  keyword: "Restaurants",
  searches: 61000,
  localPack: false
}, {
  keyword: "Auto repair shop",
  searches: 1900,
  localPack: true
}, {
  keyword: "Cafe nearby",
  searches: 13000,
  localPack: true
}, {
  keyword: "Cafe in lucknow",
  searches: 3400,
  localPack: true
}, {
  keyword: "Bar & grill",
  searches: 400,
  localPack: true
}];
export const AddKeywordsPage: React.FC<AddKeywordsPageProps> = ({
  onAddKeywords
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const navigate = useNavigate();
  const handleAddKeyword = () => {
    const trimmedKeyword = keywordInput.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword) && keywords.length < 5) {
      setKeywords(prev => [...prev, trimmedKeyword]);
      setKeywordInput('');
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
  return <div className="bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between text-lg font-medium text-foreground mb-8">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Add keyword
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Search Input */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Add keyword" value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyPress={handleKeyPress} className="pl-10 h-12" disabled={keywords.length >= 5} />
          </div>
          <Button onClick={handleAddKeyword} disabled={!keywordInput.trim() || keywords.length >= 5} className="h-12 px-6">
            Add Keyword
          </Button>
        </div>


        {/* Added Keywords */}
        <div className="flex items-center gap-3 mb-6 justify-between">
          <div className="flex gap-2 ">
            {keywords.map((keyword, index) => <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-1.5 text-sm">
              {keyword}
              <button onClick={() => handleRemoveKeyword(keyword)} className="hover:bg-muted rounded-full p-0.5 transition-colors" aria-label={`Remove ${keyword}`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>)}
          </div>
          {keywords.length > 0 && <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {keywords.length}/5
              </span>
              <Button onClick={handleCheckPosition} size="sm" className="h-8 px-4">
                Check Current Rank
              </Button>
            </div>}
        </div>


        {/* Recommended Keywords */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recommended keywords
          </h3>
          <div className="space-y-3">
            {recommendedKeywords.map((item, index) => <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <span className="font-medium text-foreground">{item.keyword}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>~ {item.searches.toLocaleString()} searches</span>
                      {item.localPack && <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-primary">Local pack</span>
                        </div>}
                    </div>
                  </div>
                  <Button onClick={() => handleAddRecommended(item.keyword)} size="sm" variant="outline" disabled={keywords.includes(item.keyword) || keywords.length >= 5} className="w-8 h-8 p-0">
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