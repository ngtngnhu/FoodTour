import React, { useState } from 'react';
import { X, Sparkles, Utensils, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { getRatingTheme, formatVND } from '../utils/restaurantUtils';

interface RandomPickerModalProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const RandomPickerModal: React.FC<RandomPickerModalProps> = ({
  restaurants,
  isOpen,
  onClose,
  onSelectRestaurant
}) => {
  if (!isOpen) return null;

  // Filter pool: default to 'tot' and 'binh_thuong' (exclude 'te' by default, with option to include)
  const [includeAverage, setIncludeAverage] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedRestaurant, setPickedRestaurant] = useState<Restaurant | null>(null);

  const eligiblePool = restaurants.filter((r) => {
    if (r.rating === 'te') return false; // Don't recommend bad restaurants!
    if (!includeAverage && r.rating === 'binh_thuong') return false;
    if (selectedTag !== 'all' && !r.tags.includes(selectedTag)) return false;
    return true;
  });

  const handleSpin = () => {
    if (eligiblePool.length === 0) return;
    setIsSpinning(true);
    setPickedRestaurant(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * eligiblePool.length);
      setPickedRestaurant(eligiblePool[randomIdx]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const theme = pickedRestaurant ? getRatingTheme(pickedRestaurant.rating) : null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="p-6 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors cursor-pointer text-white"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Vòng quay ẩm thực</span>
          </div>
          <h3 className="text-2xl font-black">Hôm nay ăn gì?</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Gợi ý ngẫu nhiên từ danh sách các quán được bạn đánh giá Tốt và Bình thường!
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Settings */}
          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={includeAverage}
                  onChange={(e) => setIncludeAverage(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Bao gồm cả quán "Bình thường" 🟡</span>
              </label>
              <span className="text-zinc-400 text-[11px] font-semibold">
                ({eligiblePool.length} quán hợp lệ)
              </span>
            </div>
          </div>

          {/* Result card */}
          {pickedRestaurant && theme ? (
            <div
              className={`p-5 rounded-2xl border-3 transition-all animate-in zoom-in-95 duration-200 ${theme.borderColor} ${theme.cardBg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.badgeBg}`}>
                  {theme.emoji} {theme.label}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {pickedRestaurant.tags.join(' • ')}
                </span>
              </div>

              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {pickedRestaurant.name}
              </h4>

              {pickedRestaurant.address && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{pickedRestaurant.address}</span>
                </p>
              )}

              {/* Lý do khen quán */}
              <div className="mt-3 p-2.5 rounded-xl bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200">
                <strong>Lý do bạn thích: </strong>
                {pickedRestaurant.reasons[0] || 'Chất lượng ngon miệng'}
              </div>

              {/* Menu highlight */}
              {pickedRestaurant.menu.length > 0 && (
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold">Món gợi ý: </span>
                  <span>
                    {pickedRestaurant.menu[0].name} ({formatVND(pickedRestaurant.menu[0].price)})
                  </span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelectRestaurant(pickedRestaurant);
                    onClose();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Xem chi tiết quán này
                </button>

                {pickedRestaurant.link && (
                  <a
                    href={pickedRestaurant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Mở Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20">
              <Utensils className="w-12 h-12 text-zinc-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Bấm nút quay để khám phá quán ăn ngon hôm nay!
              </p>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || eligiblePool.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Đang chọn ngẫu nhiên...' : 'Quay ngẫu nhiên ngay!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
