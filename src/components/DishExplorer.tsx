import React, { useState } from 'react';
import { Search, UtensilsCrossed, ExternalLink, Tag as TagIcon, Sparkles } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { searchDishesAcrossAllMenus, getRatingTheme, formatVND } from '../utils/restaurantUtils';

interface DishExplorerProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  initialQuery?: string;
}

const POPULAR_DISH_SUGGESTIONS = [
  'Phở',
  'Trà sữa',
  'Cơm sườn',
  'Bánh tráng',
  'Cà phê muối',
  'Lẩu Thái',
  'Nước ép',
  'Quẩy'
];

export const DishExplorer: React.FC<DishExplorerProps> = ({
  restaurants,
  onSelectRestaurant,
  initialQuery = ''
}) => {
  const [dishQuery, setDishQuery] = useState(initialQuery);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<'all' | 'tot' | 'binh_thuong' | 'te'>('all');

  const allMatching = searchDishesAcrossAllMenus(restaurants, dishQuery);

  const filteredDishes = selectedRatingFilter === 'all'
    ? allMatching
    : allMatching.filter((item) => item.restaurant.rating === selectedRatingFilter);

  return (
    <div className="space-y-6">
      {/* Banner & Intro */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Tìm kiếm món ăn xuyên suốt menu</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Hôm nay bạn thèm món gì?
          </h2>
          <p className="text-emerald-100 text-sm">
            Gõ tên bất kỳ món ăn nào (như bún, phở, trà sữa, cà phê, nướng...) để tra cứu ngay các quán có phục vụ món đó trong menu, so sánh giá tiền và chất lượng đánh giá Tốt hay Tệ!
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="mt-5 relative max-w-xl">
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={dishQuery}
            onChange={(e) => setDishQuery(e.target.value)}
            placeholder="Nhập tên món ăn cần tìm (VD: phở bò, trà sữa, sườn nướng...)"
            className="w-full pl-11 pr-4 py-3 bg-white text-zinc-900 rounded-xl shadow-md text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all font-medium"
            autoFocus
          />
        </div>

        {/* Suggestion tags */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-emerald-100 font-medium mr-1">Gợi ý tìm nhanh:</span>
          {POPULAR_DISH_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => setDishQuery(sug)}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Filter by rating pill bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5">
          <span>Tìm thấy <strong>{filteredDishes.length}</strong> món phù hợp</span>
          {dishQuery && <span className="text-zinc-400">cho từ khóa "{dishQuery}"</span>}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 mr-1 hidden sm:inline">Lọc quán:</span>
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedRatingFilter === 'all'
                ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            Tất cả ({allMatching.length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter('tot')}
            className={`px-3 py-1 rounded-lg font-semibold border transition-colors ${
              selectedRatingFilter === 'tot'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
            }`}
          >
            🟢 Quán Tốt ({allMatching.filter((m) => m.restaurant.rating === 'tot').length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter('binh_thuong')}
            className={`px-3 py-1 rounded-lg font-semibold border transition-colors ${
              selectedRatingFilter === 'binh_thuong'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            🟡 Quán Bình Thường ({allMatching.filter((m) => m.restaurant.rating === 'binh_thuong').length})
          </button>
          <button
            onClick={() => setSelectedRatingFilter('te')}
            className={`px-3 py-1 rounded-lg font-semibold border transition-colors ${
              selectedRatingFilter === 'te'
                ? 'bg-slate-600 text-white border-slate-600'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            ⚪ Quán Tệ ({allMatching.filter((m) => m.restaurant.rating === 'te').length})
          </button>
        </div>
      </div>

      {/* Dish results list */}
      {filteredDishes.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 p-6">
          <UtensilsCrossed className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            Không tìm thấy món ăn nào khớp với "{dishQuery}"
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
            Hãy thử tìm bằng từ khóa đơn giản hơn hoặc thêm món này vào menu của một quán ăn mới!
          </p>
          <button
            onClick={() => setDishQuery('')}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer"
          >
            Xem tất cả món ăn trong menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map(({ dish, restaurant }) => {
            const theme = getRatingTheme(restaurant.rating);
            return (
              <div
                key={`${restaurant.id}-${dish.id}`}
                className={`p-4 rounded-xl border-2 flex flex-col justify-between transition-all hover:shadow-md ${theme.borderColor} ${theme.cardBg}`}
              >
                <div>
                  {/* Dish name & price */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {dish.isSpecial && (
                          <span className="text-amber-500 text-xs" title="Món đặc biệt / Bán chạy">
                            ★
                          </span>
                        )}
                        <span>{dish.name}</span>
                      </h4>
                      {dish.note && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mt-0.5">
                          "{dish.note}"
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 shrink-0 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                      {formatVND(dish.price)}
                    </span>
                  </div>

                  {/* Restaurant badge with corresponding rating border & colors */}
                  <div className="mt-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500">Phục vụ tại quán:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.badgeBg}`}
                      >
                        {theme.emoji} {theme.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectRestaurant(restaurant)}
                      className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors text-left block w-full truncate cursor-pointer"
                    >
                      {restaurant.name}
                    </button>

                    {restaurant.address && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        📍 {restaurant.address}
                      </p>
                    )}

                    {/* Reasons summary */}
                    <div className="mt-2 text-[11px] p-2 rounded-lg bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-500">Đánh giá quán: </span>
                      <span>{restaurant.reasons[0] || restaurant.customReasonText || 'Chưa có ghi chú'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom link to restaurant */}
                <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {restaurant.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem quán</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
