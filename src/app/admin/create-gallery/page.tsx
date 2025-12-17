"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// استفاده از مسیر نسبی برای اطمینان از ایمپورت صحیح
import ImageUploader from '../../../components/ImageUploader'; 
import BackButton from '../../../components/BackButton';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateGalleryPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      toast.error('لطفاً تصویر کاور را انتخاب کنید');
      return;
    }
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${apiUrl}/galleries`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, description, coverImage, images }),
      });

      if (res.ok) {
        toast.success('گالری با موفقیت ایجاد شد');
        router.push('/admin/manage-gallery');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'خطا در ثبت گالری');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
            <ImageIcon className="h-7 w-7" />
            ایجاد گالری جدید
          </h1>
          <BackButton />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          {/* عنوان */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">عنوان گالری</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
              placeholder="مثلاً: جشن معارفه دانشجویان نوورود"
              required 
            />
          </div>

          {/* توضیحات */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">توضیحات کوتاه</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 h-24 outline-none focus:border-cyan-500 transition"
              placeholder="توضیحاتی درباره این رویداد..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* تصویر کاور */}
            <div className="p-4 border border-dashed border-gray-600 rounded-xl bg-slate-900/50">
              <label className="block mb-3 text-sm font-bold text-yellow-400">
                ۱. تصویر کاور (نمایش در لیست)
              </label>
              <ImageUploader 
                label="انتخاب کاور"
                onUpload={(url) => setCoverImage(url)} 
                defaultImage={coverImage}
              />
            </div>

            {/* تصاویر آلبوم */}
            <div className="p-4 border border-dashed border-gray-600 rounded-xl bg-slate-900/50">
              <label className="block mb-3 text-sm font-bold text-cyan-400">
                ۲. تصاویر آلبوم (چندتایی)
              </label>
              <ImageUploader 
                label="افزودن تصویر جدید"
                onUpload={(url) => {
                  if(url) setImages(prev => [...prev, url])
                }} 
              />
              <p className="text-gray-500 text-xs mt-2">تعداد تصاویر اضافه شده: {images.length}</p>
            </div>
          </div>

          {/* پیش‌نمایش تصاویر */}
          {images.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
              <h3 className="text-sm text-gray-400 mb-3">تصاویر آماده برای گالری:</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                    <img src={img} alt="preview" className="object-cover w-full h-full" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                در حال ثبت...
              </>
            ) : (
              'انتشار گالری'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}