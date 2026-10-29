import { Restaurant, RatingLevel, MenuItem, FilterState } from '../types/restaurant';

/**
 * Common quick reasons for rating restaurant
 */
export const COMMON_REASONS = {
  tot: [
    'Đồ ăn tươi ngon chuẩn vị',
    'Nước dùng/nước sốt đậm đà',
    'Giá cả rất hợp lý so với chất lượng',
    'Phục vụ nhanh nhẹn, chu đáo',
    'Không gian sạch sẽ, thoáng mát',
    'Menu đa dạng, nhiều lựa chọn',
    'Món best-seller xuất sắc',
    'Chỗ để xe rộng rãi tiện lợi'
  ],
  binh_thuong: [
    'Món ăn ở mức tạm ổn, không có gì nổi bật',
    'Giá hơi cao so với khẩu phần',
    'Khẩu vị hơi ngọt / hơi mặn',
    'Phục vụ bình thường, giờ cao điểm hơi lâu',
    'Chỗ ngồi chật hẹp, hơi nóng',
    'Chỉ ghé lại khi tiện đường'
  ],
  te: [
    'Đồ ăn không tươi / có mùi lạ',
    'Nước dùng nhạt nhẽo / nhiều mì chính',
    'Giá quá đắt so với chất lượng tệ',
    'Thái độ nhân viên thiếu lịch sự, phục vụ chậm',
    'Vệ sinh kém, bàn ghế dầu mỡ',
    'Chờ món quá lâu (trên 30 phút)',
    'Không quay lại lần thứ 2'
  ]
};

export const DEFAULT_TAGS = [
  'Quán ăn',
  'Quán nước',
  'Ăn vặt',
  'Cơm trưa',
  'Lẩu & Nướng',
  'Cà phê',
  'Trà sữa',
  'Vỉa hè',
  'Gia đình'
];

/**
 * Returns color classes and metadata for the 3 rating levels
 * Quán tốt: màu xanh
 * Bình thường: màu vàng
 * Tệ: màu xám
 */
export function getRatingTheme(rating: RatingLevel) {
  switch (rating) {
    case 'tot':
      return {
        level: 'tot' as const,
        label: 'Tốt',
        emoji: '🟢',
        borderColor: 'border-emerald-500',
        borderHoverColor: 'hover:border-emerald-600',
        bgColor: 'bg-emerald-50/50',
        cardBg: 'bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-zinc-900',
        badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
        tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        accentText: 'text-emerald-600 dark:text-emerald-400',
        reasonBoxBg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200',
        ringColor: 'ring-emerald-500',
        glowColor: 'shadow-emerald-500/10'
      };
    case 'binh_thuong':
      return {
        level: 'binh_thuong' as const,
        label: 'Bình thường',
        emoji: '🟡',
        borderColor: 'border-amber-400',
        borderHoverColor: 'hover:border-amber-500',
        bgColor: 'bg-amber-50/50',
        cardBg: 'bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/20 dark:to-zinc-900',
        badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-700',
        tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
        accentText: 'text-amber-600 dark:text-amber-400',
        reasonBoxBg: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200',
        ringColor: 'ring-amber-400',
        glowColor: 'shadow-amber-500/10'
      };
    case 'te':
    default:
      return {
        level: 'te' as const,
        label: 'Tệ',
        emoji: '⚪',
        borderColor: 'border-slate-400',
        borderHoverColor: 'hover:border-slate-500',
        bgColor: 'bg-slate-50/50',
        cardBg: 'bg-gradient-to-br from-slate-100/60 to-white dark:from-slate-900/40 dark:to-zinc-900',
        badgeBg: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600',
        tagBg: 'bg-slate-100 text-slate-600 border-slate-200',
        accentText: 'text-slate-600 dark:text-slate-400',
        reasonBoxBg: 'bg-slate-100/80 dark:bg-slate-900/40 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300',
        ringColor: 'ring-slate-400',
        glowColor: 'shadow-slate-500/10'
      };
  }
}

/**
 * Format currency VND nicely: 50000 -> "50.000 ₫"
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return '0 ₫';
  const formatted = new Intl.NumberFormat('vi-VN').format(amount);
  return `${formatted.replace(/\s+/g, ' ')} ₫`;
}

/**
 * Auto-generate a rich foodie review post / caption for a restaurant
 */
