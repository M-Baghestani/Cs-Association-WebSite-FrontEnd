// src/components/RegisterButton.tsx
"use client";

import { Loader2, CheckCircle } from "lucide-react";

interface RegisterButtonProps {
  eventId: string;
  isFree: boolean;
  price: number;
  capacity: number;
  registeredCount: number;
  userRegistration?: any; // وضعیت ثبت‌نام کاربر
  onRegisterSuccess: () => void;
  handleRegister: () => void;
  isLoading: boolean;
}

export default function RegisterButton({
  isFree,
  price,
  capacity,
  registeredCount,
  userRegistration,
  handleRegister,
  isLoading,
}: RegisterButtonProps) {
  const isFull = registeredCount >= capacity;

  // ✅ حالت ۱: کاربر قبلاً ثبت‌نام کرده است
  if (userRegistration) {
    // اگر وضعیت در انتظار تایید باشد
    if (userRegistration.status === "PENDING" && !isFree) {
        return (
            <button
              disabled
              className="w-full bg-yellow-600/20 border border-yellow-500/50 text-yellow-200 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed"
            >
              ⏳ ثبت‌نام در انتظار تایید
            </button>
        );
    }

    // حالت ثبت‌نام موفق/نهایی
    return (
      <button
        disabled
        className="w-full bg-green-600/20 border border-green-500/50 text-green-400 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed shadow-[0_0_15px_rgba(74,222,128,0.1)]"
      >
        <CheckCircle size={24} />
        شما در این رویداد ثبت‌نام شده‌اید
      </button>
    );
  }

  // ✅ حالت ۲: ظرفیت تکمیل شده
  if (isFull) {
    return (
      <button
        disabled
        className="w-full bg-gray-700/50 text-gray-400 py-4 rounded-xl font-bold text-lg cursor-not-allowed border border-gray-600"
      >
        ⛔ ظرفیت تکمیل شد
      </button>
    );
  }

  // ✅ حالت ۳: دکمه ثبت‌نام عادی
  return (
    <button
      onClick={handleRegister}
      disabled={isLoading}
      className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
        ${
          isFree
            ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25"
            : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-500/25"
        }`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : isFree ? (
        "ثبت‌نام رایگان"
      ) : (
        `ثبت‌نام (${price.toLocaleString("fa-IR")} تومان)`
      )}
    </button>
  );
}