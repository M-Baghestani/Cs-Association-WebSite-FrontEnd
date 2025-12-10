"use client";

import { X, Download, ExternalLink, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// تنظیم ورکر برای پردازش PDF (حیاتی!)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  title: string;
}

export default function PdfModal({ isOpen, onClose, fileUrl, title }: PdfModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(600);

  // تنظیم عرض صفحه بر اساس سایز موبایل یا دسکتاپ
  useEffect(() => {
    const updateWidth = () => {
        const width = window.innerWidth;
        setPageWidth(width < 640 ? width - 40 : 600);
    };
    
    window.addEventListener('resize', updateWidth);
    updateWidth(); // اجرا در لحظه اول
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // ریست کردن صفحه وقتی فایل عوض میشه
  useEffect(() => {
    setPageNumber(1);
    setLoading(true);
  }, [fileUrl]);

  // بستن با ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-4xl bg-gray-900 sm:rounded-2xl shadow-2xl flex flex-col border border-white/10">
        
        {/* هدر */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-800">
          <h3 className="text-white font-medium truncate max-w-[200px] text-sm sm:text-base">{title}</h3>
          <div className="flex items-center gap-1">
             {/* دکمه‌های دانلود و لینک خارجی */}
             <a href={fileUrl} download className="p-2 text-gray-400 hover:text-blue-400"><Download className="w-5 h-5" /></a>
             <a href={fileUrl} target="_blank" className="p-2 text-gray-400 hover:text-green-400"><ExternalLink className="w-5 h-5" /></a>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
          </div>
        </div>

        {/* بدنه نمایش PDF */}
        <div className="flex-1 overflow-auto bg-gray-500/10 flex justify-center p-4 relative">
            
          {loading && (
             <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
             </div>
          )}

          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            className="flex justify-center"
            error={<div className="text-white mt-10">خطا در بارگذاری فایل PDF. لطفاً دانلود کنید.</div>}
          >
            {/* عرض صفحه را داینامیک کردیم که در موبایل بیرون نزند */}
            <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                className="shadow-xl"
                width={pageWidth} 
            />
          </Document>
        </div>

        {/* فوتر: کنترل صفحات */}
        {numPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-3 border-t border-white/10 bg-gray-800">
                <button 
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}
                    className="p-2 bg-gray-700 rounded-full disabled:opacity-50 text-white"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                
                <span className="text-white text-sm" dir="rtl">
                    صفحه {pageNumber} از {numPages}
                </span>

                <button 
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(prev => prev + 1)}
                    className="p-2 bg-gray-700 rounded-full disabled:opacity-50 text-white"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
}