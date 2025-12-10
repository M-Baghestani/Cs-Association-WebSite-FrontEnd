"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Calendar, DollarSign, Save, Clock } from "lucide-react";
import ImageUploader from "../../../components/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const combineDateTime = (date: string, time: string) => {
    if (!date) return new Date().toISOString();
    // ترکیب تاریخ و ساعت برای ساخت فرمت ISO
    return time ? new Date(`${date}T${time}:00`).toISOString() : new Date(date).toISOString();
};

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('SCHEDULED');
  
  // مقادیر اولیه تاریخ و ساعت
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    location: '',
    capacity: 50,
    isFree: true,
    price: 0,
    registrationLink: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") router.push("/");
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
      price: !prev.isFree ? 50000 : 0
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
            registrationStatus: status,
            // ترکیب تاریخ و ساعت انتخابی
            date: combineDateTime(startDate, startTime)
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
      <h1 className="mb-8 text-3xl font-bold text-center flex items-center justify-center gap-3">
        <Calendar className="h-8 w-8 text-blue-500"/> ساخت رویداد جدید
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
        {/* عنوان و slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">عنوان رویداد</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-400">آدرس URL (Slug)</label>
            <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none" required />
          </div>
        </div>

        {/* توضیحات */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">توضیحات کامل</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none" placeholder="جزئیات رویداد..." required />
        </div>

        {/* ✅ بخش جدید: تاریخ و ساعت برگزاری */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/50 p-4 rounded-xl border border-white/5">
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4"/> تاریخ برگزاری
                </label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none ltr-text" 
                    required 
                />
            </div>
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4"/> ساعت شروع
                </label>
                <input 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none ltr-text" 
                    required 
                />
            </div>
        </div>

        {/* وضعیت رویداد */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">وضعیت رویداد</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none">
            <option value="SCHEDULED">زمان‌بندی شده</option>
            <option value="OPEN">فعال (ثبت‌نام باز)</option>
            <option value="CLOSED">بسته (پایان یافته)</option>
          </select>
        </div>

        {/* مکان و ظرفیت */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">مکان برگزاری</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-400">حداکثر ظرفیت</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none" required />
          </div>
        </div>

        {/* قیمت و رایگان */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button type="button" onClick={handleToggleFree} className={`py-3 rounded-xl w-full ${formData.isFree ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            <DollarSign className="inline-block mr-2"/> {formData.isFree ? 'رایگان' : 'پولی'}
          </button>
          {!formData.isFree && (
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-950 border p-3 rounded-xl text-white focus:border-blue-500 outline-none" placeholder="هزینه (تومان)" required />
          )}
        </div>

        {/* آپلود تصویر */}
        <ImageUploader onUpload={setImageUrl} defaultImage={imageUrl} label="آپلود تصویر کاور رویداد" />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 py-3 rounded-xl text-white flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin"/> : <Save className="inline-block"/>} انتشار رویداد
        </button>
      </form>
    </div>
  );
}