"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '../../../components/ImageUploader'; 

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
    slug: '',
    isFree: true,
    price: 0, 
    // 👇 فیلدهای جدید
    registrationStatus: 'OPEN', 
    registrationOpensAt: '', 
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isFree') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            isFree: checked,
            price: checked ? 0 : prev.price, 
        }));
    } else if (type === 'number') {
        setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // هندلر مخصوص قیمت
  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '' || isNaN(Number(e.target.value))) {
        setFormData((prev) => ({ ...prev, price: 0 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // اگر وضعیت زمان‌بندی شده نیست، تاریخ باز شدن را حذف کن یا به حال خود بگذار
    let finalOpensAt = formData.registrationOpensAt;
    if (formData.registrationStatus !== 'SCHEDULED') {
        finalOpensAt = new Date().toISOString(); // اگر باز است، همین الان باز شود
    }

    const payload = {
        ...formData,
        thumbnail: imageUrl,
        price: formData.isFree ? 0 : formData.price,
        registrationOpensAt: finalOpensAt,
    };

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/events`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("رویداد با موفقیت ساخته شد! 📅");
      setTimeout(() => window.location.href = "/", 1000);
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold text-white">ساخت رویداد جدید ➕</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md">
        
        <ImageUploader 
            onUpload={setImageUrl}
            label="تصویر کاور رویداد (Thumbnail)" 
        />

        {/* ردیف ۱: عنوان و اسلاگ */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm text-gray-400 mb-2">عنوان رویداد</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-2">آدرس یکتا (Slug)</label>
                <input name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. python-workshop" required className="w-full rounded-lg bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-green-500" />
            </div>
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">توضیحات</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="w-full rounded-lg bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {/* ردیف ۲: زمان برگزاری، مکان، ظرفیت */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">زمان برگزاری</label>
            <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">مکان</label>
            <input name="location" value={formData.location} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">ظرفیت</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        
        {/* 👇 بخش جدید: تنظیمات وضعیت ثبت‌نام */}
        <div className="bg-slate-800/50 p-5 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">تنظیمات ثبت‌نام</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">وضعیت ثبت‌نام</label>
                    <select 
                        name="registrationStatus" 
                        value={formData.registrationStatus} 
                        onChange={handleChange}
                        className="w-full rounded-lg bg-slate-950 border border-gray-700 p-3 text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="OPEN">باز (همین الان)</option>
                        <option value="SCHEDULED">زمان‌بندی شده (آینده)</option>
                        <option value="CLOSED">بسته شده</option>
                    </select>
                </div>

                {/* اگر زمان‌بندی شده انتخاب شود، این فیلد نمایش داده می‌شود */}
                {formData.registrationStatus === 'SCHEDULED' && (
                    <div>
                        <label className="block text-sm text-yellow-400 mb-2">تاریخ باز شدن ثبت‌نام</label>
                        <input 
                            type="datetime-local" 
                            name="registrationOpensAt" 
                            value={formData.registrationOpensAt} 
                            onChange={handleChange} 
                            required 
                            className="w-full rounded-lg bg-slate-950 border border-yellow-600/50 p-3 text-white focus:ring-2 focus:ring-yellow-500" 
                        />
                    </div>
                )}
            </div>
        </div>

        {/* بخش قیمت */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
                <input
                    id="isFree"
                    name="isFree"
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-gray-300 select-none">
                    این رویداد رایگان است.
                </label>
            </div>

            {!formData.isFree && (
                <div className="mt-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">قیمت ثبت‌نام (به تومان)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price === 0 ? '' : formData.price} 
                        onBlur={handlePriceBlur}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="مثال: ۵۰۰۰۰"
                        className="block w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            )}
        </div>

        <button disabled={loading} type="submit" className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-500 flex justify-center shadow-lg shadow-green-600/20">
           {loading ? <Loader2 className="animate-spin"/> : "ثبت نهایی رویداد"}
        </button>
      </form>
    </div>
  );
}