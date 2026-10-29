import React from 'react';
import { X } from 'lucide-react';

interface PhotoLightboxProps {
  url: string | null;
  caption?: string;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ url, caption, onClose }) => {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Đóng ảnh"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={url}
          alt={caption || 'Ảnh món ăn thực tế'}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />
        {caption && (
          <p className="mt-4 text-white text-sm font-medium text-center bg-black/60 px-4 py-2 rounded-xl border border-white/10">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
