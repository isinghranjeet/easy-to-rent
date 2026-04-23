import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { PGListing } from '@/services/api';

export interface UsePGDetailReturn {
  pg: PGListing | null;
  loading: boolean;
  error: string | null;
  similarPGs: PGListing[];
  nearbyPGs: PGListing[];
  nearbyLocations: Record<string, unknown>[];
  refetch: () => void;
}

export const usePGDetail = (slug: string | undefined): UsePGDetailReturn => {
  const [pg, setPg] = useState<PGListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarPGs, setSimilarPGs] = useState<PGListing[]>([]);
  const [nearbyPGs, setNearbyPGs] = useState<PGListing[]>([]);
  const [nearbyLocations, setNearbyLocations] = useState<Record<string, unknown>[]>([]);

  const fetchSimilarPGs = useCallback(async (city: string, currentId: string) => {
    try {
      const response = await api.getPGs({ city, limit: 4 });
      if (response.success && response.data?.items) {
        const filtered = response.data.items.filter((p) => p._id !== currentId);
        setSimilarPGs(filtered);
      }
    } catch (err) {
      console.error('Error fetching similar PGs:', err);
    }
  }, []);

  const fetchNearbyPGs = useCallback(async (city: string, currentId: string) => {
    try {
      const response = await api.getPGs({ city, limit: 20 });
      if (response.success && response.data?.items) {
        const filtered = response.data.items.filter((p) => p._id !== currentId);
        setNearbyPGs(filtered);
      }
    } catch (err) {
      console.error('Error fetching nearby PGs:', err);
    }
  }, []);

  const fetchNearbyLocations = useCallback(async (city: string) => {
    try {
      const response = await api.getLocations({ search: city, limit: 5 });
      if (response.success && response.data?.locations) {
        setNearbyLocations(response.data.locations);
      }
    } catch (err) {
      console.error('Error fetching nearby locations:', err);
    }
  }, []);

  const fetchPG = useCallback(async () => {
    if (!slug) {
      setError('No PG identifier provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response: Record<string, unknown> | undefined;

      if (slug.match(/^[0-9a-fA-F]{24}$/)) {
        try {
          response = await api.request<Record<string, unknown>>(`/api/pg/${slug}`);
        } catch (idError: unknown) {
          const err = idError instanceof Error ? idError : new Error(String(idError));
          if (err.message.includes('404')) {
            throw new Error('PG not found');
          }
          throw err;
        }
      } else {
        try {
          response = await api.request<Record<string, unknown>>(`/api/pg/slug/${slug}`);
        } catch (slugError: unknown) {
          const err = slugError instanceof Error ? slugError : new Error(String(slugError));
          if (err.message.includes('404')) {
            throw new Error('PG not found');
          }
          throw err;
        }
      }

      let pgData: PGListing | null = null;

      if (response?.data) {
        pgData = response.data;
      } else if (response?.success === false) {
        throw new Error(response.message || 'Failed to load PG');
      } else if (response) {
        pgData = response;
      } else {
        throw new Error('No data received from server');
      }

      if (pgData) {
        setPg(pgData);
        if (pgData.city) {
          fetchSimilarPGs(pgData.city, pgData._id);
          fetchNearbyLocations(pgData.city);
          fetchNearbyPGs(pgData.city, pgData._id);
        }
      }
    } catch (err) {
      console.error('Error fetching PG:', err);
      setError(err instanceof Error ? err.message : 'Failed to load PG details');
    } finally {
      setLoading(false);
    }
  }, [slug, fetchSimilarPGs, fetchNearbyPGs, fetchNearbyLocations]);

  useEffect(() => {
    fetchPG();
  }, [fetchPG]);

  return {
    pg,
    loading,
    error,
    similarPGs,
    nearbyPGs,
    nearbyLocations,
    refetch: fetchPG,
  };
};

