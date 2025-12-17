"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2, Plus, Eye, Loader2, Image as ImageIcon, Calendar } from "lucide-react";
import toast from "react-hot-toast";
// اطمینان حاصل کنید مسیر ایمپورت BackButton درست است
import BackButton from "../../../components/BackButton"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageGalleryPage() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ۱. دریافت لیست گالری‌ها
  const fetchGalleries = async () => {
    try {
      const res = await axios.get(`${API_URL}/galleries`);
      if (res.data.success) {
        setGalleries(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching galleries", error);
      toast.error("خطا در دریافت لیست گالری‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // چک کردن دسترسی ادمین
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
      return;
    }

    fetchGalleries();
  }, [router]);

  // ۲. حذف گالری
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این گزارش تصویری اطمینان دارید؟")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/galleries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("گالری با موفقیت حذف شد");
      // بروزرسانی لیست پس از حذف
      setGalleries(galleries.filter(g => g._id !== id));
    } catch (error) {
      toast.error("خطا در حذف گالری");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-zinc-800 pb-4 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-500">
          <ImageIcon className="h-6 w-6" />
          مدیریت گزارش‌های تصویری
        </h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Link 
             href="/admin/create-gallery" 
             className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
           >
             <Plus className="h-4 w-4" /> ثبت گزارش جدید
           </Link>
           <BackButton />
        </div>
      </div>

      {/* لیست گالری‌ها */}
      {galleries.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed">
          <ImageIcon className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-500 text-lg">هنوز هیچ گزارش تصویری ثبت نشده است.</p>
          <Link href="/admin/create-gallery" className="text-blue-500 hover:underline mt-2 inline-block">
            اولین گزارش را ثبت کنید
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 group hover:border-blue-500/50 transition-all">
              
              {/* تصویر کاور */}
              <div className="relative h-48 w-full">
                <img 
                  src={gallery.coverImage} 
                  alt={gallery.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white">
                    {gallery.images?.length || 0} تصویر
                </div>
              </div>

              {/* محتوا */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 truncate" title={gallery.title}>
                  {gallery.title}
                </h3>
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-4">
                  <Calendar className="h-3 w-3" />
                  <span className="dir-ltr">{new Date(gallery.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>

                {/* دکمه‌های عملیات */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                  <Link 
                    href={`/gallery/${gallery._id}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-800 hover:bg-blue-600 hover:text-white transition text-sm text-zinc-300"
                  >
                    <Eye className="h-4 w-4" /> مشاهده
                  </Link>
                  <button 
                    onClick={() => handleDelete(gallery._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-800 hover:bg-red-600 hover:text-white transition text-sm text-zinc-300"
                  >
                    <Trash2 className="h-4 w-4" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}