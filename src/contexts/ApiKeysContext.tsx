import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SUPPORTED_PROVIDERS } from '@/config/llmConfig';

const LOCAL_STORAGE_PREFIX = 'datapresso_';

interface ApiKeysContextType {
  apiKeys: Record<string, string>; // e.g., { openai: "sk-...", anthropic: "..." }
  saveApiKey: (providerId: string, apiKey: string) => void;
  removeApiKey: (providerId: string) => void;
  getApiKey: (providerId: string) => string | null;
  isKeyStored: (providerId: string) => boolean;
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

export const ApiKeysProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  // Load keys from localStorage on initial mount
  useEffect(() => {
    const loadedKeys: Record<string, string> = {};
    SUPPORTED_PROVIDERS.forEach(provider => {
      if (provider.requiresApiKey) {
        try {
          const storedKey = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${provider.id}_api_key`);
          if (storedKey) {
            loadedKeys[provider.id] = storedKey;
          }
        } catch (error) {
          console.error(`Error loading API key for ${provider.name} from localStorage:`, error);
          // Consider a user-facing error if critical, e.g., toast.error("无法加载API密钥配置");
        }
      }
    });
    setApiKeys(loadedKeys);
  }, []);

  const saveApiKey = (providerId: string, apiKey: string) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${providerId}_api_key`, apiKey);
      setApiKeys(prevKeys => ({ ...prevKeys, [providerId]: apiKey }));
    } catch (error) {
      console.error(`Error saving API key for ${providerId} to localStorage:`, error);
      // Consider a user-facing error, e.g., toast.error("保存API密钥失败，存储可能已满");
    }
  };

  const removeApiKey = (providerId: string) => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${providerId}_api_key`);
      setApiKeys(prevKeys => {
        const newKeys = { ...prevKeys };
        delete newKeys[providerId];
        return newKeys;
      });
    } catch (error) {
      console.error(`Error removing API key for ${providerId} from localStorage:`, error);
      // Consider a user-facing error
    }
  };

  const getApiKey = (providerId: string): string | null => {
    return apiKeys[providerId] || null;
  };

  const isKeyStored = (providerId: string): boolean => {
    return !!apiKeys[providerId];
  };
  
  return (
    <ApiKeysContext.Provider value={{ apiKeys, saveApiKey, removeApiKey, getApiKey, isKeyStored }}>
      {children}
    </ApiKeysContext.Provider>
  );
};

export const useApiKeys = (): ApiKeysContextType => {
  const context = useContext(ApiKeysContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeysProvider');
  }
  return context;
};