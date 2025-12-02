"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReadJournalPage() {
  const { id } = useParams();
  const [journal, setJournal] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_URL}/journals/${id}`).then(res => setJournal(res.data.data));
  }, [id]);

  if (!journal) return <div className="text-white text-center pt-32">در حال بارگذاری...</div>;

  return (
    <div className="h-screen w-full pt-20 bg-slate-950 flex flex-col">
        <div className="bg-slate-900 p-4 border-b border-white/10 flex justify-between items-center px-8">
            <h1 className="text-white font-bold">{journal.title} - شماره {journal.editionNumber}</h1>
            <a href={journal.pdfUrl} download className="text-blue-400 hover:underline text-sm">دانلود فایل PDF</a>
        </div>
        
        {/* نمایشگر PDF */}
        <iframe 
            src={journal.pdfUrl} 
            className="w-full flex-grow border-none"
            title="PDF Viewer"
        />
    </div>
  );
}