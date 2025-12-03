"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, BookOpen, Save } from "lucide-react";
import ImageUploader from "../../../components/ImageUploader";
import FileUploader from "../../../components/FileUploader"; // فرض بر وجود FileUploader

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CreateJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State ها
  const [cover, setCover] = useState("");
  const [pdf, setPdf] = useState("");
  const [title, setTitle] = useState("");
  const [editionNumber, setEditionNumber] = useState("");

  // چک کردن دسترسی ادمین
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cover || !pdf) { 
        toast.error("لطفاً عکس جلد و فایل PDF را آپلود کنید."); 
        return; 
    }
    
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const payload = {
            title,
            editionNumber: Number(editionNumber),
            coverImage: cover,
            pdfUrl: pdf
        };

        await axios.post(`${API_URL}/journals`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("نشریه منتشر شد! 🎉");
        router.push("/journals");
    } catch (error: any) {
        toast.error(error.response?.data?.message || "خطا در انتشار.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24 text-white">
        <h1 className="mb-8 text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-cyan-500"/> انتشار نشریه صفر و یک
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="mb-2 block text-sm text-gray-400">عنوان نشریه</label>
                    <input 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-cyan-500 outline-none transition"
                        placeholder="مثلاً: هوش مصنوعی و آینده"
                        required 
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm text-gray-400">شماره نسخه</label>
                    <input 
                        type="number" 
                        value={editionNumber}
                        onChange={e => setEditionNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-cyan-500 outline-none transition"
                        placeholder="مثلاً: 5"
                        required 
                    />
                </div>
            </div>

            {/* آپلودرها */}
            <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <ImageUploader onUpload={setCover} label="۱. تصویر جلد (Cover)" />
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <FileUploader onUpload={setPdf} label="۲. فایل PDF نشریه" accept=".pdf" />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading} 
                className="w-full bg-cyan-600 py-3 rounded-xl font-bold text-white hover:bg-cyan-500 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
                {loading ? <Loader2 className="animate-spin"/> : <><Save className="h-5 w-5"/> انتشار نشریه</>}
            </button>
        </form>
    </div>
  );
}