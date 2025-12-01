"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Clock, Loader2 } from 'lucide-react';

interface CountdownProps {
  opensAt: string; 
}

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  
  if (difference <= 0) {
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

export default function CountdownTimer({ opensAt }: CountdownProps) {
  const router = useRouter();
  const targetDate = new Date(opensAt);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (timeLeft.expired && !isRefreshing) {
        setIsRefreshing(true);
        router.refresh(); 
        return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, targetDate, router, isRefreshing]);

  // جلوگیری از عدم تطابق سرور و کلاینت (Hydration)
  if (!mounted) return null;

  if (timeLeft.expired) {
    return (
        <div className="flex items-center gap-2 text-green-400 bg-green-900/40 px-4 py-2 rounded-lg animate-pulse border border-green-500/30 backdrop-blur-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-bold">در حال بازگشایی ثبت‌نام...</span>
        </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'روز' },
    { value: timeLeft.hours, label: 'ساعت' },
    { value: timeLeft.minutes, label: 'دقیقه' },
    { value: timeLeft.seconds, label: 'ثانیه' },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full">
      
      <div className="flex items-center gap-2 text-yellow-400 mb-1">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-bold">شروع ثبت‌نام تا:</span>
      </div>

      {/* تایمر جعبه‌ای */}
      <div className="flex gap-2 text-center" dir="ltr">
        {timeUnits.map((unit, index) => (
           // فقط اگر مقدار صفر نیست یا واحد ثانیه/دقیقه است نشان بده (برای تمیزی)
           (unit.value > 0 || unit.label === 'ثانیه' || unit.label === 'دقیقه') && (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
                    <span className="text-xl font-mono font-bold text-white">
                        {String(unit.value).padStart(2, '0')}
                    </span>
                </div>
                <span className="text-[10px] text-gray-300 mt-1 font-medium">{unit.label}</span>
              </div>
           )
        ))}
      </div>

    </div>
  );
}