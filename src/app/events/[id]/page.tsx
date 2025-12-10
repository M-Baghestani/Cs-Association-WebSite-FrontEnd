// src/app/events/[id]/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import EventRegisterWrapper from './EventRegisterWrapper';
// import EventQuestionForm from '../../../components/EventQuestionForm'; // در صورت نیاز آنکامنت کنید
import { EventType } from '../../../types/event';
import { toShamsiDate } from '../../../utils/date';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// تعریف نوع ورودی صفحه طبق استاندارد Next.js 15
type Props = {
  params: Promise<{ id: string }>;
};

// تابع دریافت رویداد
async function fetchEventById(id: string): Promise<EventType | null> {
  try {
    const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch (err) {
    console.error("fetchEventById error:", err);
    return null;
  }
}

// تولید متادیتا (اصلاح شده برای Next.js 15)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // 👈 باید await شود
  const event = await fetchEventById(id);
  
  if (!event) return { title: "رویداد یافت نشد" };
  return { title: `${event.title} | رویداد انجمن علمی کامپیوتر` };
}

// کامپوننت صفحه جزئیات (اصلاح شده)
export default async function EventDetailPage({ params }: Props) {
  const { id } = await params; // 👈 در نسخه‌های جدید params یک Promise است
  const event = await fetchEventById(id);

  if (!event) {
    return (
        <div className="min-h-screen pt-32 text-center text-white">
            <h1 className="text-2xl font-bold">رویداد یافت نشد 😕</h1>
            <Link href="/events" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
                بازگشت به لیست رویدادها
            </Link>
        </div>
    );
  }

  const formattedDate = toShamsiDate(event.date);

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl text-white">
      <Link href="/events" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white w-fit transition">
        ← بازگشت به رویدادها
      </Link>

      {/* کاور رویداد */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-slate-800">
        <img 
            src={event.thumbnail || "https://picsum.photos/800/600"} 
            alt={event.title} 
            className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* عنوان */}
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {event.title}
      </h1>

      {/* اطلاعات کلیدی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300 mb-10 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Calendar className="h-5 w-5 text-blue-400" /></div>
            <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><MapPin className="h-5 w-5 text-blue-400" /></div>
            <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="h-5 w-5 text-blue-400" /></div>
            <span>ظرفیت: {event.registeredCount} / {event.capacity}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><DollarSign className="h-5 w-5 text-blue-400" /></div>
            <span className="font-bold text-white">
                {event.isFree ? "رایگان 🎁" : `${event.price.toLocaleString('fa-IR')} تومان`}
            </span>
        </div>
      </div>

      {/* توضیحات */}
      <div className="bg-slate-900/30 p-8 rounded-2xl border border-white/5 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-white border-r-4 border-blue-500 pr-3">توضیحات رویداد</h2>
        <p className="leading-8 text-gray-300 whitespace-pre-wrap text-lg text-justify">
            {event.description}
        </p>
      </div>

      {/* بخش ثبت‌نام */}
      <div className="mt-10">
        <EventRegisterWrapper event={event} />
      </div>
    </div>
  );
}