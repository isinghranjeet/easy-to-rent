import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CompareContextType {
  compareList: string[];
  isInCompare: (pgId: string) => boolean;
  addToCompare: (pgId: string) => void;
  removeFromCompare: (pgId: string) => void;
  toggleCompare: (pgId: string) => void;
  clearCompare: () => void;
  maxCompareLimit: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

interface CompareProviderProps {
  children: ReactNode;
  maxLimit?: number;
}

export const CompareProvider: React.FC<CompareProviderProps> = ({ 
  children, 
  maxLimit = 4 
}) => {
  const [compareList, setCompareList] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('pg-compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync compareList to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('pg-compare', JSON.stringify(compareList));
    } catch {}
  }, [compareList]);

  const isInCompare = useCallback((pgId: string) => {
    return compareList.includes(pgId);
  }, [compareList]);

  const addToCompare = useCallback((pgId: string) => {
    if (compareList.length >= maxLimit) {
      throw new Error(`Cannot add more than ${maxLimit} items to compare`);
    }
    setCompareList(prev => {
      if (!prev.includes(pgId)) {
        return [...prev, pgId];
      }
      return prev;
    });
  }, [compareList.length, maxLimit]);

  const removeFromCompare = useCallback((pgId: string) => {
    setCompareList(prev => prev.filter(id => id !== pgId));
  }, []);

  const toggleCompare = useCallback((pgId: string) => {
    setCompareList(prev => {
      if (prev.includes(pgId)) {
        return prev.filter(id => id !== pgId);
      } else {
        if (prev.length >= maxLimit) {
          throw new Error(`Cannot add more than ${maxLimit} items to compare`);
        }
        return [...prev, pgId];
      }
    });
  }, [maxLimit]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return (
    <CompareContext.Provider value={{ 
      compareList, 
      isInCompare, 
      addToCompare, 
      removeFromCompare, 
      toggleCompare, 
      clearCompare,
      maxCompareLimit: maxLimit 
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
};