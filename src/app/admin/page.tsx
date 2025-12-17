"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, FileText, Mail, ArrowRight, 
  Ticket, BarChart3, Loader2, PlusSquare, 
  LayoutDashboard, MessageSquare, BookOpen,
  Image as ImageIcon // ✅ آیکون جدید برای گالری
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr || JSON.parse(userStr).role !== "admin") {
        router.push("/");
        return;
      }
      
      setAdminName(JSON.parse(userStr).name);

      try {
        const res = await axios.get(`${API_URL}/admin/stats`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.data.success) setStats(res.data.stats);
      } catch (error) {
        toast.error("خطا در دریافت آمار.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="container mx-auto max-w-6xl">
        
        {/* هدر */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              داشبورد مدیریت
            </h1>
            <p className="mt-2 text-gray-400">سلام {adminName}، خوش آمدید.</p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            بازگشت به سایت <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="کل کاربران" value={stats?.users} icon={<Users className="h-6 w-6 text-blue-400"/>} color="bg-blue-500/10 border-blue-500/20" href="/admin/users" />
          <StatCard title="رویدادها" value={stats?.events} icon={<Ticket className="h-6 w-6 text-purple-400"/>} color="bg-purple-500/10 border-purple-500/20" href="/admin/manage-events" />
          <StatCard title="ثبت‌نام‌ها" value={stats?.registrations} icon={<PlusSquare className="h-6 w-6 text-green-400"/>} color="bg-green-500/10 border-green-500/20" href="/admin/registrations" />
          <StatCard title="پیام‌ها" value={stats?.messages} icon={<Mail className="h-6 w-6 text-yellow-400"/>} color="bg-blue-500/10 border-blue-500/20" href="/admin/messages" />
         </div>

        <h2 className="text-xl font-bold text-white mb-6">مدیریت محتوا و اعضا</h2>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* رویدادها */}
          <ActionCard href="/admin/create-event" title="ساخت رویداد جدید" icon={<PlusSquare className="h-6 w-6"/>} desc="تعریف رویداد" color="hover:border-green-500/50 hover:bg-green-900/20" />
          <ActionCard href="/admin/manage-events" title="مدیریت رویدادها" icon={<Ticket className="h-6 w-6"/>} desc="لیست، ویرایش و حذف" color="hover:border-teal-500/50 hover:bg-teal-900/20" />
          <ActionCard href="/admin/registrations" title="مدیریت پرداخت‌ها" icon={<LayoutDashboard className="h-6 w-6"/>} desc="تأیید رسیدهای واریزی" color="hover:border-blue-500/50 hover:bg-blue-900/20" />
          
          {/* وبلاگ */}
          <ActionCard href="/admin/create-post" title="نوشتن مقاله جدید" icon={<FileText className="h-6 w-6"/>} desc="انتشار مطلب در وبلاگ" color="hover:border-orange-500/50 hover:bg-orange-900/20" />
          <ActionCard href="/admin/manage-posts" title="مدیریت وبلاگ" icon={<LayoutDashboard className="h-6 w-6"/>} desc="لیست و ویرایش مقالات" color="hover:border-pink-500/50 hover:bg-pink-900/20" />
           
          {/* نشریه */}
          <ActionCard href="/admin/create-journal" title="انتشار نشریه" icon={<BookOpen className="h-6 w-6"/>} desc="آپلود نسخه جدید صفر و یک" color="hover:border-cyan-500/50 hover:bg-cyan-900/20" />
          <ActionCard href="/admin/manage-journals" title="مدیریت نشریات" icon={<LayoutDashboard className="h-6 w-6"/>} desc="لیست و حذف نشریه‌ها" color="hover:border-cyan-500/50 hover:bg-cyan-900/20" />

          {/* ✅ بخش جدید: گالری */}
          <ActionCard href="/admin/create-gallery" title="ثبت گزارش تصویری" icon={<ImageIcon className="h-6 w-6"/>} desc="آپلود تصاویر جدید در گالری" color="hover:border-rose-500/50 hover:bg-rose-900/20" />
          <ActionCard href="/admin/manage-gallery" title="مدیریت گالری" icon={<LayoutDashboard className="h-6 w-6"/>} desc="مشاهده و حذف گزارش‌ها" color="hover:border-rose-500/50 hover:bg-rose-900/20" />

          {/* اعضا و پیام‌ها */}
          <ActionCard href="/admin/add-member" title="افزودن عضو" icon={<Users className="h-6 w-6"/>} desc="مدیریت اعضای انجمن" color="hover:border-purple-500/50 hover:bg-purple-900/20" />
          <ActionCard href="/admin/messages" title="صندوق پیام" icon={<Mail className="h-6 w-6"/>} desc="پیام‌های تماس با ما" baseBg="bg-yellow-900/10 border-yellow-500/20" color="hover:bg-yellow-900/20" />
          <ActionCard href="/admin/comments" title="مدیریت نظرات" icon={<MessageSquare className="h-6 w-6"/>} desc="تأیید و پاسخ به نظرات" color="hover:border-indigo-500/50 hover:bg-indigo-900/20" />
          
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, href }: any) {
  const content = (
      <div className={`p-6 rounded-2xl border ${color} flex flex-col items-center justify-center text-center backdrop-blur-sm bg-slate-900/50 ${href ? 'group transition-all hover:scale-[1.02] hover:shadow-lg hover:border-blue-500' : ''}`}>
        <div className="mb-3 p-3 rounded-full bg-slate-800/80 group-hover:bg-white/10 transition">{icon}</div>
        <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function ActionCard({ href, title, icon, desc, color, baseBg="bg-slate-900 border-white/10" }: any) {
  return (
    <Link href={href} className={`group p-6 rounded-2xl border ${baseBg} transition-all ${color}`}>
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2 rounded-lg bg-white/5 text-white group-hover:scale-110 transition">{icon}</div>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400">{desc}</p>
    </Link>
  );
}