export function generateMenuCaption(restaurant: Restaurant): string {
  const ratingText =
    restaurant.rating === 'tot'
      ? '🟢 TỐT (Rất đáng thử)'
      : restaurant.rating === 'binh_thuong'
      ? '🟡 BÌNH THƯỜNG (Ăn tạm ổn)'
      : '⚪ TỆ (Không đề xuất ghé lại)';

  const lines: string[] = [];
  lines.push(`🍲 [REVIEW THỰC ĐƠN] ${restaurant.name.toUpperCase()}`);
  lines.push(`⭐ Đánh giá: ${ratingText}`);
  if (restaurant.address) {
    lines.push(`📍 Địa chỉ: ${restaurant.address}`);
  }
  lines.push('');
  lines.push('📋 THỰC ĐƠN CHI TIẾT & GIÁ CẢ:');

  if (restaurant.menu && restaurant.menu.length > 0) {
    restaurant.menu.forEach((item) => {
      const star = item.isSpecial ? ' ★ [Must-try]' : '';
      const note = item.note ? ` - ${item.note}` : '';
      lines.push(`• ${item.name} (${formatVND(item.price)})${star}${note}`);
    });
  } else {
    lines.push('• Đang cập nhật thực đơn...');
  }

  lines.push('');
  lines.push('💡 LÝ DO ĐÁNH GIÁ:');
  if (restaurant.reasons && restaurant.reasons.length > 0) {
    restaurant.reasons.forEach((r) => lines.push(`- ${r}`));
  }
  if (restaurant.customReasonText) {
    lines.push(`"${restaurant.customReasonText}"`);
  }

  if (restaurant.tags && restaurant.tags.length > 0) {
    lines.push('');
    const hashtags = restaurant.tags
      .map((t) => `#${t.replace(/\s+/g, '')}`)
      .join(' ');
    lines.push(`${hashtags} #NhatKyQuanAn #FoodReview`);
  }

  return lines.join('\n');
}

/**
 * Filter restaurants based on state criteria
 */
export function filterRestaurants(restaurants: Restaurant[], filter: FilterState): Restaurant[] {
  const query = (filter.searchQuery || '').trim().toLowerCase();

  return restaurants.filter((restaurant) => {
    // 1. Rating filter
    if (filter.rating !== 'all' && restaurant.rating !== filter.rating) {
      return false;
    }

    // 2. Tag filter
    if (filter.tag && filter.tag !== 'all') {
      const hasTag = restaurant.tags.some(
        (t) => t.toLowerCase() === filter.tag.toLowerCase()
      );
      if (!hasTag) return false;
    }

    // 3. Search query filter
    if (query) {
      if (filter.searchMode === 'dish') {
        // Search ONLY within menu dishes or dish mentions in caption
        const hasMatchingDish = restaurant.menu.some(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.note && item.note.toLowerCase().includes(query))
        );
        const matchesCaption = restaurant.menuCaption?.toLowerCase().includes(query);
        if (!hasMatchingDish && !matchesCaption) return false;
      } else if (filter.searchMode === 'restaurant') {
        // Search ONLY in restaurant name, address, notes, reasons
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesAddress = restaurant.address?.toLowerCase().includes(query);
        const matchesReasons = restaurant.reasons.some((r) => r.toLowerCase().includes(query));
        const matchesTags = restaurant.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesAddress && !matchesReasons && !matchesTags) {
          return false;
        }
      } else {
        // Default 'all': Match restaurant name, address, tags, reasons, dishes, or caption
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesAddress = restaurant.address?.toLowerCase().includes(query);
        const matchesReasons = restaurant.reasons.some((r) => r.toLowerCase().includes(query));
        const matchesTags = restaurant.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDish = restaurant.menu.some(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.note && item.note.toLowerCase().includes(query))
        );
        const matchesCaption = restaurant.menuCaption?.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesReasons && !matchesTags && !matchesDish && !matchesCaption) {
          return false;
        }
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filter.sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name, 'vi');
      case 'rating': {
        const ratingWeight: Record<RatingLevel, number> = { tot: 3, binh_thuong: 2, te: 1 };
        return ratingWeight[b.rating] - ratingWeight[a.rating];
      }
      case 'dishCount':
        return b.menu.length - a.menu.length;
      default:
        return 0;
    }
  });
}

export interface DishSearchResult {
  dish: MenuItem;
  restaurant: Restaurant;
}

/**
 * Searches and extracts dishes matching query across all restaurant menus
 */
export function searchDishesAcrossAllMenus(
  restaurants: Restaurant[],
  dishQuery: string
): DishSearchResult[] {
  const query = (dishQuery || '').trim().toLowerCase();
  const results: DishSearchResult[] = [];

  for (const restaurant of restaurants) {
    for (const item of restaurant.menu) {
      if (
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.note && item.note.toLowerCase().includes(query))
      ) {
        results.push({
          dish: item,
          restaurant
        });
      }
    }
  }

  // Sort by rating of restaurant (Tốt first, then Bình thường, then Tệ)
  const ratingWeight: Record<RatingLevel, number> = { tot: 3, binh_thuong: 2, te: 1 };
  results.sort((a, b) => ratingWeight[b.restaurant.rating] - ratingWeight[a.restaurant.rating]);

  return results;
}

/**
 * Calculate price range of a menu
 */
export function getPriceRange(menu: MenuItem[]): { min: number; max: number; average: number } {
  if (!menu || menu.length === 0) return { min: 0, max: 0, average: 0 };
  const prices = menu.map((m) => m.price).filter((p) => p > 0);
  if (prices.length === 0) return { min: 0, max: 0, average: 0 };
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
  return { min, max, average };
}
