import React from 'react';
import { Search, X, LayoutGrid, List, UtensilsCrossed, ArrowUpDown, MessageSquareText } from 'lucide-react';
import { FilterState, RatingFilter, ViewMode } from '../types/restaurant';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  availableTags: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  availableTags,
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  const updateFilter = (updates: Partial<FilterState>) => {
    onFilterChange({ ...filter, ...updates });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 sm:px-6 space-y-3">
      {/* Top row: Search input + View modes */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search bar with Mode Toggle */}
        <div className="flex-1 max-w-2xl flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => updateFilter({ searchQuery: e.target.value })}
              placeholder={
                filter.searchMode === 'dish'
                  ? 'Tìm kiếm món ăn trong menu các quán (VD: phở, trà sữa, sườn...)'
                  : filter.searchMode === 'restaurant'
                  ? 'Tìm kiếm theo tên quán, địa chỉ, lý do...'
                  : 'Tìm tên quán HOẶC món ăn trong menu...'
              }
              className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => updateFilter({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search mode pill switch */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs self-start sm:self-auto shrink-0 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => updateFilter({ searchMode: 'all' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filter.searchMode === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => updateFilter({ searchMode: 'dish' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter.searchMode === 'dish'
                  ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <UtensilsCrossed className="w-3 h-3" />
              Tìm trong Menu
            </button>
            <button
              onClick={() => updateFilter({ searchMode: 'restaurant' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filter.searchMode === 'restaurant'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Tìm quán
            </button>
          </div>
        </div>

        {/* View mode & Sort dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={filter.sortBy}
              onChange={(e) => updateFilter({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="py-1.5 px-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="Sắp xếp danh sách"
            >
              <option value="newest">Mới nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="name">Tên quán (A - Z)</option>
              <option value="dishCount">Nhiều món trong menu nhất</option>
            </select>
          </div>

          {/* View switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Xem dạng thẻ lưới"
              aria-label="Xem dạng lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Xem dạng danh sách chi tiết"
              aria-label="Xem dạng danh sách"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('feed')}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'feed'
                  ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Thực đơn dưới dạng bài viết (Caption)"
              aria-label="Xem dạng bài viết caption"
            >
              <MessageSquareText className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-semibold">Bài viết (Caption)</span>
            </button>
            <button
              onClick={() => onViewModeChange('dishSearch')}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'dishSearch'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Khám phá và tìm kiếm món ăn"
              aria-label="Tìm kiếm món ăn"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Tìm Món</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: 3-Rating filters (Color coded) & Tag pills */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 pt-1">
        {/* Rating filter buttons with the 3 distinct colors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-400 font-medium mr-1 hidden sm:inline">Đánh giá:</span>

          <button
            onClick={() => updateFilter({ rating: 'all' })}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter.rating === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            Tất cả mức
          </button>

          {/* Tốt - Khung & Màu Xanh */}
          <button
            onClick={() => updateFilter({ rating: 'tot' })}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter.rating === 'tot'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300 dark:ring-emerald-800'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-400/80 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Tốt (Xanh)</span>
          </button>

          {/* Bình thường - Khung & Màu Vàng */}
          <button
            onClick={() => updateFilter({ rating: 'binh_thuong' })}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter.rating === 'binh_thuong'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs ring-2 ring-amber-300 dark:ring-amber-800'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-400 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>Bình thường (Vàng)</span>
          </button>

          {/* Tệ - Khung & Màu Xám */}
          <button
            onClick={() => updateFilter({ rating: 'te' })}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter.rating === 'te'
                ? 'bg-slate-600 text-white border-slate-600 shadow-xs ring-2 ring-slate-300 dark:ring-slate-700'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-400 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
            <span>Tệ (Xám)</span>
          </button>
        </div>

        {/* Tag pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
          <span className="text-xs text-zinc-400 font-medium mr-1 shrink-0 hidden sm:inline">Tag:</span>
          <button
            onClick={() => updateFilter({ tag: 'all' })}
            className={`px-2.5 py-1 rounded-md text-xs shrink-0 font-medium transition-colors cursor-pointer ${
              filter.tag === 'all'
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            Mọi thẻ
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilter({ tag: filter.tag === tag ? 'all' : tag })}
              className={`px-2.5 py-1 rounded-md text-xs shrink-0 font-medium transition-colors cursor-pointer ${
                filter.tag === tag
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
