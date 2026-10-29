/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantListItem } from './components/RestaurantListItem';
import { RestaurantPostCard } from './components/RestaurantPostCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { AddEditRestaurantModal } from './components/AddEditRestaurantModal';
import { DishExplorer } from './components/DishExplorer';
import { RandomPickerModal } from './components/RandomPickerModal';
import { DataBackupModal } from './components/DataBackupModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { INITIAL_RESTAURANTS } from './data/sampleRestaurants';
import { Restaurant, FilterState, ViewMode } from './types/restaurant';
import { filterRestaurants } from './utils/restaurantUtils';
import { Utensils, Plus, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'foodie_reviews_user_restaurants_v2';

export default function App() {
  // Load saved restaurants from localStorage or fallback to INITIAL_RESTAURANTS (which is now empty)
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    try {
      // Clear legacy sample restaurants cache so user's desire to clear all is honored immediately
      if (localStorage.getItem('foodie_reviews_restaurants_v1')) {
        localStorage.removeItem('foodie_reviews_restaurants_v1');
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved restaurants from localStorage', e);
    }
    return INITIAL_RESTAURANTS; // Empty []
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    } catch (e) {
      console.error('Failed to save restaurants to localStorage', e);
    }
  }, [restaurants]);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    rating: 'all',
    tag: 'all',
    searchMode: 'all',
    sortBy: 'rating'
  });

  // Modals state
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Lightbox state
  const [lightboxData, setLightboxData] = useState<{ url: string | null; caption?: string }>({
    url: null
  });

  // Extract all distinct tags from restaurants
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    restaurants.forEach((r) => {
      r.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [restaurants]);

  // Filtered restaurants
  const filteredRestaurants = useMemo(() => {
    return filterRestaurants(restaurants, filter);
  }, [restaurants, filter]);

  // Handlers
  const handleSaveRestaurant = (saved: Restaurant) => {
    setRestaurants((prev) => {
      const existsIndex = prev.findIndex((r) => r.id === saved.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = saved;
        return updated;
      } else {
        return [saved, ...prev];
      }
    });

    if (selectedRestaurant?.id === saved.id) {
      setSelectedRestaurant(saved);
    }
  };

  const handleDeleteRestaurant = (id: string) => {
    const restaurant = restaurants.find((r) => r.id === id);
    if (!restaurant) return;
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa đánh giá quán "${restaurant.name}"?`);
    if (confirmDelete) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant(null);
      }
    }
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm(
      'Bạn có chắc chắn muốn xóa tất cả các quán ăn trong nhật ký không? Thao tác này sẽ xóa sạch danh sách để bạn tạo mới từ đầu.'
    );
    if (confirmClear) {
      setRestaurants([]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setSelectedRestaurant(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        restaurants={restaurants}
        onAddNew={() => {
          setEditingRestaurant(null);
          setIsAddModalOpen(true);
        }}
        onOpenRandom={() => setIsRandomModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onClearAll={handleClearAll}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        availableTags={availableTags}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredRestaurants.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Mode 1: Dedicated Dish Search Explorer */}
        {viewMode === 'dishSearch' ? (
          <DishExplorer
            restaurants={restaurants}
            onSelectRestaurant={(r) => setSelectedRestaurant(r)}
            initialQuery={filter.searchQuery}
          />
        ) : (
          /* Mode 2: Restaurant Grid or List view */
          <div>
            {/* Status bar */}
            <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
              <div>
                <span>Hiển thị </span>
                <strong className="text-zinc-800 dark:text-zinc-200">
                  {filteredRestaurants.length}
                </strong>
                <span> / {restaurants.length} quán ăn</span>
                {filter.rating !== 'all' && (
                  <span className="ml-1.5 font-medium">
                    (mức{' '}
                    {filter.rating === 'tot'
                      ? 'Tốt 🟢'
                      : filter.rating === 'binh_thuong'
                      ? 'Bình thường 🟡'
                      : 'Tệ ⚪'}
                    )
                  </span>
                )}
                {filter.tag !== 'all' && (
                  <span className="ml-1 font-medium text-emerald-600">#{filter.tag}</span>
                )}
                {filter.searchQuery && (
                  <span className="ml-1 text-zinc-400">với từ khóa "{filter.searchQuery}"</span>
                )}
              </div>

              {/* Quick legend for the 3 colors */}
              <div className="hidden md:flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-sm border-2 border-emerald-500 bg-emerald-100"></span>
                  Khung xanh: Tốt
                </span>
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-sm border-2 border-amber-400 bg-amber-100"></span>
                  Khung vàng: Bình thường
                </span>
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm border-2 border-slate-400 bg-slate-200"></span>
                  Khung xám: Tệ
                </span>
              </div>
            </div>

            {/* Empty state */}
            {filteredRestaurants.length === 0 ? (
              restaurants.length === 0 ? (
                /* Case 1: All restaurants were deleted, brand new diary */
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto my-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                    <Utensils className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Chưa có quán ăn nào trong nhật ký
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg mx-auto leading-relaxed">
                    Bạn đã xóa toàn bộ các quán có sẵn. Hãy bắt đầu tự thêm quán ăn đầu tiên của bạn để đánh giá theo 3 mức (🟢 Tốt - viền xanh, 🟡 Bình thường - viền vàng, ⚪ Tệ - viền xám) kèm menu và hình ảnh thực tế!
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingRestaurant(null);
                        setIsAddModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm quán ăn đầu tiên ngay</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Case 2: Filter resulted in 0 items */
                <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 shadow-xs">
                  <Utensils className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                    Không tìm thấy quán nào phù hợp
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                    Thử thay đổi bộ lọc, xóa từ khóa tìm kiếm hoặc bấm nút bên dưới để thêm quán ăn mới!
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setFilter({
                          searchQuery: '',
                          rating: 'all',
                          tag: 'all',
                          searchMode: 'all',
                          sortBy: 'newest'
                        })
                      }
                      className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold hover:bg-zinc-200 cursor-pointer"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                    <button
                      onClick={() => {
                        setEditingRestaurant(null);
                        setIsAddModalOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      + Thêm quán ăn mới
                    </button>
                  </div>
                </div>
              )
            ) : viewMode === 'grid' ? (
              /* Grid view */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={(r) => setSelectedRestaurant(r)}
                    onEdit={(r) => {
                      setEditingRestaurant(r);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteRestaurant}
                    onOpenPhoto={(url, cap) => setLightboxData({ url, caption: cap })}
                    searchQuery={filter.searchQuery}
                    searchMode={filter.searchMode}
                  />
                ))}
              </div>
            ) : viewMode === 'feed' ? (
              /* Feed view: Thực đơn dưới dạng bài viết (Caption) */
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Chế độ xem Bài viết &amp; Caption: </span>
                    Hiển thị thực đơn và đánh giá dưới dạng bài viết review hoàn chỉnh, sẵn sàng đọc hoặc sao chép để chia sẻ.
                  </div>
                </div>

                {filteredRestaurants.map((restaurant) => (
                  <RestaurantPostCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={(r) => setSelectedRestaurant(r)}
                    onEdit={(r) => {
                      setEditingRestaurant(r);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteRestaurant}
                    onOpenPhoto={(url, cap) => setLightboxData({ url, caption: cap })}
                  />
                ))}
              </div>
            ) : (
              /* List view */
              <div className="space-y-4">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantListItem
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={(r) => setSelectedRestaurant(r)}
                    onEdit={(r) => {
                      setEditingRestaurant(r);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteRestaurant}
                    onOpenPhoto={(url, cap) => setLightboxData({ url, caption: cap })}
                    searchQuery={filter.searchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button on Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-20">
        <button
          onClick={() => {
            setEditingRestaurant(null);
            setIsAddModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center cursor-pointer"
          aria-label="Thêm quán mới"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modals */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onEdit={(r) => {
            setEditingRestaurant(r);
            setIsAddModalOpen(true);
          }}
          onDelete={handleDeleteRestaurant}
          onUpdateRestaurant={handleSaveRestaurant}
          onOpenPhoto={(url, cap) => setLightboxData({ url, caption: cap })}
        />
      )}

      {isAddModalOpen && (
        <AddEditRestaurantModal
          initialRestaurant={editingRestaurant}
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingRestaurant(null);
          }}
          onSave={handleSaveRestaurant}
        />
      )}

      {isRandomModalOpen && (
        <RandomPickerModal
          restaurants={restaurants}
          isOpen={isRandomModalOpen}
          onClose={() => setIsRandomModalOpen(false)}
          onSelectRestaurant={(r) => setSelectedRestaurant(r)}
        />
      )}

      {isBackupModalOpen && (
        <DataBackupModal
          restaurants={restaurants}
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          onImportData={(imported) => setRestaurants(imported)}
        />
      )}

      {lightboxData.url && (
        <PhotoLightbox
          url={lightboxData.url}
          caption={lightboxData.caption}
          onClose={() => setLightboxData({ url: null })}
        />
      )}
    </div>
  );
}
