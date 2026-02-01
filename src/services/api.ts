const API_URL = 'http://localhost:5000/api';

export interface PGListing {
  _id: string;
  slug?: string;
  name: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed';
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  amenities: string[];
  roomTypes?: Array<{
    type: string;
    price: number;
    available: number;
    description?: string;
  }>;
  distance: string;
  availability: 'available' | 'limited' | 'full';
  verified: boolean;
  featured: boolean;
  published: boolean;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

class PGService {
  async getListings(filters?: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    published?: boolean;
  }): Promise<PGListing[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const url = `${API_URL}/pg${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  }

  async getListing(idOrSlug: string): Promise<PGListing> {
    const response = await fetch(`${API_URL}/pg/${idOrSlug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  }

  async createListing(listingData: Partial<PGListing>) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listingData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create listing: ${response.status}`);
    }
    
    return await response.json();
  }

  async updateListing(id: string, listingData: Partial<PGListing>) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/pg/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listingData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.status}`);
    }
    
    return await response.json();
  }

  async deleteListing(id: string) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/pg/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete listing: ${response.status}`);
    }
    
    return await response.json();
  }
}

export const pgService = new PGService();