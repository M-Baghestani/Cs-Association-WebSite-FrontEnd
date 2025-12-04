// src/components/Footer.tsx
import { Github, Linkedin, Instagram, Code2, Send } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 text-gray-400 bg-slate-950/90 backdrop-blur-md border-t border-white/5">
      
      {/* افکت نئون پس‌زمینه در پایین */}
      <div className="container max-w-7xl mx-auto grid gap-8 md:gap-10 px-6 md:grid-cols-4 lg:grid-cols-4"/>

      <div className="container max-w-7xl mx-auto grid gap-10 px-6 md:grid-cols-4 lg:grid-cols-4">
        
        {/* بخش اول: معرفی و لوگو */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl mb-4">
            <Code2 className="w-6 h-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CS Association
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            هدف ما ارتقای سطح علمی دانشجویان، برگزاری کارگاه‌های تخصصی و ایجاد محیطی پویا برای یادگیری تکنولوژی‌های جدید است.
          </p>
        </div>

        {/* بخش دوم: دسترسی سریع */}
        <div className="md:col-span-1">
          <h3 className="mb-5 text-base font-extrabold text-white border-b-2 border-purple-500/50 w-fit pb-1">
            دسترسی سریع
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/events" className="hover:text-cyan-400 transition">رویدادها</Link></li>
            <li><Link href="/blog" className="hover:text-cyan-400 transition">اخبار و مقالات</Link></li>
            <li><Link href="/team" className="hover:text-cyan-400 transition">آشنایی با اعضا</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-400 transition">داشبورد کاربری</Link></li>
          </ul>
        </div>

        {/* بخش سوم: منابع و ارتباط */}
        <div className="md:col-span-1">
          <h3 className="mb-5 text-base font-extrabold text-white border-b-2 border-purple-500/50 w-fit pb-1">
            ارتباط
          </h3>
          <ul className="space-y-3 text-sm">
            <li className='flex gap-2 items-center'>
                <span className='text-cyan-400'>📧</span>
                <span className='text-gray-300'>mh.baghestani@khu.ac.ir</span>
            </li>
            <li className='flex gap-2 items-center'>
                <span className='text-cyan-400'>📍</span>
                <span className='text-gray-300'>دانشکده علوم ریاضی و کامپیوتر</span>
            </li>
            <li className='flex gap-2 items-center'>
                <span className='text-cyan-400'>💬</span>
                <Link href="/contact" className="hover:text-red-400 font-medium">انتقادات و پیشنهادات</Link>
            </li>
          </ul>
        </div>

        {/* بخش چهارم: شبکه‌های اجتماعی */}
        <div className="md:col-span-1">
          <h3 className="mb-5 text-base font-extrabold text-white border-b-2 border-purple-500/50 w-fit pb-1">
            ما را دنبال کنید
          </h3>
          <div className="flex gap-4">
            <a href="https://t.me/cs_khu" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-sky-500/20 text-gray-400 hover:text-sky-400 transition transform hover:scale-110">
                <Send className="h-6 w-6" />
            </a>
            {/* <a href="#" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition transform hover:scale-110">
                <Github className="h-6 w-6" />
            </a> */}
            <a href="https://www.linkedin.com/company/cskhu/" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
                <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/cs.khu?igsh=MXU0NWQ5eWJlamRqMA==" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-pink-600/20 text-gray-400 hover:text-pink-400 transition transform hover:scale-110">
                <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>

      </div>
      
      {/* کپی‌رایت و برندینگ توسعه‌دهنده (اصلاح شده) */}
      <div className="mt-12 container max-w-7xl mx-auto border-t border-white/5 pt-6 text-center">
        {/* FIX 1: بزرگتر کردن متن کپی رایت */}
        <p className="mb-1 text-sm text-white font-medium">
          © {currentYear} تمامی حقوق برای انجمن علمی علوم کامپیوتر دانشگاه خوارزمی محفوظ است.
        </p>
        {/* FIX 2: حذف underline و افزودن نئون به لینک */}
        <p className="text-gray-500 font-semibold text-xs">
           Developed With <span className="text-red-500">💖</span> by{' '}
           <a 
               href="https://github.com/m.h.baghestani" 
               target="_blank" 
               rel="noopener noreferrer"
               // حذف underline و افزودن shadow (نئون)
               className="text-cyan-400 hover:text-cyan-300 transition no-underline font-bold drop-shadow-lg"
           >
               Cs Association
           </a>
        </p>
      </div>
    </footer>
  );
}