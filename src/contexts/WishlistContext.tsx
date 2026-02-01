import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (pgId: string) => boolean;
  addToWishlist: (pgId: string) => void;
  removeFromWishlist: (pgId: string) => void;
  toggleWishlist: (pgId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('pg-wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync wishlist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('pg-wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const isInWishlist = useCallback((pgId: string) => {
    return wishlist.includes(pgId);
  }, [wishlist]);

  const addToWishlist = useCallback((pgId: string) => {
    setWishlist(prev => {
      if (!prev.includes(pgId)) {
        return [...prev, pgId];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((pgId: string) => {
    setWishlist(prev => prev.filter(id => id !== pgId));
  }, []);

  const toggleWishlist = useCallback((pgId: string) => {
    setWishlist(prev => {
      if (prev.includes(pgId)) {
        return prev.filter(id => id !== pgId);
      } else {
        return [...prev, pgId];
      }
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      isInWishlist, 
      addToWishlist, 
      removeFromWishlist, 
      toggleWishlist, 
      clearWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};