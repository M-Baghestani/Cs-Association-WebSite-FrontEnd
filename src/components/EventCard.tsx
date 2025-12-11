import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { toShamsiDate } from '../utils/date';
import CountdownTimer from './Event/CountdownTimer'; // ایمپورت تایمر

interface EventProps {
  event: any; 
  isPast?: boolean;
}

export default function EventCard({ event, isPast = false }: EventProps) {
  const eventId = event._id || event.id;
  // بررسی وضعیت "برنامه‌ریزی شده"
  const isScheduled = event.registrationStatus === 'SCHEDULED';

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border ${isPast ? 'border-white/5 bg-slate-900/30' : 'border-white/10 bg-slate-900/80'} transition hover:border-blue-500/50 hover:shadow-2xl`}>
      
      {/* تصویر */}
      <div className="relative h-52 w-full bg-slate-800 overflow-hidden">
        <img
          src={event.thumbnail || "https://placehold.co/600x400/1e293b/ffffff?text=Event"}
          alt={event.title}
          className={`w-full h-full object-cover transition duration-700 group-hover:scale-110 ${isPast ? 'grayscale-[80%]' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        {/* بج وضعیت */}
        <div className="absolute top-4 right-4 z-10">
            {isPast ? (
                <span className="px-3 py-1 rounded-full bg-black/60 text-gray-300 text-xs font-bold border border-white/10 backdrop-blur-md">
                    پایان یافته
                </span>
            ) : isScheduled ? (
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-xs font-bold backdrop-blur-md">
                    آغاز ثبت‌نام به زودی
                </span>
            ) : (
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold backdrop-blur-md">
                    در حال ثبت‌نام
                </span>
            )}
        </div>

        {/* ⏰ نمایش تایمر اگر وضعیت SCHEDULED بود */}
        {isScheduled && event.registrationOpensAt && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2 z-0">
                <div className="scale-75 origin-center">
                    <CountdownTimer opensAt={event.registrationOpensAt} eventTitle={event.title} />
                </div>
            </div>
        )}
      </div>

      {/* محتوا */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`mb-3 text-lg font-bold transition line-clamp-2 ${isPast ? 'text-gray-400' : 'text-white group-hover:text-blue-400'}`}>
          {event.title}
        </h3>
        
        <div className="space-y-3 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500/70" />
            <span>{toShamsiDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500/70" />
            <span>{new Date(event.date).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500/70" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto">
          {isScheduled ? (
             <button disabled className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold bg-white/5 text-gray-500 cursor-not-allowed">
                ثبت‌نام هنوز شروع نشده
             </button>
          ) : (
            <Link 
                href={`/events/${eventId}`} 
                className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold transition ${
                    isPast 
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10' 
                    : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'
                }`}
            >
                {isPast ? 'مشاهده آرشیو' : 'مشاهده جزئیات'} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}