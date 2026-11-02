import { apiClient } from '@/lib/api';

const API_URL = '/gallery/';

export interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  item_type: 'publication' | 'poem';
  media_type: 'image' | 'video' | 'document' | 'text';
  media_file: string | null;
  thumbnail: string | null;
  content: string | null;
  author: string | null;
  published_date: string;
  created_at: string;
  updated_at: string;
  publisher?: string;
  publication_date?: string | null;
  isbn?: string;
  poem?: number;
  poem_details?: {
    id: number;
    title: string;
    author: string;
    content: string | null;
    media_type: string;
    media_file: string | null;
  };
}

export const fetchGalleryItems = async (type?: 'publication' | 'poem'): Promise<GalleryItem[]> => {
  try {
    const params = type ? { type } : {};
    const response = await apiClient.get<GalleryItem[]>(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

export const fetchGalleryItem = async (id: number): Promise<GalleryItem> => {
  try {
    const response = await apiClient.get<GalleryItem>(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching gallery item ${id}:`, error);
    throw error;
  }
};
