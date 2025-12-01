// src/components/EventCard.tsx

import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  registeredCount: number;
  slug: string;
  thumbnail?: string; 
  registrationStatus: 'SCHEDULED' | 'OPEN' | 'CLOSED'; // 🚨 جدید
  registrationOpensAt: string; // 🚨 جدید
}

export default function EventCard({ 
  title, 
  date, 
  location, 
  capacity, 
  registeredCount, 
  slug,
  thumbnail,
  registrationStatus 
}: EventProps) {
  
  const formattedDate = new Date(date).toLocaleDateString('fa-IR');

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
      
      {/* === بخش تصویر === */}
      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
        <img
          src={thumbnail || "https://picsum.photos/600/400"} 
          alt={`کاور رویداد: ${title}`} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      </div>
      
      {/* === بخش محتوا === */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-xl font-bold text-white transition group-hover:text-blue-400">
          {title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{registeredCount} / {capacity} نفر</span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          {/* دکمه ثبت نام بر اساس وضعیت */}
          {registrationStatus === 'OPEN' && (
            <Link 
              href={`/events/${slug}`} 
              className="block w-full rounded-lg bg-white/5 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-600"
            >
              ثبت نام / جزئیات
            </Link>
          )}
          {registrationStatus === 'SCHEDULED' && (
             <div className="block w-full rounded-lg bg-yellow-900/20 py-2 text-center text-sm font-medium text-yellow-400">
              به زودی باز می‌شود
             </div>
          )}
        </div>
      </div>
    </div>
  );
}