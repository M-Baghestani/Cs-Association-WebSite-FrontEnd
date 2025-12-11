// src/app/events/[id]/EventRegisterWrapper.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RegisterButton from "../../../components/RegisterButton";
import PaymentProofModal from "../../../components/PaymentProofModal";
import FreeRegisterModal from "../../../components/FreeRegisterModal";
// ✅ ایمپورت تایپ مورد نیاز
import { EventType, RegistrationStatusType } from "../../../types/event"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface EventRegisterWrapperProps {
  event: EventType;
}

export default function EventRegisterWrapper({
  event,
}: EventRegisterWrapperProps) {
  const [userRegistration, setUserRegistration] = useState(
    event.userRegistration || null
  );
  const [registeredCount, setRegisteredCount] = useState(event.registeredCount);
  const [isLoading, setIsLoading] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);

  // تابع دریافت آخرین وضعیت ثبت‌نام از سرور
  const fetchRegistrationStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserRegistration(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/events/${event._id}/my-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRegistration(res.data.data.registration || null);
      setRegisteredCount(res.data.data.registeredCount);
    } catch (error) {
      console.error("Error fetching status", error);
    }
  }, [event._id]);

  useEffect(() => {
    fetchRegistrationStatus();
  }, [fetchRegistrationStatus]);

  // ✅ FIX: هندلر مشترک موفقیت با Optimistic Update
  const handleSuccess = async (status: RegistrationStatusType) => {
    toast.success("ثبت‌نام شما با موفقیت انجام شد ✅");
    setIsPaymentModalOpen(false);
    setIsFreeModalOpen(false);
    
    // ✅ ایمن‌سازی آپدیت: بلافاصله وضعیت را در UI تغییر بده
    setUserRegistration(prev => {
        // اگر هنوز ثبت‌نامی وجود ندارد (null)، یک شیء جدید با وضعیت موقت بساز.
        if (!prev) {
            return { 
                status: status,
                _id: 'temp-id', 
            };
        }
        // اگر قبلا شیء وجود دارد، فقط وضعیتش را آپدیت کن.
        return { ...prev, status: status };
    });

    // سپس در پس‌زمینه وضعیت دقیق را از سرور می‌گیریم.
    await fetchRegistrationStatus();
  };

  // هندلر کلیک روی دکمه ثبت‌نام
  const handleRegisterClick = () => {
    if (userRegistration) {
      toast.success("شما قبلاً در این رویداد ثبت‌نام کرده‌اید.");
      return;
    }

    if (!localStorage.getItem("token")) {
      toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید.");
      return;
    }

    if (event.isFree) {
      setIsFreeModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const submitFreeRegistration = async (data: {
    telegram: string;
    questions: string[];
  }) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/events/${event._id}/register`,
        {
          telegram: data.telegram,
          questions: data.questions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ فراخوانی با وضعیت PENDING (برای رویداد رایگان معمولاً نیاز به تایید ادمین دارد)
      await handleSuccess('PENDING'); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ثبت‌نام.");
    } finally {
      setIsLoading(false);
    }
  };

  if (event.registrationStatus === "CLOSED") {
    return (
      <div className="text-red-400 font-bold p-4 bg-red-900/20 rounded-lg text-center border border-red-500/30">
        مهلت ثبت‌نام به پایان رسیده است.
      </div>
    );
  }

  if (event.registrationStatus === "SCHEDULED") {
    return (
      <div className="text-yellow-400 font-bold p-4 bg-yellow-900/20 rounded-lg text-center border border-yellow-500/30">
        ثبت‌نام هنوز شروع نشده است.
      </div>
    );
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
        // onRegisterSuccess در این کامپوننت دیگر استفاده نمی‌شود و فقط برای اطمینان حفظ شده است.
        // لاجیک موفقیت اکنون توسط هر مدال فراخوانی می‌شود.
        onRegisterSuccess={() => {}} 
        handleRegister={handleRegisterClick}
        isLoading={isLoading}
      />

      {/* ✅ مدال ثبت‌نام رایگان */}
      <FreeRegisterModal
        isOpen={isFreeModalOpen}
        onClose={() => setIsFreeModalOpen(false)}
        onSubmit={submitFreeRegistration}
        isLoading={isLoading}
        hasQuestions={event.hasQuestions}
      />

      {/* ✅ مدال ثبت‌نام پولی */}
      <PaymentProofModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        eventId={event._id}
        eventPrice={event.price}
        // ✅ فراخوانی با وضعیت RECEIPT_PENDING (در انتظار تایید رسید)
        onRegistrationSuccess={() => handleSuccess('RECEIPT_PENDING')} 
        hasQuestions={event.hasQuestions}
      />
    </>
  );
}