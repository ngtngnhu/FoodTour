import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Phone,
  Camera,
  Plus,
  UtensilsCrossed,
  Sparkles,
  Edit2,
  Trash2,
  Tag as TagIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageSquareText
} from 'lucide-react';
import { Restaurant, MenuItem, FoodPhoto } from '../types/restaurant';
import { getRatingTheme, formatVND, generateMenuCaption } from '../utils/restaurantUtils';

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onUpdateRestaurant: (updated: Restaurant) => void;
  onOpenPhoto: (url: string, caption?: string) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onEdit,
  onDelete,
  onUpdateRestaurant,
  onOpenPhoto
}) => {
  const theme = getRatingTheme(restaurant.rating);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [showCaptionBox, setShowCaptionBox] = useState(true);
  const captionContent = restaurant.menuCaption || generateMenuCaption(restaurant);
  const [menuSearch, setMenuSearch] = useState('');
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishNote, setNewDishNote] = useState('');
  const [newDishSpecial, setNewDishSpecial] = useState(false);

  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Filter menu inside modal
  const filteredMenu = restaurant.menu.filter(
    (item) =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(menuSearch.toLowerCase()))
  );

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const priceNum = parseInt(newDishPrice.replace(/\D/g, ''), 10) || 0;
    const newItem: MenuItem = {
      id: `dish-${Date.now()}`,
      name: newDishName.trim(),
      price: priceNum,
      note: newDishNote.trim() || undefined,
      isSpecial: newDishSpecial
    };

    const updated: Restaurant = {
      ...restaurant,
      menu: [...restaurant.menu, newItem],
      updatedAt: new Date().toISOString()
    };

    onUpdateRestaurant(updated);
    setNewDishName('');
    setNewDishPrice('');
    setNewDishNote('');
    setNewDishSpecial(false);
    setShowAddDish(false);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto: FoodPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || undefined,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updated: Restaurant = {
      ...restaurant,
      photos: [...restaurant.photos, newPhoto],
      coverImage: restaurant.coverImage || newPhoto.url,
      updatedAt: new Date().toISOString()
    };

    onUpdateRestaurant(updated);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setShowAddPhoto(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto: FoodPhoto = {
        id: `photo-${Date.now()}`,
        url: dataUrl,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        dateAdded: new Date().toISOString().split('T')[0]
      };
      const updated: Restaurant = {
        ...restaurant,
        photos: [...restaurant.photos, newPhoto],
        coverImage: restaurant.coverImage || dataUrl,
        updatedAt: new Date().toISOString()
      };
      onUpdateRestaurant(updated);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border-4 ${theme.borderColor} my-8 transition-all`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-restaurant-name"
      >
        {/* Header with Rating color background accent */}
        <div className={`p-6 border-b ${theme.borderColor} ${theme.bgColor} relative`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/10 hover:bg-black/20 text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-xs ${theme.badgeBg}`}
                >
                  <span>{theme.emoji}</span>
                  <span>Đánh giá: {theme.label}</span>
                </span>
                {restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 inline-flex items-center gap-1"
                  >
                    <TagIcon className="w-2.5 h-2.5 text-zinc-400" />
                    {tag}
                  </span>
                ))}
              </div>

              <h2
                id="modal-restaurant-name"
                className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50"
              >
                {restaurant.name}
              </h2>

              {restaurant.address && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{restaurant.address}</span>
                </p>
              )}

              {restaurant.phone && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{restaurant.phone}</span>
                </p>
              )}
            </div>

            {restaurant.link && (
              <a
                href={restaurant.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-700 border border-emerald-300 dark:border-emerald-800 text-sm font-semibold shadow-xs transition-colors shrink-0"
              >
                <span>Mở link quán / Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Lý do đánh giá section */}
          <div className={`p-4 rounded-2xl border ${theme.reasonBoxBg}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lý do đánh giá cụ thể ({theme.label}):</span>
            </h3>

            {restaurant.reasons && restaurant.reasons.length > 0 ? (
              <ul className="space-y-1.5 text-sm list-disc list-inside">
                {restaurant.reasons.map((reason, idx) => (
                  <li key={idx} className="font-medium text-zinc-800 dark:text-zinc-100">
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-zinc-400">Chưa ghi lý do cụ thể.</p>
            )}

            {restaurant.customReasonText && (
              <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs italic text-zinc-700 dark:text-zinc-300">
                <strong>Ghi chú chi tiết: </strong>
                "{restaurant.customReasonText}"
              </div>
            )}
          </div>

          {/* Actual Food Photos (Hình ảnh món ăn thực tế tôi tự thêm) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Hình ảnh món ăn thực tế ({restaurant.photos.length})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowAddPhoto(!showAddPhoto)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dán link ảnh</span>
                </button>
              </div>
            </div>

            {/* Quick add photo URL form */}
            {showAddPhoto && (
              <form
                onSubmit={handleAddPhoto}
                className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs"
              >
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Dán URL hình ảnh món ăn thực tế..."
                    className="flex-1 p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Mô tả món (VD: Bát phở ngập thịt)"
                    className="w-1/3 p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            )}

            {/* Photo grid */}
            {restaurant.photos.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
                <Camera className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Chưa có ảnh món ăn thực tế chụp tại quán.</p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Hãy nhấn "Tải ảnh lên" hoặc "Dán link ảnh" để lưu giữ món ngon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {restaurant.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onOpenPhoto(photo.url, photo.caption)}
                    className="relative group rounded-xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 cursor-pointer border border-zinc-200 dark:border-zinc-700 shadow-2xs hover:shadow-md transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Ảnh món ăn'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[11px] truncate">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thực đơn dưới dạng bài viết (caption) */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Thực đơn dưới dạng bài viết (Caption)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(captionContent);
                    setCopiedCaption(true);
                    setTimeout(() => setCopiedCaption(false), 2000);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border ${
                    copiedCaption
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                  }`}
                  title="Sao chép bài viết này"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Sao chép Caption</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCaptionBox(!showCaptionBox)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  {showCaptionBox ? 'Thu gọn' : 'Xem'}
                </button>
              </div>
            </div>

            {showCaptionBox && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${theme.reasonBoxBg}`}
              >
                {captionContent}
              </div>
            )}
          </div>

          {/* Menu Section */}
          <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Thực đơn quán ({restaurant.menu.length} món)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Search in this menu */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Tìm món trong quán..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={() => setShowAddDish(!showAddDish)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm món</span>
                </button>
              </div>
            </div>

            {/* Quick add dish form */}
            {showAddDish && (
              <form
                onSubmit={handleAddDish}
                className="p-3.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-2.5"
              >
                <div className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                  Thêm món mới vào menu quán:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Tên món ăn (VD: Phở xào bò)"
                    className="p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="Giá tiền (VD: 65000)"
                    className="p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={newDishNote}
                    onChange={(e) => setNewDishNote(e.target.value)}
                    placeholder="Ghi chú món (VD: Nhiều thịt, cay nhẹ)"
                    className="p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg sm:col-span-2"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDishSpecial}
                      onChange={(e) => setNewDishSpecial(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Đánh dấu là món đặc sắc (Must try / Best seller)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDish(false)}
                      className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    >
                      Lưu món
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Menu List */}
            {filteredMenu.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                Không tìm thấy món nào trong menu khớp với từ khóa "{menuSearch}".
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {item.isSpecial && (
                          <span
                            className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold flex items-center gap-0.5"
                            title="Món đặc sắc của quán"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            Đặc sắc
                          </span>
                        )}
                        <span>{item.name}</span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.note}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 shrink-0">
                      {formatVND(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(restaurant)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin</span>
            </button>
            <button
              onClick={() => {
                onDelete(restaurant.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa quán này</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-lg cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
