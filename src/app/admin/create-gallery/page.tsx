"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// مطمئن شوید مسیر ایمپورت‌ها درست است
import ImageUploader from '../../../components/ImageUploader'; 
import BackButton from '../../../components/BackButton';

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
      alert('لطفاً ابتدا تصویر کاور را آپلود کنید');
      return;
    }
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const res = await fetch(`${apiUrl}/api/galleries`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ title, description, coverImage, images }),
      });

      if (res.ok) {
        alert('گزارش تصویری با موفقیت ثبت شد');
        router.push('/admin/manage-gallery');
      } else {
        const errorData = await res.json();
        alert(`خطا: ${errorData.message || 'مشکلی در ثبت رخ داد'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-zinc-800 pb-4 gap-4">
        <h1 className="text-2xl font-bold text-blue-500">
          📸 ایجاد گزارش تصویری جدید
        </h1>
        <div className="w-full md:w-auto">
           <BackButton />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl max-w-4xl mx-auto space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">عنوان گزارش</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 outline-none transition-colors"
            placeholder="مثلاً: بازدید علمی از پارک علم و فناوری"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">توضیحات کوتاه</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 h-24 outline-none focus:border-blue-500 transition-colors"
            placeholder="توضیحاتی در مورد رویداد بنویسید..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* کاور اصلی */}
          <div className="p-4 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-800/30">
            <label className="block mb-3 text-sm font-bold text-yellow-500">
              ۱. تصویر کاور (اصلی) *
            </label>
            {/* اصلاح پراپ‌ها: label اضافه شد و onUpload جایگزین onUploadSuccess شد */}
            <ImageUploader 
              label="آپلود تصویر کاور"
              onUpload={(url: string) => setCoverImage(url)} 
            />
          </div>

          {/* تصاویر گالری */}
          <div className="p-4 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-800/30">
            <label className="block mb-3 text-sm font-bold text-blue-400">
              ۲. تصاویر گزارش (چندتایی)
            </label>
            {/* اصلاح پراپ‌ها */}
            <ImageUploader 
              label="افزودن تصویر جدید"
              onUpload={(url: string) => {
                 if(url) setImages(prev => [...prev, url])
              }} 
            />
            <p className="text-zinc-500 text-xs mt-2">تعداد تصاویر فعلی: {images.length}</p>
          </div>
        </div>

        {/* لیست تصاویر آپلود شده برای گالری */}
        {images.length > 0 && (
          <div className="bg-black p-4 rounded-xl border border-zinc-800">
            <h3 className="text-sm text-zinc-400 mb-3">تصاویر انتخاب شده:</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-zinc-700">
                  <img src={img} alt={`gallery-${idx}`} className="object-cover w-full h-full" />
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
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
        >
          {loading ? '⏳ در حال ثبت...' : '✅ انتشار گالری تصاویر'}
        </button>
      </form>
    </div>
  );
}