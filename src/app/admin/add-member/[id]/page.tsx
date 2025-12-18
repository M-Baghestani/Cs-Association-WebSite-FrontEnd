"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// مسیر کامپوننت‌ها را بر اساس ساختار پروژه‌تان تنظیم کنید
import ImageUploader from '../../../../components/ImageUploader'; 
import BackButton from '../../../../components/BackButton';
import { User, Loader2, Save, Github, Linkedin, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // استیت‌های فرم
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  
  // لینک‌های اجتماعی
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  // ۱. دریافت اطلاعات فعلی عضو
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // ابتدا کل لیست اعضا را می‌گیریم و عضو مورد نظر را پیدا می‌کنیم
        // (این روش مطمئن‌تر است چون شاید روت دریافت تکی نداشته باشید)
        const res = await axios.get(`${API_URL}/members`);
        
        if (res.data.success) {
          const members = res.data.data;
          const foundMember = members.find((m: any) => m._id === id);

          if (foundMember) {
             setName(foundMember.name);
             setRole(foundMember.role);
             setBio(foundMember.bio || '');
             setImage(foundMember.image);
             setGithubUrl(foundMember.githubUrl || '');
             setLinkedinUrl(foundMember.linkedinUrl || '');
             setTwitterUrl(foundMember.twitterUrl || '');
          } else {
             toast.error('عضو مورد نظر یافت نشد');
             router.push('/admin/manage-members');
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات");
        router.push('/admin/manage-members');
      } finally {
        setLoadingData(false);
      }
    };

    if (id) fetchMemberData();
  }, [id, router]);

  // ۲. ارسال تغییرات به سرور
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      // ارسال درخواست PUT برای آپدیت
      await axios.put(`${API_URL}/members/${id}`, {
        name,
        role,
        bio,
        image,
        githubUrl,
        linkedinUrl,
        twitterUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('اطلاعات عضو با موفقیت ویرایش شد');
      router.push('/admin/manage-members');
    } catch (error) {
      console.error(error);
      toast.error('خطا در ویرایش اطلاعات');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-cyan-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 pt-24">
      <div className="max-w-3xl mx-auto">
        
        {/* هدر صفحه */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            <User className="h-7 w-7" />
            ویرایش عضو انجمن
          </h1>
          <BackButton />
        </div>

        {/* فرم ویرایش */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* بخش عکس پروفایل */}
            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl bg-black">
                    {image ? (
                        <img src={image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <User className="h-16 w-16" />
                        </div>
                    )}
                </div>
                <div className="w-full">
                    <ImageUploader 
                        label="تغییر عکس پروفایل" 
                        onUpload={(url) => setImage(url)} 
                    />
                </div>
            </div>

            {/* فیلدهای متنی */}
            <div className="flex-1 w-full space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">نام و نام خانوادگی</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                        placeholder="مثال: علی محمدی"
                        required 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">سمت / نقش</label>
                    <input 
                        type="text" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                        placeholder="مثال: دبیر انجمن، گرافیک دیزاینر..."
                        required 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">بیوگرافی کوتاه</label>
                    <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 h-28 outline-none focus:border-yellow-500 transition resize-none"
                        placeholder="توضیحات کوتاه درباره فعالیت‌ها..."
                    />
                </div>
            </div>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div className="pt-6 border-t border-white/10">
             <h3 className="text-sm font-bold text-gray-400 mb-4">لینک‌های شبکه اجتماعی (اختیاری)</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* لینکدین */}
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1">
                        <Linkedin className="h-3 w-3" /> LinkedIn URL
                    </label>
                    <input 
                      type="text" 
                      value={linkedinUrl} 
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-sm focus:border-blue-500 outline-none dir-ltr placeholder:text-gray-700"
                    />
                </div>

                {/* گیت‌هاب */}
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1">
                        <Github className="h-3 w-3" /> GitHub URL
                    </label>
                    <input 
                      type="text" 
                      value={githubUrl} 
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-sm focus:border-gray-500 outline-none dir-ltr placeholder:text-gray-700"
                    />
                </div>

                {/* توییتر */}
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1">
                        <Twitter className="h-3 w-3" /> Twitter / X URL
                    </label>
                    <input 
                      type="text" 
                      value={twitterUrl} 
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-sm focus:border-sky-500 outline-none dir-ltr placeholder:text-gray-700"
                    />
                </div>
             </div>
          </div>

          {/* دکمه ذخیره */}
          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                ذخیره تغییرات
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}