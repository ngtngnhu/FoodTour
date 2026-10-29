import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Tag as TagIcon,
  MessageSquareText,
  Share2,
  Edit2,
  Trash2,
  UtensilsCrossed,
  Sparkles,
  Camera
} from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { getRatingTheme, generateMenuCaption, formatVND } from '../utils/restaurantUtils';

interface RestaurantPostCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onOpenPhoto: (photoUrl: string, caption?: string) => void;
}

export const RestaurantPostCard: React.FC<RestaurantPostCardProps> = ({
  restaurant,
  onSelect,
  onEdit,
  onDelete,
  onOpenPhoto
}) => {
  const theme = getRatingTheme(restaurant.rating);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // The review caption / article content
  const captionText = restaurant.menuCaption || generateMenuCaption(restaurant);

  const coverUrl =
    restaurant.coverImage ||
    restaurant.photos[0]?.url ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

  const handleCopyCaption = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={`rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-lg bg-white dark:bg-zinc-900 ${theme.borderColor}`}
      data-testid={`restaurant-post-${restaurant.id}`}
    >
      {/* Post Header: Profile & Rating Badge */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-rose-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-100">
              {restaurant.name.charAt(0)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3
                onClick={() => onSelect(restaurant)}
                className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                {restaurant.name}
              </h3>
            </div>
            {restaurant.address && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                <span>{restaurant.address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Rating badge with distinct green/yellow/gray background */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-2xs ${theme.badgeBg}`}
          >
            <span>{theme.emoji}</span>
            <span>{theme.label}</span>
          </span>

          <button
            onClick={() => onEdit(restaurant)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
            title="Chỉnh sửa bài viết"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Media: Food Photo */}
      <div className="relative aspect-video sm:aspect-[21/9] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden group">
        <img
          src={coverUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover cursor-pointer group-hover:scale-102 transition-transform duration-300"
          onClick={() => onOpenPhoto(coverUrl, restaurant.name)}
        />

        {/* Photo count indicator */}
        {restaurant.photos.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPhoto(restaurant.photos[0].url, restaurant.photos[0].caption);
            }}
            className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{restaurant.photos.length} ảnh thực tế</span>
          </button>
        )}

        {/* Tags badge floating */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20 flex items-center gap-1"
            >
              <TagIcon className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Content: Menu as an Article / Caption (Thực đơn dưới dạng bài viết) */}
      <div className="p-5 space-y-4">
        {/* Caption header label with quick copy button */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Bài viết thực đơn &amp; Đánh giá quán (Caption)
            </span>
          </div>

          <button
            onClick={handleCopyCaption}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}
            title="Sao chép toàn bộ bài viết / caption này để chia sẻ"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Sao chép Caption</span>
              </>
            )}
          </button>
        </div>

        {/* Formatted Article Body */}
        <div
          className={`relative p-4 rounded-2xl border text-sm leading-relaxed font-sans whitespace-pre-wrap transition-all ${
            theme.reasonBoxBg
          } ${isExpanded ? '' : 'max-h-56 overflow-hidden'}`}
        >
          {captionText}

          {!isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent flex items-end justify-center pb-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white/90 dark:bg-zinc-800/90 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-xs hover:bg-emerald-50 cursor-pointer"
              >
                Xem toàn bộ bài viết &darr;
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="text-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-700 cursor-pointer"
            >
              Thu gọn bài viết &uarr;
            </button>
          </div>
        )}

        {/* Quick Menu Dish Pills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <UtensilsCrossed className="w-3.5 h-3.5 text-zinc-400" />
              <span>Món tiêu biểu trong menu:</span>
            </span>
            <button
              onClick={() => onSelect(restaurant)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold text-xs cursor-pointer"
            >
              Xem thực đơn đầy đủ ({restaurant.menu.length} món) &rarr;
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {restaurant.menu.slice(0, 4).map((dish) => (
              <span
                key={dish.id}
                className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
              >
                {dish.isSpecial && <span className="text-amber-500 text-[11px]">★</span>}
                <span>{dish.name}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                  {formatVND(dish.price)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Post Footer Actions */}
      <div className="px-5 py-3.5 bg-zinc-50/70 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {restaurant.link && (
            <a
              href={restaurant.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <span>Mở Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => onSelect(restaurant)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Chi tiết quán &amp; Ảnh
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyCaption}
            className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="Chia sẻ / Sao chép caption"
            aria-label="Chia sẻ caption"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(restaurant.id)}
            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa quán này"
            aria-label="Xóa quán"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
