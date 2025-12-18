"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Users, 
  Github, 
  Linkedin, 
  Twitter,
  Edit,
  Search
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
// مسیر BackButton را چک کنید (ممکن است ../../ باشد بسته به ساختار پوشه)
import BackButton from "../../../components/BackButton"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ۱. دریافت لیست اعضا از سرور
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/members`);
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در دریافت لیست اعضا");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ۲. تابع حذف عضو
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این عضو مطمئن هستید؟")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("عضو با موفقیت حذف شد");
      // حذف از لیست بدون رفرش صفحه
      setMembers(members.filter((m) => m._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف عضو");
    }
  };

  // ۳. فیلتر کردن اعضا بر اساس جستجو
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-cyan-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* --- هدر صفحه --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Users className="h-6 w-6 text-cyan-400" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-white">مدیریت اعضای انجمن</h1>
                <p className="text-sm text-slate-400">لیست تمام اعضای تیم و انجمن علمی</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <BackButton />
             {/* دکمه افزودن عضو جدید */}
             <Link 
               href="/admin/add-member" 
               className="flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition shadow-lg shadow-cyan-900/20 whitespace-nowrap"
             >
               <Plus className="h-5 w-5" />
               عضو جدید
             </Link>
          </div>
        </div>

        {/* --- نوار جستجو --- */}
        <div className="relative mb-8">
            <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-500" />
            <input 
                type="text" 
                placeholder="جستجوی نام یا سمت..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pr-12 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-500 outline-none transition text-white"
            />
        </div>

        {/* --- لیست اعضا --- */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-white/10">
            <Users className="h-16 w-16 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">هیچ عضوی یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div 
                key={member._id} 
                className="group relative bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  {/* عکس پروفایل */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0">
                    {member.image ? (
                        <Image 
                            src={member.image} 
                            alt={member.name} 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Users className="h-6 w-6" />
                        </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{member.name}</h3>
                    <p className="text-cyan-400 text-sm mb-1">{member.role}</p>
                    <p className="text-slate-500 text-xs line-clamp-1">{member.bio || "بدون بیوگرافی"}</p>
                  </div>
                </div>

                {/* آیکون‌های شبکه اجتماعی (نمایشی) */}
                <div className="flex gap-2 mt-4 text-slate-600">
                    {member.githubUrl && <Github className="h-4 w-4 hover:text-white transition" />}
                    {member.linkedinUrl && <Linkedin className="h-4 w-4 hover:text-blue-400 transition" />}
                    {member.twitterUrl && <Twitter className="h-4 w-4 hover:text-sky-400 transition" />}
                </div>

                {/* --- دکمه‌های عملیات --- */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
                  
                  {/* دکمه ویرایش */}
                  <Link 
                    href={`/admin/edit-member/${member._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-yellow-600/10 hover:text-yellow-400 border border-white/5 hover:border-yellow-500/50 transition text-sm font-medium text-slate-300 group/edit"
                  >
                    <Edit className="h-4 w-4 group-hover/edit:scale-110 transition-transform" /> 
                    ویرایش
                  </Link>

                  {/* دکمه حذف */}
                  <button 
                    onClick={() => handleDelete(member._id)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-red-600/10 hover:text-red-400 border border-white/5 hover:border-red-500/50 transition text-slate-400"
                    title="حذف عضو"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}