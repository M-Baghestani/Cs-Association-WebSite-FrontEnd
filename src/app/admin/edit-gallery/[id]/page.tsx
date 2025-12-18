"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// مسیرهای ایمپورت را بر اساس ساختار پروژه‌تان چک کنید
import ImageUploader from '../../../../components/ImageUploader'; 
import BackButton from '../../../../components/BackButton';
import { Image as ImageIcon, Loader2, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EditGalleryPage() {
  // دریافت ID از URL
  const { id } = useParams(); 
  const router = useRouter();
  
  // استیت‌های فرم
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  // استیت‌های وضعیت (لودینگ)
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  // ۱. دریافت اطلاعات فعلی گالری از سرور
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_URL}/galleries/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          setTitle(data.title);
          setDescription(data.description);
          setCoverImage(data.coverImage);
          setImages(data.images || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات گالری");
        router.push('/admin/manage-gallery');
      } finally {
        setLoadingData(false);
      }
    };

    if (id) fetchGallery();
  }, [id, router]);

  // ۲. ارسال اطلاعات ویرایش شده به سرور (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverImage) {
        toast.error("تصویر کاور الزامی است");
        return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      // متد PUT برای آپدیت
      await axios.put(`${API_URL}/galleries/${id}`, {
        title,
        description,
        coverImage,
        images // لیست جدید عکس‌ها جایگزین قبلی می‌شود
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('گالری با موفقیت ویرایش شد');
      router.push('/admin/manage-gallery');
    } catch (error) {
      console.error(error);
      toast.error('خطا در ذخیره تغییرات');
    } finally {
      setSaving(false);
    }
  };

  // ۳. هندلر حذف عکس از لیست
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  if (loadingData) return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-cyan-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 pt-24">
      <div className="max-w-4xl mx-auto">
        
        {/* هدر صفحه */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            <ImageIcon className="h-7 w-7" />
            ویرایش گالری
          </h1>
          <BackButton />
        </div>

        {/* فرم ویرایش */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          
          {/* عنوان */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">عنوان گالری</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
              required 
            />
          </div>

          {/* توضیحات */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">توضیحات</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 h-32 outline-none focus:border-yellow-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* بخش تصویر کاور */}
            <div className="p-4 border border-dashed border-gray-600 rounded-xl bg-slate-900/50 flex flex-col">
              <label className="block mb-3 text-sm font-bold text-yellow-400">
                تصویر کاور (اصلی)
              </label>
              
              {coverImage && (
                <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden border border-white/20">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="mt-auto">
                <ImageUploader 
                    label={coverImage ? "تغییر تصویر کاور" : "آپلود کاور"}
                    onUpload={(url) => setCoverImage(url)} 
                />
              </div>
            </div>

            {/* بخش افزودن عکس‌های جدید */}
            <div className="p-4 border border-dashed border-gray-600 rounded-xl bg-slate-900/50 flex flex-col">
              <label className="block mb-3 text-sm font-bold text-cyan-400">
                افزودن عکس به آلبوم
              </label>
              
              <div className="bg-slate-950 p-3 rounded-lg mb-3 text-xs text-gray-400 leading-relaxed">
                عکس‌های جدید را اینجا آپلود کنید. آن‌ها به لیست پایین اضافه می‌شوند.
              </div>

              <div className="mt-auto">
                  <ImageUploader 
                    label="آپلود عکس جدید ➕"
                    onUpload={(url) => {
                      if(url) setImages(prev => [...prev, url])
                    }} 
                  />
              </div>
            </div>
          </div>

          {/* مدیریت عکس‌های آلبوم */}
          <div className="bg-slate-950 p-5 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-300">مدیریت تصاویر آلبوم ({images.length} عدد):</h3>
                {images.length > 0 && (
                    <button 
                        type="button" 
                        onClick={() => {if(confirm('همه عکس‌ها پاک شوند؟')) setImages([])}}
                        className="text-xs text-red-400 hover:text-red-300"
                    >
                        حذف همه
                    </button>
                )}
            </div>

            {images.length === 0 ? (
                <p className="text-center text-gray-600 py-4">هنوز عکسی در آلبوم نیست.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                        <img src={img} alt={`img-${idx}`} className="object-cover w-full h-full" />
                        
                        {/* دکمه حذف روی هر عکس */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transform scale-90 hover:scale-110 transition"
                                title="حذف این عکس"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
          </div>

          {/* دکمه ذخیره */}
          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                در حال ذخیره تغییرات...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                ذخیره تغییرات گالری
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}