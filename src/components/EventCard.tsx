// src/components/EventCard.tsx
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { toShamsiDate } from '../utils/date';

interface EventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  registeredCount: number;
  slug: string;
  thumbnail?: string;
  registrationStatus: 'SCHEDULED' | 'OPEN' | 'CLOSED';
  registrationOpensAt?: string;
}

export default function EventCard({ 
  id, title, date, location, capacity, registeredCount, thumbnail, registrationStatus
}: EventProps) {
  
  const formattedDate = toShamsiDate(date);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 h-full">
      
      {/* تصویر */}
      <div className="relative h-44 sm:h-48 w-full bg-slate-800 overflow-hidden">
        <img
          src={thumbnail || "https://picsum.photos/600/400"} 
          alt={`کاور ${title}`} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      </div>
      
      {/* محتوا */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-3 text-lg sm:text-xl font-bold text-white leading-tight transition group-hover:text-blue-400 line-clamp-2 min-h-14">
          {title}
        </h3>
        
        <div className="space-y-2.5 text-xs sm:text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500 shrink-0" />
            <span>{registeredCount} / {capacity} نفر</span>
          </div>
        </div>

        <div className="mt-auto">
          {registrationStatus === 'OPEN' && (
            <Link 
              href={`/events/${id}`} 
              className="flex items-center justify-center w-full rounded-xl bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-95"
            >
              ثبت نام / جزئیات
            </Link>
          )}

          {registrationStatus === 'SCHEDULED' && (
            <div className="flex items-center justify-center w-full rounded-xl bg-yellow-900/20 py-3 text-sm font-bold text-yellow-400 border border-yellow-500/10">
              به زودی باز می‌شود
            </div>
          )}
          
           {registrationStatus === 'CLOSED' && (
            <div className="flex items-center justify-center w-full rounded-xl bg-red-900/20 py-3 text-sm font-bold text-red-400 border border-red-500/10">
              بسته شد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}