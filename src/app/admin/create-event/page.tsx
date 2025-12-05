// src/app/admin/create-event/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Calendar, DollarSign, Save, Clock } from "lucide-react";
import ImageUploader from "../../../components/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// تابع کمکی برای ترکیب تاریخ و زمان
const combineDateTime = (date: string, time: string) => {
    if (!date || !time) return date; // اگر زمان وارد نشد، فقط تاریخ را برگردان
    // ترکیب YYYY-MM-DD با HH:MM:SS
    return new Date(`${date}T${time}:00`).toISOString();
};


export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState('');

  // 🚨 FIX: افزودن State برای ساعت شروع/پایان
  const [status, setStatus] = useState('scheduled');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00'); // ساعت پیش‌فرض
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState('17:00'); // ساعت پیش‌فرض

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    location: '',
    capacity: 50,
    isFree: true,
    price: 0,
    registrationLink: '',
  });

  // چک کردن دسترسی ادمین
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleToggleFree = () => {
    setFormData(prev => ({ 
      ...prev, 
      isFree: !prev.isFree,
      price: !prev.isFree ? 0 : 50000 // Reset price if free, set placeholder if becoming paid
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) { 
        toast.error("لطفاً تصویر کاور رویداد را آپلود کنید."); 
        return; 
    }

    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const payload = {
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            location: formData.location,
            capacity: formData.capacity,
            isFree: formData.isFree,
            price: formData.isFree ? 0 : Number(formData.price),
            thumbnail: imageUrl,
            status: status, 
            // 🚨 FIX: ترکیب تاریخ و ساعت برای ارسال ISO Timezone
            startDate: combineDateTime(startDate, startTime), 
            endDate: combineDateTime(endDate, endTime), 
            registrationLink: formData.registrationLink
        };

        await axios.post(`${API_URL}/events`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("رویداد با موفقیت منتشر شد! 🎉");
        router.push("/admin/manage-events");
    } catch (error: any) {
        console.error("Error creating event:", error);
        toast.error(error.response?.data?.message || "خطا در انتشار رویداد.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 text-white">
        <h1 className="mb-8 text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
            <Calendar className="h-8 w-8 text-blue-500"/> ساخت رویداد جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="mb-2 block text-sm text-gray-400">عنوان رویداد</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="مثلاً: کارگاه پایتون مقدماتی" required />
                </div>
                <div>
                    <label className="mb-2 block text-sm text-gray-400">آدرس URL (Slug)</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="مثلاً: python-workshop-1" required />
                </div>
            </div>

            {/* توضیحات */}
            <div>
                <label className="mb-2 block text-sm text-gray-400">توضیحات کامل</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="جزئیات، سرفصل‌ها و پیش‌نیازهای رویداد را بنویسید..." required />
            </div>
            
            {/* 🚨 FIX: افزودن فیلدهای مورد نیاز */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* وضعیت رویداد */}
                <div>
                    <label className="mb-2 block text-sm text-gray-400">وضعیت رویداد</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition"
                        required
                    >
                        <option value="scheduled">زمان‌بندی شده</option>
                        <option value="open">فعال (باز)</option>
                        <option value="closed">بسته (ظرفیت تکمیل)</option>
                        <option value="cancelled">لغو شده</option>
                    </select>
                </div>
            </div>
            
            {/* 🚨 FIX: تاریخ و ساعت شروع */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <label className="mb-2 block text-sm text-gray-400">تاریخ شروع</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
                        className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition ltr-text"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm text-gray-400">ساعت شروع</label>
                    <div className="relative">
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required
                            className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition ltr-text pr-10"
                        />
                    </div>
                </div>
                
                {/* تاریخ و ساعت پایان */}
                <div>
                    <label className="mb-2 block text-sm text-gray-400">تاریخ پایان</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                        className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition ltr-text"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm text-gray-400">ساعت پایان</label>
                    <div className="relative">
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                            className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition ltr-text pr-10"
                        />
                    </div>
                </div>
            </div>


            {/* مکان و ظرفیت */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="mb-2 block text-sm text-gray-400">مکان برگزاری</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="مثلاً: سالن همایش‌های شهید چمران" required />
                </div>
                <div>
                    <label className="mb-2 block text-sm text-gray-400">حداکثر ظرفیت</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="مثلاً: 100" required />
                </div>
            </div>

            {/* قیمت و لینک ثبت نام */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1">
                    <label className="mb-2 block text-sm text-gray-400">آیا رویداد رایگان است؟</label>
                    <button type="button" onClick={handleToggleFree} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${formData.isFree ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                        <DollarSign className="h-5 w-5"/> {formData.isFree ? 'بله، رایگان است' : 'خیر، پولی است'}
                    </button>
                </div>
                {!formData.isFree && (
                    <div className="md:col-span-1">
                        <label className="mb-2 block text-sm text-gray-400">هزینه (تومان)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="مثلاً: 50000" required={!formData.isFree} />
                    </div>
                )}
                <div className={formData.isFree ? 'md:col-span-2' : 'md:col-span-1'}>
                    <label className="mb-2 block text-sm text-gray-400">لینک ثبت نام (اختیاری)</label>
                    <input name="registrationLink" value={formData.registrationLink} onChange={handleChange} className="w-full bg-slate-950 border border-gray-700 p-3 rounded-xl text-white focus:border-blue-500 outline-none transition" placeholder="لینک ثبت نام خارجی (مثلاً ایوند)" />
                </div>
            </div>

            {/* آپلود تصویر کاور */}
            <ImageUploader 
              onUpload={setImageUrl} 
              defaultImage={imageUrl}
              label="آپلود تصویر کاور رویداد"
            />

            <button 
                type="submit"
                disabled={loading} 
                className="w-full bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-500 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
                {loading ? <Loader2 className="animate-spin"/> : <><Save className="h-5 w-5"/> انتشار رویداد</>}
            </button>
        </form>
    </div>
  );
}