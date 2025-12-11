"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Loader2, FileText, Eye } from "lucide-react";
import toast from "react-hot-toast";
import PdfModal from "../../components/PdfModal"; // 👈 ایمپورت کامپوننت جدید

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function JournalsPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🆕 استیت برای مدیریت مودال
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const fetchJournals = async () => {
    try {
      const res = await axios.get(`${API_URL}/journals`);
      if (res.data.success) {
        setJournals(res.data.data);
      }
    } catch (error) {
      toast.error("خطا در دریافت لیست نشریات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // تابع باز کردن مودال
  const openPdf = (url: string, title: string) => {
    setSelectedPdf(url);
    setSelectedTitle(title);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );

  return (
    <div className="min-h-screen px-4 pt-10 pb-20 container mx-auto max-w-6xl">
      <div className="text-center py-10 mb-10 border-b border-white/10">
        <h1 className="text-4xl font-bold text-white mb-4">
          نشریه صفر و یک 🗞️
        </h1>
        <p className="text-gray-400">آرشیو کامل نشریات علمی انجمن کامپیوتر</p>
      </div>

      {journals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <FileText className="h-16 w-16 text-gray-600 mb-4" />
          <p className="text-gray-500 text-lg">
            در حال حاضر هیچ شماره‌ای منتشر نشده است.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal) => (
            <div
              key={journal._id}
              className="group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition shadow-lg flex flex-col"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden">
                <img
                  src={journal.coverImage}
                  alt={journal.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                  loading="lazy"
                />
              </div>

              <div className="p-4 text-center border-t border-white/5 flex flex-col grow">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition">
                  {journal.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  شماره {journal.editionNumber}
                </p>

                <div className="mt-auto flex gap-3">
                  
                  {/* دکمه مطالعه: به جای لینک، تابع openPdf را صدا می‌زند */}
                  <button
                    onClick={() => openPdf(journal.pdfUrl, journal.title)}
                    className="flex-1 inline-flex justify-center items-center bg-slate-700 text-white px-3 py-2.5 rounded-xl font-medium gap-2 hover:bg-slate-600 transition text-sm cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    مطالعه
                  </button>

                  <a
                    href={`${API_URL}/journals/download?fileKey=${encodeURIComponent(journal.pdfUrl)}`}
                    className="flex-1 inline-flex justify-center items-center bg-blue-600 text-white px-3 py-2.5 rounded-xl font-bold gap-2 hover:bg-blue-500 transition shadow-md text-sm"
                  >
                    <Download className="h-4 w-4" />
                    دانلود
                  </a>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🆕 کامپوننت مودال که اینجا رندر می‌شود */}
      <PdfModal 
        isOpen={!!selectedPdf} // اگر لینک پر بود باز شو
        onClose={() => setSelectedPdf(null)} // وقتی بسته شد نال کن
        fileUrl={selectedPdf || ""} 
        title={selectedTitle}
      />
    </div>
  );
}