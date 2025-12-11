"use client";

import { X, Download, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  title: string;
}

export default function PdfModal({ isOpen, onClose, fileUrl, title }: PdfModalProps) {
  const [loading, setLoading] = useState(true);

  // ریست کردن لودینگ وقتی فایل عوض میشه
  useEffect(() => {
    if (isOpen) setLoading(true);
  }, [fileUrl, isOpen]);

  // بستن با ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // ساخت لینک مخصوص گوگل داک
  // نکته: لینک فایل باید حتما Encode شود
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
      {/* بک‌دراپ تاریک */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-5xl bg-gray-900 sm:rounded-2xl shadow-2xl flex flex-col border border-white/10 overflow-hidden">
        
        {/* هدر */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-800 z-10">
          <h3 className="text-white font-medium truncate max-w-[200px] text-sm sm:text-base" dir="rtl">
            {title}
          </h3>
          <div className="flex items-center gap-1">
             <a href={fileUrl} download className="p-2 text-gray-400 hover:text-blue-400 transition" title="دانلود">
                <Download className="w-5 h-5" />
             </a>
             <a href={fileUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-green-400 transition" title="باز کردن در تب جدید">
                <ExternalLink className="w-5 h-5" />
             </a>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition" title="بستن">
                <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* بدنه نمایش PDF (iframe) */}
        <div className="flex-1 relative bg-gray-100 w-full h-full">
            
          {/* لودینگ تا زمانی که iframe کامل لود شود */}
          {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/50 backdrop-blur-sm text-white">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-2" />
                <span className="text-sm">درحال دانلود فایل... لطفا صبور باشید.</span>
             </div>
          )}

          <iframe
            src={googleDocsUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
            onLoad={() => setLoading(false)} // وقتی لود شد، اسپینر حذف میشه
            allowFullScreen
          />
          
        </div>
      </div>
    </div>
  );
}