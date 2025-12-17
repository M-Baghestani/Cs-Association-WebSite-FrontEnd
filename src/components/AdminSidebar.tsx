// // src/components/AdminSidebar.tsx
// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { LayoutDashboard, Ticket, Users, FileText, LogOut, Plus } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// const AdminSidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();

//   // چک کردن دسترسی ادمین (در محیط کلاینت)
//   useEffect(() => {
//     const userStr = localStorage.getItem("user");
//     if (!userStr || JSON.parse(userStr).role !== "admin") {
//       toast.error("شما دسترسی ادمین ندارید.");
//       router.push("/");
//     }
//   }, [router]);


//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     toast.success('با موفقیت خارج شدید.');
//     router.push('/');
//   };

//   const navItems = [
//     { href: '/admin', icon: LayoutDashboard, label: 'داشبورد اصلی' },
//     { href: '/admin/manage-events', icon: Ticket, label: 'مدیریت رویدادها' },
//     { href: '/admin/manage-journals', icon: FileText, label: 'مدیریت نشریات' },
//     { href: '/admin/users', icon: Users, label: 'مدیریت کاربران' },
//   ];
  
//   const createItems = [
//     { href: '/admin/create-event', icon: Plus, label: 'رویداد جدید' },
//     { href: '/admin/create-journal', icon: Plus, label: 'نشریه جدید' },
//   ];

//   return (
//     <div className="flex flex-col h-full bg-slate-900 border-l border-white/10 p-4 pt-8">
      
//       <h2 className="text-2xl font-black text-cyan-400 mb-8 border-b border-white/10 pb-3">
//         پنل مدیریت
//       </h2>

//       <nav className="grow space-y-4">
//         {/* لینک‌های اصلی */}
//         <div className="space-y-2">
//             {navItems.map((item) => {
//             // منطق فعال بودن لینک
//             const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
//             return (
//                 <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center gap-3 p-3 rounded-xl transition duration-200 ${
//                     isActive
//                     ? 'bg-indigo-600 text-white shadow-md'
//                     : 'text-gray-300 hover:bg-slate-800/70 hover:text-white'
//                 }`}
//                 >
//                 <item.icon className="h-5 w-5" />
//                 <span className="font-medium">{item.label}</span>
//                 </Link>
//             );
//             })}
//         </div>

//         {/* لینک‌های ساخت محتوا */}
//         <h3 className="text-sm font-semibold text-gray-400 uppercase pt-4 border-t border-white/10">ایجاد محتوا</h3>
//         <div className="space-y-2">
//             {createItems.map((item) => (
//                 <Link
//                     key={item.href}
//                     href={item.href}
//                     className="flex items-center gap-3 p-3 rounded-xl transition duration-200 text-green-400 hover:bg-green-500/20"
//                 >
//                     <item.icon className="h-5 w-5"/>
//                     <span className="font-medium">{item.label}</span>
//                 </Link>
//             ))}
//         </div>
//       </nav>

//       {/* دکمه خروج */}
//       <button
//         onClick={handleLogout}
//         className="mt-4 flex items-center gap-3 p-3 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 transition duration-200"
//       >
//         <LogOut className="h-5 w-5" />
//         <span className="font-medium">خروج از پنل</span>
//       </button>
//     </div>
//   );
// };

// export default AdminSidebar;

"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();

  // لیست منوها با استفاده از کاراکترهای متنی یا اموجی به جای آیکون
  const navigation = [
    { name: 'داشبورد ادمین', href: '/admin', icon: '🏠' },
    { name: 'مدیریت پست‌ها', href: '/admin/manage-posts', icon: '📝' },
    { name: 'مدیریت رویدادها', href: '/admin/manage-events', icon: '📅' },
    { name: 'مدیریت نشریات', href: '/admin/manage-journals', icon: '📚' },
    { name: 'گزارش تصویری (گالری)', href: '/admin/manage-gallery', icon: '🖼️' }, 
    { name: 'ثبت‌نامی‌های رویداد', href: '/admin/registrations', icon: '📋' },
    { name: 'پیام‌های تماس', href: '/admin/messages', icon: '✉️' },
    { name: 'مدیریت کاربران', href: '/admin/users', icon: '👤' },
    { name: 'اعضای تیم', href: '/admin/add-member', icon: '👥' },
  ];

  return (
    <div className="flex h-full flex-col bg-zinc-900 border-l border-zinc-800 w-64">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4 mb-8">
          <span className="text-xl font-bold text-white border-r-4 border-blue-600 pr-3">
            پنل مدیریت
          </span>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                `}
              >
                <span className="ml-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* بخش خروج یا پروفایل در پایین سایدبار (اختیاری) */}
      <div className="p-4 border-t border-zinc-800">
        <Link href="/" className="text-xs text-zinc-500 hover:text-blue-400 transition-colors">
          بازگشت به سایت اصلی ←
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;