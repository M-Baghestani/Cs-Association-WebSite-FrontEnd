// src/components/Event/CountdownTimer.tsx
"use client";

import { JSX, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  opensAt: string; 
}

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft: { 
    days: number, 
    hours: number, 
    minutes: number, 
    seconds: number, 
    expired: boolean 
  } = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: difference <= 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  return timeLeft;
};

export default function CountdownTimer({ opensAt }: CountdownProps) {
  const targetDate = new Date(opensAt);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    if (timeLeft.expired) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, targetDate]);

  if (timeLeft.expired) {
    return <div className="text-sm font-bold text-green-400">ثبت‌نام شروع شد!</div>;
  }

  const timerComponents: JSX.Element[] = [];

  const timeUnits = [
    { value: timeLeft.days, label: 'روز' },
    { value: timeLeft.hours, label: 'ساعت' },
    { value: timeLeft.minutes, label: 'دقیقه' },
  ];

  // نمایش ثانیه فقط در زمان نزدیک (کمتر از یک ساعت)
  if (timeLeft.days === 0 && timeLeft.hours === 0) {
    timeUnits.push({ value: timeLeft.seconds, label: 'ثانیه' });
  }

  timeUnits.forEach(({ value, label }) => {
    if (value > 0 || timerComponents.length > 0) {
      timerComponents.push(
        <TimeBox key={label} value={value} label={label} />
      );
    }
  });


  return (
    <div className="flex flex-col items-center justify-center gap-4 text-gray-300">
      <div className="flex items-center gap-2 text-cyan-400">
        <Clock className="w-5 h-5" />
        <span className="text-base font-bold">شروع ثبت‌نام تا:</span>
      </div>
      <div className="flex gap-2 text-center rtl-text">
        {timerComponents.length ? timerComponents : <span className="text-sm">لحظاتی دیگر...</span>}
      </div>
    </div>
  );
}

const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <span className="flex flex-col items-center justify-center bg-white/5 p-3 rounded-lg min-w-[50px] border border-white/10 shadow-lg">
      <span className="text-xl font-extrabold text-white">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </span>
);