import React, { createContext, ReactNode, useContext } from 'react';

// Define the type of your context
interface ApiContextType {
  apiUrl: string;
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Create a provider component
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  // Use environment variable from .env
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://127.0.0.1:8000';

  return (
    <ApiContext.Provider value={{ apiUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for easier usage
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
