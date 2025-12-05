"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Briefcase, Linkedin, Github, FileText, Globe, Send } from "lucide-react"; // 💡 Globe و Send اضافه شدند
import toast from "react-hot-toast";
import ImageUploader from "../../../components/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(""); 
  
  // 💡 State جدید برای نگهداری تمام فیلدهای فرم
  const [formData, setFormData] = useState({
      name: "",
      role: "",
      bio: "",
      linkedin: "",
      github: "",
      website: "", // فیلد جدید
      telegram: "", // فیلد جدید
      gender: "male", // فیلد جدید برای جنسیت
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
    }
  }, [router]);

  // هندلر عمومی برای تغییرات ورودی‌ها
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ساخت دیتای نهایی
    const data = {
        ...formData,
        image: image, // استفاده از لینک آپلود شده
    }
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در افزودن عضو");

      toast.success("✅ عضو جدید با موفقیت اضافه شد!");
      router.push("/team");

    } catch (error) {
      toast.error("مشکلی پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold text-white text-center">افزودن عضو جدید 👤</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md">
        
        {/* آپلودر عکس پروفایل */}
        <div className="mx-auto w-40">
            <ImageUploader onUpload={(url) => setImage(url)} label="عکس پروفایل" />
        </div>

        {/* فیلدهای اصلی */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">نام و نام خانوادگی</label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">سمت در انجمن</label>
            <div className="relative">
              <Briefcase className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="role" required value={formData.role} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          {/* 💡 جدید: انتخاب جنسیت برای آیکون پیش‌فرض */}
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">جنسیت (برای آیکون پیش‌فرض)</label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-500" /> 
              <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option value="male">مرد</option>
                  <option value="female">زن</option>
                  <option value="other">سایر</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">بیوگرافی کوتاه</label>
          <div className="relative">
            <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
            <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-300 border-b border-white/5 pb-2 pt-4">لینک‌های شبکه‌های اجتماعی</h3>
        
        {/* ردیف سوشال مدیا ۱ */}
        <div className="grid gap-6 md:grid-cols-2">
          
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">لینکدین</label>
            <div className="relative">
              <Linkedin className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              {/* 💡 افزودن کلاس‌های ltr-text و text-left برای نمایش صحیح لینک */}
              <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500 ltr-text text-left" placeholder="https://linkedin.com/in/..." />
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">گیت‌هاب</label>
            <div className="relative">
              <Github className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="github" value={formData.github} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500 ltr-text text-left" placeholder="https://github.com/..." />
            </div>
          </div>
        </div>
        
        {/* 💡 ردیف سوشال مدیا ۲ (جدید) */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">وب سایت شخصی</label>
            <div className="relative">
              <Globe className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="website" value={formData.website} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500 ltr-text text-left" placeholder="https://yourwebsite.com" />
            </div>
          </div>
          
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">تلگرام</label>
            <div className="relative">
              <Send className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="telegram" value={formData.telegram} onChange={handleChange} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500 ltr-text text-left" placeholder="@your_telegram_id" />
            </div>
          </div>
        </div>
        
        {/* دکمه ارسال */}
        <button disabled={loading} type="submit" className="mt-4 flex w-full justify-center rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : "افزودن عضو جدید"}
        </button>
      </form>
    </div>
  );
}