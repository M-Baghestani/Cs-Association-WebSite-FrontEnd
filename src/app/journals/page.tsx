"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { BookOpen, Download } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function JournalsPage() {
  const [journals, setJournals] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/journals`).then(res => setJournals(res.data.data));
  }, []);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">نشریه صفر و یک 🗞️</h1>
            <p className="text-gray-400">آرشیو کامل نشریات علمی انجمن کامپیوتر</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {journals.map((journal) => (
                <div key={journal._id} className="group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition">
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <img src={journal.coverImage} alt={journal.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        
                        {/* دکمه‌های روی کاور */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                            <Link href={`/journals/${journal._id}`} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-500 transition">
                                <BookOpen className="h-4 w-4"/> مطالعه آنلاین
                            </Link>
                            <a href={journal.pdfUrl} download className="bg-white/10 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 transition border border-white/20">
                                <Download className="h-4 w-4"/> دانلود فایل
                            </a>
                        </div>
                    </div>
                    <div className="p-4 text-center">
                        <h3 className="text-xl font-bold text-white">{journal.title}</h3>
                        <p className="text-gray-500 text-sm">شماره {journal.editionNumber}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}