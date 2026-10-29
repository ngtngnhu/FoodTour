import React from 'react';
import { Search, X, LayoutGrid, List, ArrowUpDown, MessageSquareText } from 'lucide-react';
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
    <div className="bg-white/95 border-b border-[#FFC2D1] py-3.5 px-4 sm:px-6 space-y-3 shadow-2xs">
      {/* Top row: Search input + View modes */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search bar */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="w-4 h-4 text-[#FB6F92] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
            placeholder="Tìm kiếm tên quán, địa chỉ, lý do, bài viết review..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-[#FFF5F7] border border-[#FFC2D1] rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FB6F92]/20 focus:border-[#FB6F92] transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => updateFilter({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode & Sort dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-[#B82B55]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FB6F92]" />
            <select
              value={filter.sortBy}
              onChange={(e) => updateFilter({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="py-1.5 px-2 bg-[#FFF5F7] border border-[#FFC2D1] rounded-xl text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#FB6F92]"
              aria-label="Sắp xếp danh sách"
            >
              <option value="newest">Mới nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="name">Tên quán (A - Z)</option>
            </select>
          </div>

          {/* View switcher */}
          <div className="flex bg-[#FFE5EC] p-0.5 rounded-xl text-xs border border-[#FFC2D1]">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#FB6F92] text-white shadow-xs'
                  : 'text-[#B82B55] hover:text-zinc-900'
              }`}
              title="Xem dạng thẻ lưới"
              aria-label="Xem dạng lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-[#FB6F92] text-white shadow-xs'
                  : 'text-[#B82B55] hover:text-zinc-900'
              }`}
              title="Xem dạng danh sách chi tiết"
              aria-label="Xem dạng danh sách"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('feed')}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 px-2.5 ${
                viewMode === 'feed'
                  ? 'bg-[#FB6F92] text-white font-bold shadow-xs'
                  : 'text-[#B82B55] hover:text-zinc-900'
              }`}
              title="Thực đơn dưới dạng bài viết (Caption)"
              aria-label="Xem dạng bài viết caption"
            >
              <MessageSquareText className="w-4 h-4" />
              <span className="text-xs font-semibold">Bài viết (Caption)</span>
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
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              filter.rating === 'all'
                ? 'bg-[#FB6F92] text-white border-[#FB6F92] shadow-xs ring-2 ring-[#FFC2D1]'
                : 'bg-[#FFE5EC] text-[#B82B55] border-[#FFC2D1] hover:bg-[#FFD7E2]'
            }`}
          >
            Tất cả mức
          </button>

          {/* Tốt - Khung & Màu Xanh */}
          <button
            onClick={() => updateFilter({ rating: 'tot' })}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter.rating === 'tot'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-700 border-emerald-400/80 hover:bg-emerald-100'
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
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 border-amber-400 hover:bg-amber-100'
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
                ? 'bg-slate-600 text-white border-slate-600 shadow-xs ring-2 ring-slate-300'
                : 'bg-slate-100 text-slate-700 border-slate-400 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
            <span>Tệ (Xám)</span>
          </button>
        </div>

        {/* Tag pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
          <span className="text-xs text-[#B82B55] font-semibold mr-1 shrink-0 hidden sm:inline">Tag:</span>
          <button
            onClick={() => updateFilter({ tag: 'all' })}
            className={`px-2.5 py-1 rounded-lg text-xs shrink-0 font-semibold transition-colors cursor-pointer border ${
              filter.tag === 'all'
                ? 'bg-[#FB6F92] text-white border-[#FB6F92] shadow-2xs'
                : 'bg-[#FFE5EC] text-[#B82B55] border-[#FFC2D1] hover:bg-[#FFD7E2]'
            }`}
          >
            Mọi thẻ
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilter({ tag: filter.tag === tag ? 'all' : tag })}
              className={`px-2.5 py-1 rounded-lg text-xs shrink-0 font-medium transition-colors cursor-pointer border ${
                filter.tag === tag
                  ? 'bg-[#FB6F92] text-white border-[#FB6F92] shadow-2xs font-semibold'
                  : 'bg-[#FFE5EC] text-[#B82B55] border-[#FFC2D1] hover:bg-[#FFD7E2]'
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
