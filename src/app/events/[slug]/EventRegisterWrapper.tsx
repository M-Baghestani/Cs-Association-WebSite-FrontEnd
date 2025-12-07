// src/app/events/[slug]/EventRegisterWrapper.tsx
"use client";

import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RegisterButton from '../../../components/RegisterButton'; 
import PaymentProofModal from '../../../components/PaymentProofModal'; 
// ✅ FIX: ایمپورت تایپ EventType از فایل مرکزی
import { EventType } from '../../../types/event'; 
import { RegistrationStatus } from '../../../types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface EventRegisterWrapperProps {
  // ✅ FIX: استفاده از EventType مرکزی
  event: EventType;
}

/**
 * EventRegisterWrapper یک کامپوننت Client است که منطق وضعیت ثبت‌نام، 
 * تعامل با API و مدیریت مودال پرداخت را بر عهده دارد.
 */
export default function EventRegisterWrapper({ event }: EventRegisterWrapperProps) {
  const [userRegistration, setUserRegistration] = useState(event.userRegistration || null);
  const [registeredCount, setRegisteredCount] = useState(event.registeredCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // تابع فچ وضعیت ثبت‌نام (برای به‌روزرسانی پس از عملیات)
  const fetchRegistrationStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setUserRegistration(null);
        return;
    }

    try {
        const res = await axios.get(`${API_URL}/events/${event._id}/my-status`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserRegistration(res.data.data.registration || null);
        setRegisteredCount(res.data.data.registeredCount);

    } catch (error) {
        setUserRegistration(null);
    }
  }, [event._id]);


  // هندلر موفقیت (به‌روزرسانی وضعیت پس از ثبت‌نام یا ارسال مدرک پرداخت)
  const handleSuccess = async () => {
    toast.success("عملیات با موفقیت انجام شد و وضعیت به‌روز شد. ✅");
    await fetchRegistrationStatus();
    setIsModalOpen(false);
  }

  // هندلر اصلی ثبت‌نام (فشردن دکمه)
  const handleRegister = async () => {
    if (!localStorage.getItem('token')) {
        toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید.");
        // در اینجا می‌توانید کاربر را به صفحه لاگین هدایت کنید
        return;
    }
    
    // اگر رویداد رایگان است، ثبت‌نام نهایی را انجام بده
    if (event.isFree) {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      try {
        await axios.post(`${API_URL}/events/${event._id}/register`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("ثبت‌نام رایگان با موفقیت انجام شد ✅");
        await fetchRegistrationStatus(); 
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'خطا در ثبت‌نام.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // اگر رویداد پولی است، مودال پرداخت را باز کن
      setIsModalOpen(true);
    }
  };

  // چک کردن وضعیت کلی برای نمایش دکمه
  if (event.registrationStatus === 'CLOSED') {
    return <div className="text-red-400 font-bold p-4 bg-red-900/20 rounded-lg">مهلت ثبت‌نام به پایان رسیده است.</div>;
  }
  
  if (event.registrationStatus === 'SCHEDULED') {
    // می‌توانید از کامپوننت CountdownTimer استفاده کنید
    return <div className="text-yellow-400 font-bold p-4 bg-yellow-900/20 rounded-lg">ثبت‌نام هنوز شروع نشده است.</div>;
  }

  return (
    <>
      {/* این کامپوننت RegisterButton اصلی، تنها یک دکمه نمایش می‌دهد و props ساده می‌خواهد */}
      <RegisterButton
        eventId={event._id}
        isFree={event.isFree}
        price={event.price}
        capacity={event.capacity}
        registeredCount={registeredCount}
        userRegistration={userRegistration}
        onRegisterSuccess={handleSuccess}
        handleRegister={handleRegister}
        isLoading={isLoading}
      />
      
      {/* مودال پرداخت برای رویدادهای پولی */}
      {!event.isFree && (
        <PaymentProofModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventId={event._id}
          eventPrice={event.price}
          onRegistrationSuccess={handleSuccess}
        />
      )}
    </>
  );
}