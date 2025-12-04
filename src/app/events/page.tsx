// src/app/events/page.tsx
import { Suspense } from 'react';
import { Search, AlertCircle, CalendarX } from 'lucide-react';
import EventCard from '../../components/EventCard'; 
import CountdownTimer from '../../components/Event/CountdownTimer';
import { Metadata } from "next"; 
// 🚨 FIX: فرض بر وجود توابع fetch
import fetchEvents from "../../utils/fetchEvents"; 

// 🚨 FIX: سئوی اختصاصی صفحه لیست رویدادها (Static Metadata)
export const metadata: Metadata = {
  title: 'رویدادها، کارگاه‌ها و مسابقات انجمن علمی کامپیوتر خوارزمی',
  description: 'لیست کامل رویدادهای پیش‌رو و برگزار شده شامل کارگاه‌های آموزشی، وبینارها، مسابقات برنامه‌نویسی و همایش‌های علمی.',
  keywords: ['رویدادها', 'کارگاه', 'مسابقه برنامه نویسی', 'وبینار', 'دانشگاه خوارزمی', 'انجمن علمی'],
};


interface EventData {
    _id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    registeredCount: number;
    capacity: number;
    thumbnail?: string;
    registrationStatus?: 'SCHEDULED' | 'OPEN' | 'CLOSED';
    registrationOpensAt?: string;
}

// 🚨 FIX: استفاده از تابع fetchEvents برای فراخوانی داده‌ها
async function getAllEvents(): Promise<{ data: EventData[], error: boolean }> {
    const { events, error } = await fetchEvents();
    return { data: events, error };
}

export default async function EventsPage() {
    // 🚨 FIX: فراخوانی داده‌ها در Server Component
    const { data: allEvents, error: isServerDown } = await getAllEvents();

    // فیلتر کردن رویدادها (این منطق باید روی Server هم کار کند)
    const openEvents = allEvents.filter(e => e.registrationStatus === 'OPEN' || !e.registrationStatus);
    const scheduledEvents = allEvents.filter(e => e.registrationStatus === 'SCHEDULED');

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-7xl text-white">

            {/* HEADER */}
            <div className="text-center py-10 mb-10 border-b border-white/10">
                <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    رویدادهای انجمن
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    جدیدترین کارگاه‌ها، دوره‌ها و برنامه‌های انجمن علمی را از دست ندهید.
                </p>
            </div>

            {/* SEARCH BOX */}
            <div className="mb-12 max-w-2xl mx-auto relative">
                {/* ⚠️ توجه: فیلد جستجو باید به یک Client Component منتقل شود تا بتواند state را مدیریت کند */}
                <input
                    type="text"
                    placeholder="جستجو در رویدادها..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:border-blue-500 transition"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            {/* ----------------------------- */}
            {/* ۱. رویدادهای فعال */}
            {/* ----------------------------- */}
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-green-500/50 pb-3 flex items-center gap-3">
                رویدادهای فعال <span className="text-green-400 text-base font-medium">({openEvents.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {openEvents.length === 0 ? (
                    <div className="col-span-3 text-center py-16 bg-slate-900/50 border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500">
                        {isServerDown ? (
                            <>
                                <AlertCircle className="h-12 w-12 text-red-500 mb-3 opacity-80" />
                                <p className="text-red-200 font-bold">ارتباط با سرور برقرار نشد.</p>
                                <p className="text-xs text-red-400/60 mt-1">لطفاً اتصال اینترنت یا وضعیت سرور را بررسی کنید.</p>
                            </>
                        ) : (
                            <>
                                <CalendarX className="h-12 w-12 text-gray-600 mb-3" />
                                <p>در حال حاضر رویداد فعالی وجود ندارد.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <Suspense fallback={<div>در حال بارگذاری...</div>}>
                        {openEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                id={event._id}
                                {...event}
                                registrationStatus={event.registrationStatus || 'OPEN'}
                                registrationOpensAt={event.registrationOpensAt || ''}
                            />
                        ))}
                    </Suspense>
                )}
            </div>

            {/* ----------------------------- */}
            {/* ۲. رویدادهای آینده */}
            {/* ----------------------------- */}
            {!isServerDown && scheduledEvents.length > 0 && (
                <>
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-yellow-500/50 pb-3 flex items-center gap-3">
                        رویدادهای آینده <span className="text-yellow-400 text-base font-medium">({scheduledEvents.length})</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Suspense fallback={<div>در حال بارگذاری...</div>}>
                            {scheduledEvents.map((event) => (
                                <div key={event._id} className="relative group">

                                    {/* کارت مات */}
                                    <div className="opacity-60 pointer-events-none select-none filter grayscale-[50%]">
                                        <EventCard
                                            id={event._id}
                                            {...event}
                                            registrationStatus="SCHEDULED"
                                            registrationOpensAt={event.registrationOpensAt || ''}
                                        />
                                    </div>

                                    {/* لایه تایمر */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl backdrop-blur-sm p-4 border border-yellow-500/30 transition group-hover:bg-slate-950/70 z-10">
                                        <CountdownTimer
                                            opensAt={event.registrationOpensAt || ''}
                                            eventTitle={event.title}
                                        />
                                        <p className="text-sm text-yellow-200/70 mt-6 font-medium bg-yellow-900/20 px-4 py-1.5 rounded-full border border-yellow-500/20">
                                            ثبت‌نام هنوز باز نشده است
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </Suspense>
                    </div>
                </>
            )}
        </div>
    );
}