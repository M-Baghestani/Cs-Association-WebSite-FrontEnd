"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "../../../../components/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams(); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); 
  
  const [formData, setFormData] = useState<any>({
    title: "", slug: "", description: "", date: "", location: "",
    capacity: 0, price: 0, isFree: false, thumbnail: "",
    registrationStatus: 'OPEN', registrationOpensAt: ''
  });

  // 1. دریافت اطلاعات فعلی رویداد
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${params.id}`);
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          
          // فرمت کردن تاریخ‌ها برای input datetime-local
          // (برش زدن ثانیه و میلی ثانیه برای سازگاری با اینپوت HTML)
          const dateStr = d.date ? new Date(d.date).toISOString().slice(0, 16) : '';
          const opensAtStr = d.registrationOpensAt ? new Date(d.registrationOpensAt).toISOString().slice(0, 16) : '';

          setFormData({ ...d, date: dateStr, registrationOpensAt: opensAtStr });
          setImageUrl(d.thumbnail); // لود عکس قبلی
        }
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات رویداد");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchEvent();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isFree') {
         const checked = (e.target as HTMLInputElement).checked;
         setFormData((prev: any) => ({ ...prev, isFree: checked, price: checked ? 0 : prev.price }));
    } else if (type === 'number') {
         setFormData((prev: any) => ({ ...prev, [name]: Number(value) }));
    } else {
         setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    const payload = {
        ...formData,
        thumbnail: imageUrl, // استفاده از عکس جدید (یا قبلی)
        price: formData.isFree ? 0 : formData.price,
    };

    try {
      const res = await fetch(`${API_URL}/events/${params.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("رویداد با موفقیت ویرایش شد ✅");
        router.push("/admin/manage-events");
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("مشکلی پیش آمد.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-white">در حال دریافت اطلاعات...</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold text-white">ویرایش رویداد ✏️</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md">
        
        <ImageUploader 
          onUpload={setImageUrl} 
          defaultImage={imageUrl} // نمایش عکس فعلی
          label="تصویر کاور" 
        />

        <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm text-gray-400 mb-2">عنوان</label><input name="title" value={formData.title} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">اسلاگ</label><input name="slug" value={formData.slug} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white focus:ring-2 focus:ring-green-500" /></div>
        </div>

        <div><label className="block text-sm text-gray-400 mb-2">توضیحات</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="w-full rounded-lg bg-white/5 p-3 text-white focus:ring-2 focus:ring-green-500" /></div>

        <div className="grid md:grid-cols-3 gap-6">
            <div><label className="block text-sm text-gray-400 mb-2">تاریخ</label><input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">مکان</label><input name="location" value={formData.location} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">ظرفیت</label><input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full rounded-lg bg-white/5 p-3 text-white focus:ring-2 focus:ring-green-500" /></div>
        </div>

        {/* تنظیمات وضعیت ثبت‌نام */}
        <div className="bg-slate-800/50 p-5 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">وضعیت ثبت‌نام</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">وضعیت</label>
                    <select name="registrationStatus" value={formData.registrationStatus} onChange={handleChange} className="w-full rounded-lg bg-slate-950 border border-gray-700 p-3 text-white focus:ring-2 focus:ring-blue-500">
                        <option value="OPEN">باز</option>
                        <option value="SCHEDULED">زمان‌بندی شده</option>
                        <option value="CLOSED">بسته شده</option>
                    </select>
                </div>
                {formData.registrationStatus === 'SCHEDULED' && (
                    <div>
                        <label className="block text-sm text-yellow-400 mb-2">تاریخ بازگشایی</label>
                        <input type="datetime-local" name="registrationOpensAt" value={formData.registrationOpensAt} onChange={handleChange} className="w-full rounded-lg bg-slate-950 border border-yellow-600/50 p-3 text-white focus:ring-2 focus:ring-yellow-500" />
                    </div>
                )}
            </div>
        </div>

        {/* قیمت */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
                <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="h-4 w-4 rounded border-gray-600 bg-gray-700" />
                <label className="text-sm font-medium text-gray-300">این رویداد رایگان است.</label>
            </div>
            {!formData.isFree && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">قیمت (تومان)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="block w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white" />
                </div>
            )}
        </div>

        <button disabled={saving} type="submit" className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-500 flex justify-center gap-2">
           {saving ? <Loader2 className="animate-spin"/> : <><Save className="h-5 w-5"/> ذخیره تغییرات</>}
        </button>
      </form>
    </div>
  );
}