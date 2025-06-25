
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ListingSearchWarningProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const ListingSearchWarning: React.FC<ListingSearchWarningProps> = ({
  searchTerm,
  onClearSearch
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800 ml-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">No listings found</h3>
              <p>
                We couldn't find any listings matching your search for "{searchTerm}".
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Try the following:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Check your spelling and try again</li>
                <li>Use fewer or different keywords</li>
                <li>Try searching for a different term</li>
                <li>Clear filters and search again</li>
              </ul>
            </div>

            <div className="pt-2">
              <button 
                onClick={onClearSearch}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
