// src/app/events/page.tsx
import { Archive, Hourglass } from "lucide-react";
import EventCard from "../../components/EventCard";
import fetchEvents from "../../utils/fetchEvents";
import { EventType } from "../../types/event";

// جلوگیری از کش شدن دیتا برای دریافت لحظه‌ای وضعیت‌ها
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { events, error } = await fetchEvents();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        خطا در دریافت اطلاعات رویدادها. لطفاً دوباره تلاش کنید.
      </div>
    );
  }

  const allEvents = events as EventType[];

  // 🔽 فیلتر کردن رویدادها
  const openEvents = allEvents.filter((e) => e.registrationStatus === "OPEN");
  const scheduledEvents = allEvents.filter((e) => e.registrationStatus === "SCHEDULED");
  
  // ✅ اصلاح شد: حذف وضعیت نامعتبر ENDED
  const pastEvents = allEvents.filter((e) => e.registrationStatus === "CLOSED");

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto container">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          رویدادهای انجمن
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          تازه‌ترین کارگاه‌ها، سمینارها و مسابقات علمی انجمن کامپیوتر
        </p>
      </div>

      {/* 🟢 بخش ۱: رویدادهای فعال (در حال ثبت‌نام) */}
      {openEvents.length > 0 && (
        <div className="mb-20 animate-fadeIn">
          <div className="flex items-center gap-3 mb-8 border-b border-green-500/30 pb-4">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
            <h2 className="text-2xl font-bold text-white">در حال ثبت‌نام (فعال)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {openEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* 🟡 بخش ۲: رویدادهای آینده (برنامه‌ریزی شده) */}
      {scheduledEvents.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8 border-b border-yellow-500/30 pb-4">
            <Hourglass className="w-6 h-6 text-yellow-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">رویدادهای پیش‌رو (به زودی)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scheduledEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* اگر هیچ رویداد فعال یا برنامه‌ریزی شده‌ای نبود */}
      {openEvents.length === 0 && scheduledEvents.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-dashed border-gray-700 mb-20">
          <p className="text-gray-500 text-lg">در حال حاضر رویداد فعالی وجود ندارد.</p>
        </div>
      )}

      {/* ⚫ بخش ۳: بایگانی رویدادها (پایین) */}
      {pastEvents.length > 0 && (
        <div className="opacity-70 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Archive className="w-6 h-6 text-gray-500" />
            <h2 className="text-2xl font-bold text-gray-400">بایگانی رویدادهای گذشته</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grayscale hover:grayscale-0 transition-all duration-500">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} isPast={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}