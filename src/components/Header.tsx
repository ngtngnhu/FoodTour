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

  return (
    <header className="border-b border-[#FFC2D1] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FB6F92] via-[#FF8FAB] to-[#FFB3C6] p-0.5 shadow-md shadow-[#FB6F92]/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Utensils className="w-6 h-6 text-[#FB6F92]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  Pippippi
                </h1>
              </div>
            </div>
          </div>

          {/* Real-time stats badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Tốt: <strong>{totCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              <Minus className="w-3.5 h-3.5" />
              <span>Bình thường: <strong>{binhThuongCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 font-medium">
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Tệ: <strong>{teCount}</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {restaurants.length > 0 && (
              <button
                onClick={onOpenRandom}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#B82B55] bg-[#FFE5EC] hover:bg-[#FFD7E2] border border-[#FFB3C6] rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="Gợi ý ngẫu nhiên quán ăn ngon hôm nay"
                aria-label="Hôm nay ăn gì"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FB6F92]" />
                <span>Hôm nay ăn gì?</span>
              </button>
            )}

            <button
              onClick={onOpenBackup}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-[#FFE5EC] border border-[#FFC2D1] rounded-xl transition-colors cursor-pointer"
              title="Sao lưu hoặc nạp dữ liệu quán ăn"
              aria-label="Sao lưu dữ liệu"
            >
              <Download className="w-3.5 h-3.5 text-[#FB6F92]" />
              <span className="hidden sm:inline">Sao lưu</span>
            </button>

            {restaurants.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                title="Xóa tất cả các quán đang có"
                aria-label="Xóa tất cả quán"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </button>
            )}

            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FB6F92] hover:bg-[#E8557B] rounded-xl shadow-md shadow-[#FB6F92]/25 transition-all cursor-pointer ml-auto sm:ml-0"
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
