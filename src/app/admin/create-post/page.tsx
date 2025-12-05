// src/app/admin/create-post/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText, Type, Save, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import ImageUploader from "../../../components/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(""); 
  
  // 🚨 FIX 1: مقداردهی اولیه با تاریخ امروز (YYYY-MM-DD)
  // این تضمین می‌کند که اینپوت در ابتدا دارای یک مقدار معتبر است.
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // ساخت اسلاگ خودکار اگر وارد نشده باشد
    let slug = formData.get("slug") as string;
    if (!slug) {
        slug = (formData.get("title") as string).trim().replace(/\s+/g, '-').toLowerCase();
    }

    // 💡 نکته: در اینجا ما thumbnail و publishedAt را مستقیماً از State می‌خوانیم.
    const data = {
      title: formData.get("title"),
      slug: slug,
      content: formData.get("content"),
      thumbnail: thumbnail, // مقدار به‌روز شده از ImageUploader
      category: "ARTICLE",
      publishedAt: publishedAt // 🚨 FIX 2: ارسال مقدار به‌روز شده از State
    };

    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("نشست شما منقضی شده است.");
        router.push("/auth/login");
        return;
    }

    try {
      await axios.post(`${API_URL}/posts`, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      toast.success("✅ خبر با موفقیت منتشر شد!");
      router.push("/blog");

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "خطا در انتشار خبر.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold text-white flex items-center gap-3">
        <FileText className="h-8 w-8 text-orange-500"/> نوشتن خبر جدید
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        
        {/* بخش آپلود عکس */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
            <ImageUploader onUpload={(url) => setThumbnail(url)} label="تصویر شاخص خبر" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {/* عنوان خبر */}
            <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-400">عنوان خبر</label>
                <div className="relative">
                    <Type className="absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
                    <input name="title" required className="w-full rounded-xl bg-slate-950 border border-gray-700 py-3 pr-10 pl-4 text-white focus:border-blue-500 outline-none transition" placeholder="تیتر جذاب..." />
                </div>
            </div>
            
            {/* 🚨 FIX: فیلد تاریخ انتشار */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">تاریخ انتشار</label>
                <div className="relative">
                    <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
                    <input 
                        type="date"
                        value={publishedAt}
                        // 🚨 FIX 3: مقدار جدید را مستقیماً از event.target.value به State منتقل می‌کند
                        onChange={e => setPublishedAt(e.target.value)} 
                        required
                        className="w-full rounded-xl bg-slate-950 border border-gray-700 py-3 pr-10 pl-4 text-white focus:border-blue-500 outline-none transition ltr-text" 
                    />
                </div>
            </div>
        </div>

        {/* فیلد Slug */}
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">لینک (Slug)</label>
            <input name="slug" className="w-full rounded-xl bg-slate-950 border border-gray-700 py-3 px-4 text-white focus:border-blue-500 outline-none transition ltr-text text-left" placeholder="news-slug-url" />
            <p className="text-xs text-gray-600 mt-1">اختیاری (به صورت خودکار از عنوان ساخته می‌شود)</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">متن کامل خبر</label>
          <textarea name="content" rows={12} required className="w-full rounded-xl bg-slate-950 border border-gray-700 p-4 text-white focus:border-blue-500 outline-none transition leading-relaxed" placeholder="متن خبر را اینجا بنویسید..." />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
            <button disabled={loading} type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
            {loading ? <Loader2 className="animate-spin" /> : <><Save className="h-5 w-5"/> انتشار خبر</>}
            </button>
        </div>
      </form>
    </div>
  );
}