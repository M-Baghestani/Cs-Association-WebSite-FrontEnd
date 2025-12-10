"use client";

import { X, Download, ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  title: string;
}

export default function PdfModal({ isOpen, onClose, fileUrl, title }: PdfModalProps) {
  // بستن مودال با دکمه ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* پس‌زمینه تاریک */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* باکس اصلی مودال */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* هدر مودال */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-800/50">
          <h3 className="text-white font-medium truncate pr-4">{title}</h3>
          <div className="flex items-center gap-2">
            {/* دکمه دانلود داخل مودال */}
            <a 
              href={fileUrl} 
              download 
              className="p-2 text-gray-400 hover:text-blue-400 transition"
              title="دانلود فایل"
            >
              <Download className="w-5 h-5" />
            </a>
            {/* دکمه باز کردن در تب جدید (اگر لود نشد) */}
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-green-400 transition"
              title="باز کردن در تب جدید"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            {/* دکمه بستن */}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 transition hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* بدنه نمایش PDF */}
        <div className="flex-1 bg-gray-100 relative">
          <iframe
            src={`${fileUrl}#toolbar=0`} // toolbar=0 منوی بالای کروم را مخفی می‌کند
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
}