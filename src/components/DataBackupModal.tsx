import React, { useState } from 'react';
import { X, Download, Upload, Check, AlertCircle, Copy } from 'lucide-react';
import { Restaurant } from '../types/restaurant';

interface DataBackupModalProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
  onImportData: (data: Restaurant[]) => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  restaurants,
  isOpen,
  onClose,
  onImportData
}) => {
  if (!isOpen) return null;

  const [importText, setImportText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(restaurants, null, 2);

  const handleDownloadFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nhat-ky-quan-an-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessImport = () => {
    setErrorMsg('');
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('Dữ liệu JSON phải là một mảng danh sách quán ăn.');
      }
      onImportData(parsed);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Định dạng JSON không hợp lệ.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          onClose();
        } else {
          setErrorMsg('File JSON không chứa danh sách hợp lệ.');
        }
      } catch (err) {
        setErrorMsg('Không thể đọc dữ liệu từ file JSON này.');
      }
    };
    reader.readAsText(file);
  };

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
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Sao lưu &amp; Nạp dữ liệu
            </h3>
            <p className="text-xs text-zinc-500">
              Xuất dữ liệu quán ăn ra máy tính hoặc nạp lại khi đổi trình duyệt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200 text-zinc-500 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Export */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[11px]">
                Xuất file sao lưu ({restaurants.length} quán)
              </span>
              <button
                onClick={handleCopy}
                className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 text-[11px] font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép JSON'}</span>
              </button>
            </div>

            <button
              onClick={handleDownloadFile}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải về file JSON sao lưu</span>
            </button>
          </div>

          {/* Import */}
          <div className="space-y-3">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[11px] block">
              Nạp dữ liệu từ file hoặc mã JSON
            </span>

            <div className="flex items-center gap-2">
              <label className="flex-1 py-2 px-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-center font-medium cursor-pointer text-zinc-700 dark:text-zinc-200 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Chọn file .JSON để nạp</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Hoặc dán nội dung JSON vào đây..."
              rows={4}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono"
            />

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {importText && (
              <button
                onClick={handleProcessImport}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl font-bold cursor-pointer"
              >
                Xác nhận nạp dữ liệu này
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
