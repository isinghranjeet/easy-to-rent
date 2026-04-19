import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (pgId: string) => boolean;
  addToWishlist: (pgId: string) => Promise<void>;
  removeFromWishlist: (pgId: string) => Promise<void>;
  toggleWishlist: (pgId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
  syncWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load wishlist from backend when authenticated, else from localStorage
  const syncWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      // Guest mode - load from localStorage
      try {
        const saved = localStorage.getItem('pg-wishlist-guest');
        const guestWishlist = saved ? JSON.parse(saved) : [];
        setWishlist(guestWishlist);
      } catch (error) {
        console.error('Error loading guest wishlist:', error);
        setWishlist([]);
      }
      return;
    }

    // Authenticated mode - load from backend
    try {
      setLoading(true);
      const response = await api.getWishlist();
      if (response.success && response.data) {
        // Extract PG IDs from wishlist items
        const wishlistIds = response.data.map((item: any) => item._id);
        setWishlist(wishlistIds);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load wishlist on auth change
  useEffect(() => {
    syncWishlist();
  }, [syncWishlist, isAuthenticated, user?._id]);

  // Save guest wishlist to localStorage
  const saveGuestWishlist = useCallback((newWishlist: string[]) => {
    try {
      localStorage.setItem('pg-wishlist-guest', JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Error saving guest wishlist:', error);
    }
  }, []);

  const isInWishlist = useCallback((pgId: string) => {
    return wishlist.includes(pgId);
  }, [wishlist]);

  const addToWishlist = useCallback(async (pgId: string) => {
    if (!isAuthenticated) {
      // Guest mode - save to localStorage
      setWishlist(prev => {
        if (!prev.includes(pgId)) {
          const newWishlist = [...prev, pgId];
          saveGuestWishlist(newWishlist);
          toast.success('Added to wishlist', { description: 'Login to save permanently' });
          return newWishlist;
        }
        return prev;
      });
      return;
    }

    // Authenticated mode - call backend API
    try {
      setLoading(true);
      await api.addToWishlist(pgId);
      setWishlist(prev => {
        if (!prev.includes(pgId)) {
          return [...prev, pgId];
        }
        return prev;
      });
      toast.success('Added to wishlist');
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist', { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, saveGuestWishlist]);

  const removeFromWishlist = useCallback(async (pgId: string) => {
    if (!isAuthenticated) {
      // Guest mode - remove from localStorage
      setWishlist(prev => {
        const newWishlist = prev.filter(id => id !== pgId);
        saveGuestWishlist(newWishlist);
        toast.success('Removed from wishlist');
        return newWishlist;
      });
      return;
    }

    // Authenticated mode - call backend API
    try {
      setLoading(true);
      await api.removeFromWishlist(pgId);
      setWishlist(prev => prev.filter(id => id !== pgId));
      toast.success('Removed from wishlist');
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist', { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, saveGuestWishlist]);

  const toggleWishlist = useCallback(async (pgId: string) => {
    if (isInWishlist(pgId)) {
      await removeFromWishlist(pgId);
    } else {
      await addToWishlist(pgId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      // Guest mode - clear localStorage
      setWishlist([]);
      saveGuestWishlist([]);
      toast.success('Wishlist cleared');
      return;
    }

    // Authenticated mode - call backend API
    try {
      setLoading(true);
      await api.clearWishlist();
      setWishlist([]);
      toast.success('Wishlist cleared');
    } catch (error: any) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist', { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, saveGuestWishlist]);

  const value = {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    loading,
    syncWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};