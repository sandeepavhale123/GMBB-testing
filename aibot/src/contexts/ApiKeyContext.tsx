import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApiKeyForSearch } from '@/api/businessSearchApi';

interface ApiKeyContextType {
  apiKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

interface ApiKeyProviderProps {
  children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getApiKeyForSearch();
        
        if (response.code === 200 && response.data?.apikey) {
          setApiKey(response.data.apikey);
        } else {
          setError('Failed to fetch API key');
        }
      } catch (err) {
        setError('Error fetching API key');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, isLoading, error }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeyContext = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  // Return a safe fallback when provider is not mounted (e.g., on public routes)
  return context ?? { apiKey: null, isLoading: false, error: null };
};
