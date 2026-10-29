import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Camera,
  Link as LinkIcon,
  MapPin,
  UtensilsCrossed,
  Tag as TagIcon,
  Sparkles,
  Info,
  Check,
  MessageSquareText
} from 'lucide-react';
import { Restaurant, RatingLevel, MenuItem, FoodPhoto } from '../types/restaurant';
import { COMMON_REASONS, DEFAULT_TAGS, generateMenuCaption } from '../utils/restaurantUtils';
import { FOOD_PRESET_IMAGES } from '../data/sampleRestaurants';

interface AddEditRestaurantModalProps {
  initialRestaurant?: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (restaurant: Restaurant) => void;
}

export const AddEditRestaurantModal: React.FC<AddEditRestaurantModalProps> = ({
  initialRestaurant,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialRestaurant);

  // Form State
  const [name, setName] = useState(initialRestaurant?.name || '');
  const [rating, setRating] = useState<RatingLevel>(initialRestaurant?.rating || 'tot');
  const [reasons, setReasons] = useState<string[]>(initialRestaurant?.reasons || []);
  const [newReasonInput, setNewReasonInput] = useState('');
  const [customReasonText, setCustomReasonText] = useState(
    initialRestaurant?.customReasonText || ''
  );
  const [tags, setTags] = useState<string[]>(
    initialRestaurant?.tags || ['Quán ăn']
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [link, setLink] = useState(initialRestaurant?.link || '');
  const [address, setAddress] = useState(initialRestaurant?.address || '');
  const [phone, setPhone] = useState(initialRestaurant?.phone || '');

  // Menu items: preserved if editing, otherwise empty
  const [menu] = useState<MenuItem[]>(initialRestaurant?.menu || []);

  // Caption / Bài viết thực đơn state
  const [menuCaption, setMenuCaption] = useState(initialRestaurant?.menuCaption || '');

  // Photos state
  const [photos, setPhotos] = useState<FoodPhoto[]>(initialRestaurant?.photos || []);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');

  // Tab inside modal for organized editing (info -> caption -> photos)
  const [activeTab, setActiveTab] = useState<'info' | 'caption' | 'photos'>('info');

  const handleAutoGenerateCaption = () => {
    const generated = generateMenuCaption({
      id: 'preview',
      name: name || 'Quán ăn',
      rating,
      reasons: reasons.length > 0 ? reasons : ['Trải nghiệm ăn uống tại quán'],
      customReasonText,
      tags,
      address,
      menu,
      photos,
      createdAt: '',
      updatedAt: ''
    });
    setMenuCaption(generated);
  };

  // Reasons helpers
  const toggleCommonReason = (r: string) => {
    if (reasons.includes(r)) {
      setReasons(reasons.filter((item) => item !== r));
    } else {
      setReasons([...reasons, r]);
    }
  };

  const handleAddCustomReason = () => {
    const trimmed = newReasonInput.trim();
    if (trimmed && !reasons.includes(trimmed)) {
      setReasons([...reasons, trimmed]);
      setNewReasonInput('');
    }
  };

  const handleRemoveReason = (indexToRemove: number) => {
    setReasons(reasons.filter((_, idx) => idx !== indexToRemove));
  };

  // Tags helpers
  const toggleTag = (t: string) => {
    if (tags.includes(t)) {
      if (tags.length > 1) {
        setTags(tags.filter((item) => item !== t));
      }
    } else {
      setTags([...tags, t]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput('');
    }
  };

  // Photo helpers
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    const newPhoto: FoodPhoto = {
      id: `p-${Date.now()}`,
      url: photoUrlInput.trim(),
      caption: photoCaptionInput.trim() || undefined,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setPhotos([...photos, newPhoto]);
    setPhotoUrlInput('');
    setPhotoCaptionInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newPhoto: FoodPhoto = {
          id: `p-${Date.now()}-${Math.random()}`,
          url: dataUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          dateAdded: new Date().toISOString().split('T')[0]
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSelectPresetImage = (preset: { url: string; label: string }) => {
    const newPhoto: FoodPhoto = {
      id: `p-${Date.now()}-${Math.random()}`,
      url: preset.url,
      caption: preset.label,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const restaurantData: Restaurant = {
      id: initialRestaurant?.id || `res-${Date.now()}`,
      name: name.trim(),
      rating,
      reasons: reasons.length > 0 ? reasons : ['Trải nghiệm ăn uống tại quán'],
      customReasonText: customReasonText.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Quán ăn'],
      link: link.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      menu: menu || [],
      menuCaption: menuCaption.trim() || undefined,
      photos,
      coverImage: photos[0]?.url || initialRestaurant?.coverImage || undefined,
      createdAt: initialRestaurant?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(restaurantData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#FFC2D1] my-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#FFC2D1] flex items-center justify-between bg-[#FFF0F3]">
          <div>
            <h2 className="text-xl font-bold text-[#B82B55]">
              {isEditing ? 'Chỉnh sửa quán ăn' : 'Đánh giá quán ăn mới'}
            </h2>
            <p className="text-xs text-[#B82B55]/70 mt-0.5">
              Phân loại theo 3 mức (Tốt: xanh, Bình thường: vàng, Tệ: xám) kèm lý do, bài viết review và ảnh món
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FFE5EC] text-[#B82B55] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-[#FFC2D1] px-6 bg-[#FFF5F7] text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'info'
                ? 'border-[#FB6F92] text-[#FB6F92] font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            1. Thông tin &amp; Đánh giá (3 mức)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('caption')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'caption'
                ? 'border-[#FB6F92] text-[#FB6F92] font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>2. Thực đơn / Bài viết (Caption)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'photos'
                ? 'border-[#FB6F92] text-[#FB6F92] font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>3. Hình ảnh món ({photos.length})</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
            {/* TAB 1: INFO & RATING */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* 1. Tên quán */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Tên quán ăn / Đồ uống <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Phở Thìn Lò Đúc, Trà sữa KOI Thé..."
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* 2. CHỌN 3 MỨC ĐÁNH GIÁ (QUÁN TỐT: KHUNG XANH, BÌNH THƯỜNG: VÀNG, TỆ: XÁM) */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Mức đánh giá quán <span className="text-rose-500">*</span> (Quy định màu khung thẻ)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Tốt - Khung xanh */}
                    <div
                      onClick={() => setRating('tot')}
                      className={`p-3.5 rounded-2xl border-3 cursor-pointer transition-all flex flex-col justify-between ${
                        rating === 'tot'
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 bg-white dark:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <span>🟢</span>
                          <span>Tốt</span>
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            rating === 'tot'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-zinc-300'
                          }`}
                        >
                          {rating === 'tot' && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Bình thường - Khung vàng */}
                    <div
                      onClick={() => setRating('binh_thuong')}
                      className={`p-3.5 rounded-2xl border-3 cursor-pointer transition-all flex flex-col justify-between ${
                        rating === 'binh_thuong'
                          ? 'border-amber-400 bg-amber-50/80 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-200 dark:ring-amber-800'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-300 bg-white dark:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <span>🟡</span>
                          <span>Bình thường</span>
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            rating === 'binh_thuong'
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-zinc-300'
                          }`}
                        >
                          {rating === 'binh_thuong' && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Tệ - Khung xám */}
                    <div
                      onClick={() => setRating('te')}
                      className={`p-3.5 rounded-2xl border-3 cursor-pointer transition-all flex flex-col justify-between ${
                        rating === 'te'
                          ? 'border-slate-400 bg-slate-100/80 dark:bg-slate-900/60 shadow-md ring-2 ring-slate-300 dark:ring-slate-700'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-slate-400 bg-white dark:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                          <span>⚪</span>
                          <span>Tệ</span>
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            rating === 'te'
                              ? 'border-slate-500 bg-slate-500 text-white'
                              : 'border-zinc-300'
                          }`}
                        >
                          {rating === 'te' && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. LÝ DO ĐÁNH GIÁ (KÈM LÝ DO TỰ THÊM) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#FB6F92]" />
                      <span>Lý do đánh giá (Tự thêm lý do cụ thể)</span>
                    </label>
                    <span className="text-[11px] text-zinc-400">Chọn gợi ý hoặc gõ lý do riêng</span>
                  </div>

                  {/* Suggestion Chips according to selected rating */}
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_REASONS[rating].map((r) => {
                      const isSelected = reasons.includes(r);
                      return (
                        <button
                          type="button"
                          key={r}
                          onClick={() => toggleCommonReason(r)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FB6F92] text-white border-[#FB6F92] font-medium shadow-xs'
                              : 'bg-[#FFF5F7] text-zinc-700 border-[#FFC2D1] hover:bg-[#FFE5EC]'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {r}
                        </button>
                      );
                    })}
                  </div>

                  {/* Input to add custom reason */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newReasonInput}
                      onChange={(e) => setNewReasonInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomReason();
                        }
                      }}
                      placeholder="Thêm lý do khác của riêng bạn (nhấn Enter hoặc bấm Thêm)..."
                      className="flex-1 p-2 bg-[#FFF5F7] border border-[#FFC2D1] rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomReason}
                      className="px-3.5 py-2 bg-[#FB6F92] hover:bg-[#E05377] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs transition-colors"
                    >
                      Thêm lý do
                    </button>
                  </div>

                  {/* Selected reasons list */}
                  {reasons.length > 0 && (
                    <div className="p-3 bg-[#FFF5F7] rounded-xl border border-[#FFC2D1] space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#B82B55] block">
                        Các lý do đã chọn ({reasons.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {reasons.map((r, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-xs font-medium border border-[#FFC2D1] text-zinc-800 shadow-2xs"
                          >
                            <span>{r}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveReason(idx)}
                              className="text-zinc-400 hover:text-[#FB6F92] ml-1 font-bold"
                              aria-label={`Xóa lý do ${r}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed review comment */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Cảm nhận chi tiết / Lưu ý khi đi ăn (tùy chọn):
                    </label>
                    <textarea
                      value={customReasonText}
                      onChange={(e) => setCustomReasonText(e.target.value)}
                      rows={2}
                      placeholder="VD: Quán đông vào lúc 12h trưa nên đi sớm, trà đá miễn phí, nhân viên nhiệt tình..."
                      className="w-full p-2.5 bg-[#FFF5F7] border border-[#FFC2D1] rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    />
                  </div>
                </div>

                {/* 4. GẮN TAG CHO QUÁN (Quán nước, Quán ăn, Ăn vặt...) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Gắn Tag phân loại <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_TAGS.map((tag) => {
                      const isSelected = tags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FB6F92] text-white border-[#FB6F92] shadow-xs'
                              : 'bg-[#FFE5EC] text-[#B82B55] border-[#FFC2D1] hover:bg-[#FFD7E2]'
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add custom tag */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                      placeholder="Tự thêm thẻ tag mới (VD: Hải sản, Đồ chay, Ăn đêm)..."
                      className="flex-1 p-2 bg-[#FFF5F7] border border-[#FFC2D1] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="px-3 py-2 bg-[#FFE5EC] text-[#B82B55] hover:bg-[#FFC2D1] border border-[#FFC2D1] text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      + Thêm tag
                    </button>
                  </div>
                </div>

                {/* 5. LINK QUÁN & ĐỊA CHỈ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#FFC2D1]">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-[#FB6F92]" />
                      <span>Link quán ăn</span>
                    </label>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full p-2 bg-[#FFF5F7] border border-[#FFC2D1] rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FB6F92]" />
                      <span>Địa chỉ quán</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="VD: 123 Phố Huế, Q. Hai Bà Trưng"
                      className="w-full p-2 bg-[#FFF5F7] border border-[#FFC2D1] rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CAPTION / BÀI VIẾT THỰC ĐƠN */}
            {activeTab === 'caption' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFE5EC] p-3.5 rounded-2xl border border-[#FFC2D1] text-xs text-[#B82B55]">
                  <button
                    type="button"
                    onClick={handleAutoGenerateCaption}
                    className="px-3.5 py-2 bg-[#FB6F92] hover:bg-[#E05377] text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tự động tạo bài viết mẫu</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Nội dung bài viết / Caption:
                  </label>
                  <textarea
                    value={menuCaption}
                    onChange={(e) => setMenuCaption(e.target.value)}
                    rows={9}
                    placeholder="Gõ bài viết review quán hoặc nhấn 'Tự động tạo bài viết mẫu' để hệ thống tự soạn mẫu bài viết review kèm tên quán, đánh giá 3 mức, lý do và hashtag..."
                    className="w-full p-3 bg-[#FFF5F7] border border-[#FFC2D1] rounded-2xl text-xs sm:text-sm font-sans leading-relaxed text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  />
                </div>

                {menuCaption && (
                  <div className="p-3.5 bg-[#FFF0F3] rounded-2xl border border-[#FFC2D1] text-xs space-y-1">
                    <span className="font-bold text-[#B82B55] uppercase tracking-wider text-[10px]">
                      Xem trước định dạng bài viết:
                    </span>
                    <div className="p-3 bg-white rounded-xl whitespace-pre-wrap leading-relaxed text-zinc-800 border border-[#FFC2D1]">
                      {menuCaption}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PHOTOS (HÌNH ẢNH MÓN ĂN THỰC TẾ TÔI TỰ THÊM) */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                {/* File Upload / Camera */}
                <div className="p-4 bg-[#FFF5F7] rounded-3xl border-2 border-dashed border-[#FFC2D1] text-center space-y-3">
                  <Camera className="w-8 h-8 text-[#FB6F92] mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                      Tải ảnh chụp món ăn thực tế từ thiết bị của bạn
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Hỗ trợ chụp trực tiếp từ điện thoại hoặc tải file ảnh từ máy tính (JPG, PNG, WebP)
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FB6F92] hover:bg-[#E05377] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Chọn ảnh từ máy / Chụp ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Gallery of photos in this restaurant */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Ảnh thực tế đã lưu ({photos.length})
                  </h4>
                  {photos.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">Chưa có ảnh nào.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {photos.map((p) => (
                        <div
                          key={p.id}
                          className="relative rounded-2xl overflow-hidden aspect-video bg-[#FFF5F7] border border-[#FFC2D1] group"
                        >
                          <img src={p.url} alt={p.caption || 'Ảnh'} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(p.id)}
                            className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
                            title="Xóa ảnh này"
                            aria-label="Xóa ảnh"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {p.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5 text-white text-[10px] truncate">
                              {p.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div className="p-4 bg-[#FFF0F3] border-t border-[#FFC2D1] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
              Hủy bỏ
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'photos' ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'info' ? 'caption' : 'photos')
                  }
                  className="px-4 py-2 bg-[#FFE5EC] text-[#B82B55] hover:bg-[#FFC2D1] text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Tiếp theo &rarr;
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FB6F92] hover:bg-[#E05377] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isEditing ? 'Lưu thay đổi' : 'Hoàn tất & Đăng đánh giá'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
