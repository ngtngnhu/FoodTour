import React from 'react';
import {
  ExternalLink,
  MapPin,
  Camera,
  Edit2,
  Trash2,
  ChevronRight,
  Tag as TagIcon
} from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { getRatingTheme } from '../utils/restaurantUtils';

interface RestaurantListItemProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onOpenPhoto: (photoUrl: string, caption?: string) => void;
  searchQuery?: string;
}

export const RestaurantListItem: React.FC<RestaurantListItemProps> = ({
  restaurant,
  onSelect,
  onEdit,
  onDelete,
  onOpenPhoto,
  searchQuery = ''
}) => {
  const theme = getRatingTheme(restaurant.rating);
  const coverUrl =
    restaurant.coverImage ||
    restaurant.photos[0]?.url ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className={`rounded-2xl border-2 transition-all p-4 flex flex-col md:flex-row gap-4 shadow-xs hover:shadow-md ${theme.borderColor} ${theme.cardBg}`}
      data-testid={`restaurant-list-item-${restaurant.id}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full md:w-52 h-40 md:h-auto rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 group">
        <img
          src={coverUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
          onClick={() => onSelect(restaurant)}
        />
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 shadow-xs">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${theme.badgeBg}`}
          >
            <span>{theme.emoji}</span>
            <span>{theme.label}</span>
          </span>
        </div>

        {restaurant.photos.length > 0 && (
          <button
            onClick={() => onOpenPhoto(restaurant.photos[0].url, restaurant.photos[0].caption)}
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            aria-label={`Xem ảnh thực tế ${restaurant.name}`}
          >
            <Camera className="w-3 h-3" />
            <span>{restaurant.photos.length} ảnh</span>
          </button>
        )}
      </div>

      {/* Middle info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                onClick={() => onSelect(restaurant)}
                className="font-bold text-lg text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                {restaurant.name}
              </h3>
              {restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700 inline-flex items-center gap-1"
                >
                  <TagIcon className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
            {restaurant.address && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                <span>{restaurant.address}</span>
              </p>
            )}
          </div>

          {restaurant.link && (
            <a
              href={restaurant.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 hover:bg-emerald-50 text-xs font-medium flex items-center gap-1 shrink-0"
              aria-label={`Mở liên kết quán ${restaurant.name}`}
            >
              <span>Mở link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Lý do đánh giá */}
        <div className={`p-2.5 rounded-xl border text-xs space-y-1 ${theme.reasonBoxBg}`}>
          <span className="font-semibold text-[11px] uppercase tracking-wider block">
            Lý do đánh giá:
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {restaurant.reasons.map((reason, idx) => (
              <span key={idx} className="font-medium text-zinc-800 dark:text-zinc-200">
                • {reason}
              </span>
            ))}
          </div>
          {restaurant.customReasonText && (
            <p className="italic text-[11px] text-zinc-600 dark:text-zinc-400 pt-0.5 border-t border-black/5 dark:border-white/5">
              "{restaurant.customReasonText}"
            </p>
          )}
        </div>

        {/* Caption snippet row */}
        {restaurant.menuCaption && (
          <div className="pt-1">
            <p className="text-xs text-zinc-600 line-clamp-2 bg-[#FFF5F7] p-2 rounded-xl border border-[#FFC2D1]">
              "{restaurant.menuCaption}"
            </p>
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex md:flex-col justify-end md:justify-center items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[#FFC2D1] pt-2 md:pt-0 md:pl-4">
        <button
          onClick={() => onSelect(restaurant)}
          className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-[#FB6F92] hover:bg-[#E05377] text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
        >
          <span>Xem chi tiết</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(restaurant)}
            className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
            title="Chỉnh sửa"
            aria-label={`Chỉnh sửa ${restaurant.name}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(restaurant.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Xóa"
            aria-label={`Xóa quán ${restaurant.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
