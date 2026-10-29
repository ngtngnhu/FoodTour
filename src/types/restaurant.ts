export type RatingLevel = 'tot' | 'binh_thuong' | 'te';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  note?: string;
  isSpecial?: boolean;
}

export interface FoodPhoto {
  id: string;
  url: string;
  caption?: string;
  dateAdded?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: RatingLevel;
  reasons: string[];
  customReasonText?: string;
  tags: string[];
  link?: string;
  address?: string;
  phone?: string;
  menu: MenuItem[];
  menuCaption?: string; // Thực đơn dưới dạng bài viết (caption)
  photos: FoodPhoto[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'list' | 'feed' | 'dishSearch';

export type RatingFilter = 'all' | RatingLevel;

export interface FilterState {
  searchQuery: string;
  rating: RatingFilter;
  tag: string;
  searchMode: 'all' | 'dish' | 'restaurant';
  sortBy: 'newest' | 'name' | 'rating' | 'dishCount';
}
