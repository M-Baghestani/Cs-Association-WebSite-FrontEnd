"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Clock, BellRing } from 'lucide-react';
import toast from 'react-hot-toast';

interface CountdownProps {
  opensAt: string; 
  eventTitle?: string; // برای نمایش در نوتیفیکیشن
}

const calculateTimeLeft = (targetDate: Date) => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;
  
  // اگر زمان گذشته است
  if (isNaN(difference) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
};

export default function CountdownTimer({ opensAt, eventTitle = "رویداد" }: CountdownProps) {
  const router = useRouter();
  const targetDate = new Date(opensAt);
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // اگر زمان تمام شده و هنوز عملیات رفرش انجام نشده
    if (timeLeft.expired && !isRefreshing && mounted) {
        setIsRefreshing(true);
        
        // 🔔 اعلان باز شدن رویداد
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-slate-900 border-2 border-green-500 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                    <BellRing className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-white">
                    ثبت‌نام آغاز شد! 🚀
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    ثبت‌نام برای "{eventTitle}" هم‌اکنون باز شد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ), { duration: 5000, position: 'top-left' });

        // رفرش صفحه برای انتقال رویداد به لیست باز
        router.refresh(); 
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, targetDate, router, isRefreshing, mounted, eventTitle]);

  if (!mounted) return null;

  // 🚨 FIX: اگر زمان تمام شده، هیچ چیزی نشان نده (تا صفحه رفرش شود و دکمه بیاید)
  if (timeLeft.expired) {
    return null; 
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'روز' },
    { value: timeLeft.hours, label: 'ساعت' },
    { value: timeLeft.minutes, label: 'دقیقه' },
    { value: timeLeft.seconds, label: 'ثانیه' },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      
      <div className="flex items-center gap-2 text-yellow-400 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-yellow-500/30 shadow-lg">
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="text-xs font-bold">شروع ثبت‌نام تا:</span>
      </div>

      {/* تایمر جعبه‌ای */}
      <div className="flex gap-3 text-center" dir="ltr">
        {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl ring-1 ring-white/5 transform transition-all hover:scale-105">
                    <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-widest drop-shadow-md">
                        {String(unit.value).padStart(2, '0')}
                    </span>
                </div>
                <span className="text-[10px] text-gray-300 mt-2 font-bold tracking-wide">{unit.label}</span>
            </div>
        ))}
      </div>

    </div>
  );
}