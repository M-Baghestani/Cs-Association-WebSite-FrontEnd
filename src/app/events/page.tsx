// src/app/events/page.tsx
import EventCard from "../../components/EventCard";
import { fetchEvents } from "../../utils/fetchEvents";
import { EventType } from "../../types/event";

// جلوگیری از کش شدن دیتا برای دریافت لحظه‌ای وضعیت‌ها
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: EventType[] = [];

  try {
    events = await fetchEvents();
  } catch (error) {
    console.error("Failed to fetch events", error);
  }

  // ✅ جداسازی و مرتب‌سازی: فعال‌ها بالا، غیرفعال‌ها پایین
  const activeEvents = events.filter(
    (e) => e.registrationStatus !== "CLOSED" && e.registrationStatus !== "ENDED"
  );
  
  const pastEvents = events.filter(
    (e) => e.registrationStatus === "CLOSED" || e.registrationStatus === "ENDED"
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
          رویدادها و کارگاه‌ها
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          در رویدادهای انجمن علمی کامپیوتر شرکت کنید، مهارت‌های جدید یاد بگیرید و شبکه ارتباطی خود را گسترش دهید.
        </p>
      </div>

      {/* ✅ بخش رویدادهای فعال (بالا) */}
      {activeEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 border-r-4 border-blue-500 pr-4">
            🔥 رویدادهای پیش‌رو و فعال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* ✅ بخش رویدادهای گذشته/غیرفعال (پایین) */}
      {pastEvents.length > 0 && (
        <div className="opacity-80">
          <h2 className="text-2xl font-bold text-gray-400 mb-8 border-r-4 border-gray-600 pr-4">
            📂 رویدادهای گذشته و تکمیل شده
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grayscale hover:grayscale-0 transition-all duration-500">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-12 border border-dashed border-gray-700 p-12 rounded-3xl">
          هنوز رویدادی تعریف نشده است.
        </div>
      )}
    </div>
  );
}