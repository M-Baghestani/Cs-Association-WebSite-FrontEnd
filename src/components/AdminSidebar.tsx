// src/components/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, // برای مدیریت کاربران
  UserPlus, // برای مدیریت اعضای تیم
  FileText, 
  LogOut, 
  Plus, 
  Image as ImageIcon,
  UserCheck // آیکون برای مدیریت اعضا
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('با موفقیت خارج شدید.');
    router.push('/');
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'داشبورد اصلی' },
    { href: '/admin/manage-events', icon: Ticket, label: 'مدیریت رویدادها' },
    { href: '/admin/manage-journals', icon: FileText, label: 'مدیریت نشریات' },
    { href: '/admin/manage-gallery', icon: ImageIcon, label: 'مدیریت گالری' },
    // ✅ اضافه شدن مدیریت اعضای تیم
    { href: '/admin/manage-members', icon: UserCheck, label: 'مدیریت اعضا' },
    { href: '/admin/users', icon: Users, label: 'مدیریت کاربران' },
  ];
  
  const createItems = [
    { href: '/admin/create-event', icon: Plus, label: 'رویداد جدید' },
    { href: '/admin/create-journal', icon: Plus, label: 'نشریه جدید' },
    { href: '/admin/create-gallery', icon: Plus, label: 'گالری جدید' },
    // ✅ اضافه شدن ایجاد عضو جدید
    { href: '/admin/add-member', icon: Plus, label: 'عضو جدید' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-white/10 p-4 pt-8 overflow-y-auto">
      
      <h2 className="text-2xl font-black text-cyan-400 mb-8 border-b border-white/10 pb-3">
        پنل مدیریت
      </h2>

      <nav className="grow space-y-4">
        {/* لینک‌های اصلی */}
        <div className="space-y-2">
            {navItems.map((item) => {
            // منطق فعال بودن لینک
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition duration-200 ${
                    isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
                >
                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span className="font-medium">{item.label}</span>
                </Link>
            );
            })}
        </div>

        {/* لینک‌های ساخت محتوا */}
        <h3 className="text-xs font-bold text-gray-500 uppercase pt-4 border-t border-white/10 px-2">
            ایجاد محتوا
        </h3>
        <div className="space-y-2">
            {createItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition duration-200 ${
                         pathname === item.href 
                         ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                         : 'text-gray-400 hover:bg-slate-800 hover:text-green-400'
                    }`}
                >
                    <item.icon className="h-5 w-5"/>
                    <span className="font-medium">{item.label}</span>
                </Link>
            ))}
        </div>
      </nav>

      {/* دکمه خروج */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 p-3 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition duration-200 border border-red-500/10"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">خروج از پنل</span>
      </button>
    </div>
  );
};

export default AdminSidebar;