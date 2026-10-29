import { Utensils, Plus, Sparkles, Download, RefreshCw, ThumbsUp, Minus, ThumbsDown, Trash2 } from 'lucide-react';
import { Restaurant } from '../types/restaurant';

interface HeaderProps {
  restaurants: Restaurant[];
  onAddNew: () => void;
  onOpenRandom: () => void;
  onOpenBackup: () => void;
  onResetSample?: () => void;
  onClearAll?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  restaurants,
  onAddNew,
  onOpenRandom,
  onOpenBackup,
  onResetSample,
  onClearAll
}) => {
  const totCount = restaurants.filter((r) => r.rating === 'tot').length;
  const binhThuongCount = restaurants.filter((r) => r.rating === 'binh_thuong').length;
  const teCount = restaurants.filter((r) => r.rating === 'te').length;
  const totalDishes = restaurants.reduce((sum, r) => sum + r.menu.length, 0);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-amber-500 to-rose-500 p-0.5 shadow-md shadow-emerald-500/10">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center">
                <Utensils className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Nhật Ký Quán Ăn
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium border border-emerald-300 dark:border-emerald-800">
                  3 Mức Đánh Giá
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Phân loại quán: <span className="text-emerald-600 font-medium">Tốt (Xanh)</span> ·{' '}
                <span className="text-amber-600 font-medium">Bình thường (Vàng)</span> ·{' '}
                <span className="text-slate-600 font-medium">Tệ (Xám)</span>
              </p>
            </div>
          </div>

          {/* Real-time stats badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Tốt: <strong>{totCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
              <Minus className="w-3.5 h-3.5" />
              <span>Bình thường: <strong>{binhThuongCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium">
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Tệ: <strong>{teCount}</strong></span>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <span>{totalDishes} món trong menu</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {restaurants.length > 0 && (
              <button
                onClick={onOpenRandom}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors cursor-pointer"
                title="Gợi ý ngẫu nhiên quán ăn ngon hôm nay"
                aria-label="Hôm nay ăn gì"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Hôm nay ăn gì?</span>
              </button>
            )}

            <button
              onClick={onOpenBackup}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              title="Sao lưu hoặc nạp dữ liệu quán ăn"
              aria-label="Sao lưu dữ liệu"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sao lưu</span>
            </button>

            {restaurants.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors cursor-pointer"
                title="Xóa tất cả các quán đang có"
                aria-label="Xóa tất cả quán"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </button>
            )}

            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer ml-auto sm:ml-0"
              aria-label="Thêm quán ăn mới"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm quán ăn</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
