// src/app/events/[id]/EventRegisterWrapper.tsx
"use client";

import { useState, useCallback, useEffect } from 'react'; // 👈 useEffect اضافه شد
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
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);

  // تابع دریافت آخرین وضعیت ثبت‌نام از سرور
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
        
        // آپدیت کردن استیت‌ها با داده تازه
        setUserRegistration(res.data.data.registration || null);
        setRegisteredCount(res.data.data.registeredCount);

    } catch (error) {
        console.error("Error fetching status", error);
    }
  }, [event._id]);

  // ✅ اضافه شده: محض لود شدن کامپوننت، وضعیت دقیق را چک کن
  useEffect(() => {
    fetchRegistrationStatus();
  }, [fetchRegistrationStatus]);

  // هندلر مشترک موفقیت
  const handleSuccess = async () => {
    toast.success("ثبت‌نام شما با موفقیت انجام شد ✅");
    setIsPaymentModalOpen(false);
    setIsFreeModalOpen(false);
    // بلافاصله وضعیت جدید را از سرور می‌گیریم تا دکمه آپدیت شود
    await fetchRegistrationStatus();
  }

  // هندلر کلیک روی دکمه ثبت‌نام
  const handleRegisterClick = () => {
    // ✅ چک کردن اینکه آیا کاربر قبلا ثبت‌نام کرده؟
    if (userRegistration) {
        toast.success("شما قبلاً در این رویداد ثبت‌نام کرده‌اید.");
        return; // اگر ثبت‌نام کرده، هیچ کاری نکن
    }

    if (!localStorage.getItem('token')) {
        toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید.");
        return;
    }
    
    if (event.isFree) {
      setIsFreeModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const submitFreeRegistration = async (data: { telegram: string; questions: string[] }) => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      try {
        await axios.post(`${API_URL}/events/${event._id}/register`, 
            {
                telegram: data.telegram,
                questions: data.questions
            }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        
        await handleSuccess(); // ✅ منتظر ماندن برای آپدیت وضعیت
        
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'خطا در ثبت‌نام.');
      } finally {
        setIsLoading(false);
      }
  };

  if (event.registrationStatus === 'CLOSED') {
    return <div className="text-red-400 font-bold p-4 bg-red-900/20 rounded-lg text-center border border-red-500/30">مهلت ثبت‌نام به پایان رسیده است.</div>;
  }
  
  if (event.registrationStatus === 'SCHEDULED') {
    return <div className="text-yellow-400 font-bold p-4 bg-yellow-900/20 rounded-lg text-center border border-yellow-500/30">ثبت‌نام هنوز شروع نشده است.</div>;
  }

  return (
    <>
      <RegisterButton
        eventId={event._id}
        isFree={event.isFree}
        price={event.price}
        capacity={event.capacity}
        registeredCount={registeredCount}
        userRegistration={userRegistration} // این پراپ باعث می‌شود دکمه ظاهر "ثبت‌نام شده" بگیرد
        onRegisterSuccess={handleSuccess}
        handleRegister={handleRegisterClick}
        isLoading={isLoading}
      />
      
      {event.isFree && (
        <FreeRegisterModal
            isOpen={isFreeModalOpen}
            onClose={() => setIsFreeModalOpen(false)}
            onSubmit={submitFreeRegistration}
            isLoading={isLoading}
        />
      )}

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