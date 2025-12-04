"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Download, Loader2, ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function JournalViewerPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_URL}/journals/${id}`).then(res => {
      setJournal(res.data.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      // Handle error or redirect if necessary
    });
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;
  if (!journal) return <div className="text-white text-center pt-32">نشریه مورد نظر یافت نشد.</div>;

  // 🚨 نکته مهم: اگر از سرویس مایکروسافت استفاده می‌کنید، URL باید حتماً HTTPS باشد.
  const securePdfUrl = journal.pdfUrl.replace('http://', 'https://'); 

  return (
    <div className="min-h-screen w-full pt-24 bg-slate-950 flex flex-col">
        
        {/* Navigation Bar/Header */}
        <div className="bg-slate-900 p-4 border-b border-white/10 flex justify-between items-center px-4 sm:px-8 sticky top-0 z-10 shadow-lg">
            <Link href="/journals" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                 <ArrowRight className="h-4 w-4" /> بازگشت به نشریات
            </Link>
            <h1 className="text-white font-bold">{journal.title} - شماره {journal.editionNumber}</h1>
            <a href={journal.pdfUrl} download className="text-blue-400 hover:text-white transition flex items-center gap-1 text-sm font-bold">
                <Download className="h-4 w-4"/> دانلود PDF
            </a>
        </div>
        
        {/* نمایشگر PDF */}
        <iframe 
            // 🚨 FIX: استفاده از Microsoft Office Online Viewer
            // این سرویس معمولاً در برابر هدر Content-Disposition مقاومت بیشتری دارد.
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${securePdfUrl}`} 
            className="w-full flex-grow border-none min-h-[calc(100vh-100px)]" 
            title="PDF Viewer"
            allowFullScreen
            loading="lazy"
        />
    </div>
  );
}