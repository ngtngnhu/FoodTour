import React from 'react';
import {
  MapPin,
  Camera,
  Edit2,
  Trash2,
  ChevronRight,
  Info,
  Tag as TagIcon,
  ExternalLink
} from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { getRatingTheme } from '../utils/restaurantUtils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onOpenPhoto: (photoUrl: string, caption?: string) => void;
  searchQuery?: string;
  searchMode?: 'all' | 'dish' | 'restaurant';
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  onEdit,
  onDelete,
  onOpenPhoto,
  searchQuery = '',
  searchMode = 'all'
}) => {
  const theme = getRatingTheme(restaurant.rating);
  const coverUrl =
    restaurant.coverImage ||
    restaurant.photos[0]?.url ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg ${theme.borderColor} ${theme.cardBg}`}
      data-testid={`restaurant-card-${restaurant.id}`}
    >
      <div>
        {/* Top image & badges header */}
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
          <img
            src={coverUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onClick={() => onSelect(restaurant)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Rating Badge (Green, Yellow, or Gray based on prompt) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 shadow-md">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${theme.badgeBg}`}
            >
              <span>{theme.emoji}</span>
              <span>{theme.label}</span>
            </span>
          </div>

          {/* Photo count badge */}
          {restaurant.photos.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPhoto(restaurant.photos[0].url, restaurant.photos[0].caption);
              }}
              className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Xem ảnh thực tế chụp tại quán"
              aria-label={`Xem ${restaurant.photos.length} ảnh thực tế`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{restaurant.photos.length} ảnh thực tế</span>
            </button>
          )}

          {/* Tags over image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 flex-wrap">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20 flex items-center gap-1"
              >
                <TagIcon className="w-2.5 h-2.5 text-zinc-300" />
                {tag}
              </span>
            ))}
            {restaurant.tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-zinc-300 text-[10px]">
                +{restaurant.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Body content */}
        <div className="p-4 space-y-3.5">
          {/* Title and external link */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                onClick={() => onSelect(restaurant)}
                className="font-bold text-lg text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
              >
                {restaurant.name}
              </h3>
              {restaurant.address && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 line-clamp-1">
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
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shrink-0"
                title="Mở liên kết quán (Google Maps / ShopeeFood...)"
                aria-label={`Mở link quán ${restaurant.name}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Lý do đánh giá (Reasons box - User requirement) */}
          <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${theme.reasonBoxBg}`}>
            <div className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider opacity-90">
              <Info className="w-3 h-3" />
              <span>Lý do đánh giá ({theme.label}):</span>
            </div>
            {restaurant.reasons && restaurant.reasons.length > 0 ? (
              <ul className="space-y-1 list-disc list-inside">
                {restaurant.reasons.map((reason, index) => (
                  <li key={index} className="leading-relaxed">
                    <span className="font-medium">{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-zinc-400">Chưa ghi lý do cụ thể.</p>
            )}

            {restaurant.customReasonText && (
              <p className="pt-1 border-t border-black/10 dark:border-white/10 italic text-[11px] text-zinc-600 dark:text-zinc-300">
                "{restaurant.customReasonText}"
              </p>
            )}
          </div>

          {/* Review / Caption preview */}
          {restaurant.menuCaption ? (
            <div className="pt-2 border-t border-zinc-200/80">
              <div className="text-xs text-zinc-600 line-clamp-3 bg-[#FFF5F7] p-2.5 rounded-xl border border-[#FFC2D1] leading-relaxed">
                {restaurant.menuCaption}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-4 py-3 bg-zinc-50/60 dark:bg-zinc-800/40 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
        <button
          onClick={() => onSelect(restaurant)}
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Chi tiết quán</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(restaurant)}
            className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
            title="Chỉnh sửa quán ăn"
            aria-label={`Chỉnh sửa ${restaurant.name}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(restaurant.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
            title="Xóa quán ăn"
            aria-label={`Xóa quán ${restaurant.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
