// src/app/events/[slug]/EventRegisterWrapper.tsx
"use client";

import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RegisterButton from '../../../components/RegisterButton'; 
import PaymentProofModal from '../../../components/PaymentProofModal'; 
import FreeRegisterModal from '../../../components/FreeRegisterModal';
import { EventType } from '../../../types/event'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface EventRegisterWrapperProps {
  event: EventType;
}

export default function EventRegisterWrapper({ event }: EventRegisterWrapperProps) {
  const [userRegistration, setUserRegistration] = useState(event.userRegistration || null);
  const [registeredCount, setRegisteredCount] = useState(event.registeredCount);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🟢 تغییر: مدیریت دو مودال جداگانه برای رایگان و پولی
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);

  // تابع دریافت آخرین وضعیت ثبت‌نام
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


  // هندلر مشترک موفقیت (بستن مودال‌ها و آپدیت)
  const handleSuccess = async () => {
    toast.success("ثبت‌نام شما با موفقیت انجام شد ✅");
    await fetchRegistrationStatus();
    setIsPaymentModalOpen(false);
    setIsFreeModalOpen(false);
  }

  // هندلر کلیک روی دکمه ثبت‌نام
  const handleRegisterClick = () => {
    if (!localStorage.getItem('token')) {
        toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید.");
        return;
    }
    
    // اگر رایگان است -> مودال رایگان (تلگرام + سوال)
    if (event.isFree) {
      setIsFreeModalOpen(true);
    } else {
      // اگر پولی است -> مودال پرداخت
      setIsPaymentModalOpen(true);
    }
  };

  // 🟢 تابع جدید: ارسال نهایی ثبت‌نام رایگان (توسط مودال صدا زده می‌شود)
  const submitFreeRegistration = async (data: { telegram: string; questions: string[] }) => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      try {
        // ارسال آیدی تلگرام و سوالات به بک‌اند
        await axios.post(`${API_URL}/events/${event._id}/register`, 
            {
                telegram: data.telegram,
                questions: data.questions
            }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        
        // در صورت موفقیت
        handleSuccess();
        
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'خطا در ثبت‌نام.');
      } finally {
        setIsLoading(false);
      }
  };

  // چک کردن وضعیت رویداد
  if (event.registrationStatus === 'CLOSED') {
    return <div className="text-red-400 font-bold p-4 bg-red-900/20 rounded-lg">مهلت ثبت‌نام به پایان رسیده است.</div>;
  }
  
  if (event.registrationStatus === 'SCHEDULED') {
    return <div className="text-yellow-400 font-bold p-4 bg-yellow-900/20 rounded-lg">ثبت‌نام هنوز شروع نشده است.</div>;
  }

  return (
    <>
      <RegisterButton
        eventId={event._id}
        isFree={event.isFree}
        price={event.price}
        capacity={event.capacity}
        registeredCount={registeredCount}
        userRegistration={userRegistration}
        onRegisterSuccess={handleSuccess}
        handleRegister={handleRegisterClick}
        isLoading={isLoading}
      />
      
      {/* 🟢 مودال ثبت‌نام رایگان (تلگرام + سوال) */}
      {event.isFree && (
        <FreeRegisterModal
            isOpen={isFreeModalOpen}
            onClose={() => setIsFreeModalOpen(false)}
            onSubmit={submitFreeRegistration}
            isLoading={isLoading}
        />
      )}

      {/* 🟢 مودال پرداخت (برای رویدادهای پولی) */}
      {!event.isFree && (
        <PaymentProofModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          eventId={event._id}
          eventPrice={event.price}
          onRegistrationSuccess={handleSuccess}
        />
      )}
    </>
  );
}