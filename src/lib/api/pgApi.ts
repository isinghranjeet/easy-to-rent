const API_URL = 'http://localhost:5000/api';

export interface PGListing {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  amenities: string[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  createdAt: string;
  slug?: string;
  distance?: string;
  published?: boolean;
  locality?: string;
}

export const fetchPGListings = async (filters?: any): Promise<PGListing[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const url = `${API_URL}/pg${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching PG listings:', error);
    throw error;
  }
};

export const fetchPGDetails = async (slug: string): Promise<PGListing> => {
  try {
    const response = await fetch(`${API_URL}/pg/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('PG not found');
      }
      throw new Error(`Failed to fetch PG details: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching PG details:', error);
    throw error;
  }
};

export const createPGListing = async (data: FormData): Promise<PGListing> => {
  try {
    const response = await fetch(`${API_URL}/pg`, {
      method: 'POST',
      body: data,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create listing: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error creating PG listing:', error);
    throw error;
  }
};

export const updatePGListing = async (id: string, data: Partial<PGListing>): Promise<PGListing> => {
  try {
    const response = await fetch(`${API_URL}/pg/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error updating PG listing:', error);
    throw error;
  }
};

export const deletePGListing = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/pg/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete listing: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting PG listing:', error);
    throw error;
  }
};