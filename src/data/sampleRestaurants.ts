import { Restaurant } from '../types/restaurant';

// Danh sách quán ăn ban đầu để trống theo yêu cầu của bạn
export const INITIAL_RESTAURANTS: Restaurant[] = [];

// Các gợi ý ảnh món ăn chất lượng cao khi người dùng tự thêm quán
export const FOOD_PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', label: 'Bát Phở Bò nóng hổi' },
  { url: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80', label: 'Trà Sữa Trân Châu' },
  { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', label: 'Cơm Tấm Sườn Nướng' },
  { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', label: 'Cà Phê Muối / Đen Đá' },
  { url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', label: 'Bún Chả / Bún Đậu' },
  { url: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80', label: 'Bánh Tráng Trộn / Ăn Vặt' },
  { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', label: 'Lẩu Nướng / Nướng Than' },
  { url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', label: 'Món Cuốn / Bánh Xèo' }
];
