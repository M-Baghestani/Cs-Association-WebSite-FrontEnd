"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { BookOpen, Download, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function JournalsPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl">
        <div className="text-center py-10 mb-10 border-b border-white/10">
            <h1 className="text-4xl font-bold text-white mb-4">نشریه صفر و یک 🗞️</h1>
            <p className="text-gray-400">آرشیو کامل نشریات علمی انجمن کامپیوتر</p>
        </div>

        {journals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
                <FileText className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-gray-500 text-lg">در حال حاضر هیچ شماره‌ای منتشر نشده است.</p>
            </div>
        ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {journals.map((journal) => (
                    <div key={journal._id} className="group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition shadow-lg">
                        
                        {/* کاور و دکمه‌ها */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                            <img src={journal.coverImage} alt={journal.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                            
                            {/* لایه پوششی تعاملی */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                <a 
                                    href={journal.pdfUrl} 
                                    download // این اطمینان می‌دهد که دانلود اجباری است
                                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-500 transition shadow-md"
                                >
                                    <Download className="h-5 w-5"/> دانلود نشریه
                                </a>
                            </div>
                        </div>
                        
                        {/* جزئیات */}
                        <div className="p-4 text-center border-t border-white/5">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition">{journal.title}</h3>
                            <p className="text-gray-500 text-sm">شماره {journal.editionNumber}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}